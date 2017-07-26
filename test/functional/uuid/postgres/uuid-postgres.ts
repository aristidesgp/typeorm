import "reflect-metadata";
import {expect} from "chai";
import {Record} from "./entity/Record";
import {Connection} from "../../../../src/connection/Connection";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {Post} from "./entity/Post";
import {Question} from "./entity/Question";

describe("uuid-postgres", () => {

    let connections: Connection[];
    before(async () => {
        connections = await createTestingConnections({
            entities: [__dirname + "/entity/*{.js,.ts}"],
            enabledDrivers: ["postgres"],
            schemaCreate: true,
            dropSchemaOnConnection: true,
        });
    });
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should make correct schema with Postgres' uuid type", () => Promise.all(connections.map(async connection => {
        const queryRunner = connection.createQueryRunner();
        const schema = await queryRunner.loadTableSchema("record");
        await queryRunner.release();
        expect(schema).not.to.be.empty;
        expect(schema!.columns.find(columnSchema => columnSchema.name === "id" && columnSchema.type === "uuid" && columnSchema.isGenerated)).to.be.not.empty;
    })));

    it("should persist uuid correctly", () => Promise.all(connections.map(async connection => {
        const recordRepo = connection.getRepository(Record);
        const record = new Record();
        record.id = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        const persistedRecord = await recordRepo.save(record);
        const foundRecord = await recordRepo.findOneById(persistedRecord.id);
        expect(foundRecord).to.be.exist;
        expect(foundRecord!.id).to.eq("fd357b8f-8838-42f6-b7a2-ae027444e895");
    })));

    it("should persist uuid correctly when it is generated non primary column", () => Promise.all(connections.map(async connection => {

        const postRepository = connection.getRepository(Post);
        const questionRepository = connection.getRepository(Question);
        const queryRunner = connection.createQueryRunner();
        const postTableSchema = await queryRunner.loadTableSchema("post");
        const questionTableSchema = await queryRunner.loadTableSchema("question");
        await queryRunner.release();

        const post = new Post();
        await postRepository.save(post);
        const loadedPost = await postRepository.findOneById(1);
        expect(loadedPost!.uuid).to.be.exist;
        postTableSchema!.findColumnByName("uuid")!.type.should.be.equal("uuid");

        const post2 = new Post();
        post2.uuid = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        await postRepository.save(post2);
        const loadedPost2 = await postRepository.findOneById(2);
        expect(loadedPost2!.uuid).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");

        const question = new Question();
        question.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";

        const savedQuestion = await questionRepository.save(question);
        expect(savedQuestion!.id).to.be.exist;
        expect(savedQuestion!.uuid).to.be.exist;
        expect(savedQuestion!.uuid2).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(savedQuestion!.uuid3).to.be.null;
        expect(savedQuestion!.uuid4).to.be.exist;

        const loadedQuestion = await questionRepository.findOneById(savedQuestion.id);
        expect(loadedQuestion!.id).to.be.exist;
        expect(loadedQuestion!.uuid).to.be.exist;
        expect(loadedQuestion!.uuid2).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion!.uuid3).to.be.null;
        expect(loadedQuestion!.uuid4).to.be.exist;
        questionTableSchema!.findColumnByName("id")!.type.should.be.equal("uuid");
        questionTableSchema!.findColumnByName("uuid")!.type.should.be.equal("uuid");
        questionTableSchema!.findColumnByName("uuid2")!.type.should.be.equal("uuid");
        questionTableSchema!.findColumnByName("uuid3")!.type.should.be.equal("uuid");

        const question2 = new Question();
        question2.id = "1ecad7f6-23ee-453e-bb44-16eca26d5189";
        question2.uuid = "35b44650-b2cd-44ec-aa54-137fbdf1c373";
        question2.uuid2 = "fd357b8f-8838-42f6-b7a2-ae027444e895";
        question2.uuid3 = null;
        question2.uuid4 = null;
        await questionRepository.save(question2);
        const loadedQuestion2 = await questionRepository.findOneById("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.id).to.equal("1ecad7f6-23ee-453e-bb44-16eca26d5189");
        expect(loadedQuestion2!.uuid).to.equal("35b44650-b2cd-44ec-aa54-137fbdf1c373");
        expect(loadedQuestion2!.uuid2).to.equal("fd357b8f-8838-42f6-b7a2-ae027444e895");
        expect(loadedQuestion2!.uuid3).to.be.null;
        expect(loadedQuestion2!.uuid4).to.be.null;
    })));
});
