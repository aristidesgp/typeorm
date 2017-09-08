import "reflect-metadata";

import {expect} from "chai";

import {Connection} from "../../../src/connection/Connection";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Flight} from "./entity/Flight";
import {PostgresDriver} from "../../../src/driver/postgres/PostgresDriver";


const testDateString = "1989-08-16T10:00:00+03:00";


describe("github issues > #838 Time zones for timestamp columns are incorrectly fetched and persisted in PostgreSQL", () => {

    let connections: Connection[];
    let postgresConnection: Connection;

    before(async () => {

        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            schemaCreate: true,
            dropSchema: true,
        });

        postgresConnection = connections.find(connection => connection.driver instanceof PostgresDriver)!;

    });

    beforeEach(() => reloadTestingDatabases(connections));

    after(() => closeTestingConnections(connections));

    it("should return date & time stored in PostgreSQL database correctly", async () => {

        await postgresConnection.query(`
            INSERT INTO "flight" ("id", "date") VALUES (1, '${testDateString}');
        `);

        const flight = await postgresConnection.manager.findOneById(Flight, 1);

        expect(
            flight!.date.toISOString()
        ).to.equal(
            new Date(testDateString).toISOString()
        );

    });

    it("should persist date & time to the PostgreSQL database correctly", async () => {

        const testDate = new Date(testDateString);

        await postgresConnection.manager.save(new Flight(1, testDate));

        const results = await postgresConnection.query(`
            SELECT date FROM "flight" WHERE id = 1
        `);

        expect(
            results[0].date.toISOString()
        ).to.equal(
            testDate.toISOString()
        );

    });

});
