import "reflect-metadata";
import { closeTestingConnections, createTestingConnections, reloadTestingDatabases } from "../../../utils/test-utils";
import { Connection } from "../../../../src/connection/Connection";
import { Post } from "./entity/Post";
import { expect } from "chai";
import {PostInformation} from "./entity/PostInformation";

describe("other issues > entity listeners must work in optional embeddeds as well", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["postgres"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const post1 = new Post();
        post1.title = "First title";
        post1.text = "About this post";
        await connection.manager.save(post1);

        const post2 = new Post();
        post2.title = "Second title";
        post2.text = "About this post";
        post2.information = new PostInformation();
        await connection.manager.save(post2);

        const loadedPosts = await connection
            .manager
            .createQueryBuilder(Post, "post")
            .orderBy("post.id")
            .getMany();

        expect(loadedPosts[0]).not.to.be.empty;
        expect(loadedPosts[0]!.title).not.to.be.empty;
        expect(loadedPosts[0]!.text).not.to.be.empty;
        loadedPosts[0]!.title.should.be.equal("First title");
        loadedPosts[0]!.text.should.be.equal("About this post");

        expect(loadedPosts[1]).not.to.be.empty;
        loadedPosts[1]!.information!.description!.should.be.equal("default post description");

    })));

});
