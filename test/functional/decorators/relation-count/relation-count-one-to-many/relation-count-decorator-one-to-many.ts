import "reflect-metadata";
import * as chai from "chai";
import {expect} from "chai";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../../../utils/test-utils";
import {Connection} from "../../../../../src/connection/Connection";
import {Category} from "./entity/Category";
import {Post} from "./entity/Post";
import {Image} from "./entity/Image";

const should = chai.should();

describe("decorators > relation-count-decorator > one-to-many", () => {
    
    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should load relation count", () => Promise.all(connections.map(async connection => {

        const image1 = new Image();
        image1.isRemoved = true;
        image1.name = "image #1";
        await connection.entityManager.save(image1);

        const image2 = new Image();
        image2.name = "image #2";
        await connection.entityManager.save(image2);

        const image3 = new Image();
        image3.name = "image #3";
        await connection.entityManager.save(image3);

        const category1 = new Category();
        category1.name = "cars";
        category1.isRemoved = true;
        category1.images = [image1, image2];
        await connection.entityManager.save(category1);

        const category2 = new Category();
        category2.name = "BMW";
        await connection.entityManager.save(category2);

        const category3 = new Category();
        category3.name = "airplanes";
        category3.images = [image3];
        await connection.entityManager.save(category3);

        const post1 = new Post();
        post1.title = "about BMW";
        post1.categories = [category1, category2];
        await connection.entityManager.save(post1);

        const post2 = new Post();
        post2.title = "about Boeing";
        post2.categories = [category3];
        await connection.entityManager.save(post2);

        let loadedPosts = await connection.entityManager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .addOrderBy("post.id, categories.id")
            .getMany();

        expect(loadedPosts![0].categoryCount).to.be.equal(2);
        expect(loadedPosts![0].removedCategoryCount).to.be.equal(1);
        expect(loadedPosts![0].categories[0].imageCount).to.be.equal(2);
        expect(loadedPosts![0].categories[0].removedImageCount).to.be.equal(1);
       expect(loadedPosts![0].categories[1].imageCount).to.be.equal(0);
        expect(loadedPosts![1].categoryCount).to.be.equal(1);
        expect(loadedPosts![1].categories[0].imageCount).to.be.equal(1);

        let loadedPost = await connection.entityManager
            .createQueryBuilder(Post, "post")
            .leftJoinAndSelect("post.categories", "categories")
            .where("post.id = :id", { id: 1 })
            .addOrderBy("post.id, categories.id")
            .getOne();

        expect(loadedPost!.categoryCount).to.be.equal(2);
        expect(loadedPost!.categories[0].imageCount).to.be.equal(2);
        expect(loadedPost!.removedCategoryCount).to.be.equal(1);
       expect(loadedPosts![0].categories[1].imageCount).to.be.equal(0);
        expect(loadedPost!.categories[0].removedImageCount).to.be.equal(1);
    })));

});