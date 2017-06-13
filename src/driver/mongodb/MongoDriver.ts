import {Driver} from "../Driver";
import {ConnectionIsNotSetError} from "../error/ConnectionIsNotSetError";
import {DriverOptions} from "../DriverOptions";
import {DriverPackageNotInstalledError} from "../error/DriverPackageNotInstalledError";
import {QueryRunner} from "../../query-runner/QueryRunner";
import {MongoQueryRunner} from "./MongoQueryRunner";
import {ObjectLiteral} from "../../common/ObjectLiteral";
import {ColumnMetadata} from "../../metadata/ColumnMetadata";
import {DriverOptionNotSetError} from "../error/DriverOptionNotSetError";
import {PlatformTools} from "../../platform/PlatformTools";
import {Connection} from "../../connection/Connection";
import {MongoConnectionOptions} from "./MongoConnectionOptions";
import {MappedColumnTypes} from "../types/MappedColumnTypes";
import {ColumnType} from "../types/ColumnTypes";

/**
 * Organizes communication with MongoDB.
 */
export class MongoDriver implements Driver {

    // -------------------------------------------------------------------------
    // Public Properties
    // -------------------------------------------------------------------------

    /**
     * Mongodb does not require to dynamically create query runner each time,
     * because it does not have a regular connection pool as RDBMS systems have.
     */
    queryRunner?: MongoQueryRunner;

    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Mongodb does not need to have column types because they are not used in schema sync.
     */
    supportedDataTypes: ColumnType[] = [];

    /**
     * Mongodb does not need to have a strong defined mapped column types because they are not used in schema sync.
     */
    mappedDataTypes: MappedColumnTypes = {
        createDate: "int",
        updateDate: "int",
        version: "int",
        treeLevel: "int",
        migrationName: "int",
        migrationTimestamp: "int",
    };

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    protected options: MongoConnectionOptions;

    /**
     * Underlying mongodb library.
     */
    protected mongodb: any;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected connection: Connection) {
        this.options = connection.options as MongoConnectionOptions;

        // validate options to make sure everything is correct and driver will be able to establish connection
        this.validateOptions(connection.options);

        // load mongodb package
        this.loadDependencies();
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs connection to the database.
     */
    connect(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.mongodb.MongoClient.connect(this.buildConnectionUrl(), this.options.extra, (err: any, dbConnection: any) => {
                if (err) return fail(err);

                this.queryRunner = new MongoQueryRunner(this.connection, dbConnection);
                ok();
            });
        });
    }

    /**
     * Closes connection with the database.
     */
    async disconnect(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            if (!this.queryRunner)
                return fail(new ConnectionIsNotSetError("mongodb"));

            const handler = (err: any) => err ? fail(err) : ok();
            this.queryRunner.databaseConnection.close(handler);
            this.queryRunner = undefined;
        });
    }

    /**
     * Synchronizes database schema (creates indices).
     */
    async syncSchema(): Promise<void> {
        if (!this.queryRunner)
            throw new ConnectionIsNotSetError("mongodb");

        const promises: Promise<any>[] = [];
        this.connection.entityMetadatas.forEach(metadata => {
            metadata.indices.forEach(index => {
                const options = { name: index.name };
                promises.push(this.queryRunner!.createCollectionIndex(metadata.tableName, index.columnNamesWithOrderingMap, options));
            });
        });
        await Promise.all(promises);
    }

    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner(): QueryRunner {
        // if (!this.queryRunner)
        //     return Promise.reject(new ConnectionIsNotSetError("mongodb"));

        return this.queryRunner!;
    }

    /**
     * Access to the native implementation of the database.
     */
    nativeInterface(): any {
        return {
            driver: this.mongodb,
            connection: this.queryRunner ? this.queryRunner.databaseConnection : undefined
        };
    }

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]] {
        throw new Error(`This operation is not supported by Mongodb driver.`);
    }

    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string {
        return columnName;
    }

    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string {
        return aliasName;
    }

    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string {
        return tableName;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
        return value;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
        return value;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Validate driver options to make sure everything is correct and driver will be able to establish connection.
     */
    protected validateOptions(options: DriverOptions) {
        if (!options.url) {
            if (!options.database)
                throw new DriverOptionNotSetError("database");
        }
    }

    /**
     * Loads all driver dependencies.
     */
    protected loadDependencies(): any {
        try {
            this.mongodb = PlatformTools.load("mongodb");  // try to load native driver dynamically

        } catch (e) {
            throw new DriverPackageNotInstalledError("MongoDB", "mongodb");
        }
    }

    /**
     * Builds connection url that is passed to underlying driver to perform connection to the mongodb database.
     */
    protected buildConnectionUrl(): string {
        if (this.options.url)
            return this.options.url;

        return `mongodb://${this.options.host || "127.0.0.1"}:${this.options.port || "27017"}/${this.options.database}`;
    }

}