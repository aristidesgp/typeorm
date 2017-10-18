import "reflect-metadata";
import {expect} from "chai";
import {Connection} from "../../../../src/connection/Connection";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {SimplePost} from "./entity/SimplePost";
import {SimpleCounters} from "./entity/SimpleCounters";
import {Information} from "./entity/Information";
import {Post} from "./entity/Post";

describe("columns > embedded columns", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should insert / update / remove entity with embedded correctly", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(SimplePost);

        // save few posts
        const post = new SimplePost();
        post.title = "Post";
        post.text = "Everything about post";
        post.counters = new SimpleCounters();
        post.counters.likes = 5;
        post.counters.comments = 1;
        post.counters.favorites = 10;
        post.counters.information = new Information();
        post.counters.information.description = "Hello post";
        await postRepository.save(post);

        const loadedPost = await postRepository.findOne({ title: "Post" });

        expect(loadedPost).to.be.not.empty;
        expect(loadedPost!.counters).to.be.not.empty;
        expect(loadedPost!.counters.information).to.be.not.empty;
        loadedPost!.should.be.instanceOf(SimplePost);
        loadedPost!.title.should.be.equal("Post");
        loadedPost!.text.should.be.equal("Everything about post");
        loadedPost!.counters.should.be.instanceOf(SimpleCounters);
        loadedPost!.counters.likes.should.be.equal(5);
        loadedPost!.counters.comments.should.be.equal(1);
        loadedPost!.counters.favorites.should.be.equal(10);
        loadedPost!.counters.information.should.be.instanceOf(Information);
        loadedPost!.counters.information.description.should.be.equal("Hello post");

        post.title = "Updated post";
        post.counters.comments = 2;
        post.counters.information.description = "Hello updated post";
        await postRepository.save(post);

        const loadedUpdatedPost = await postRepository.findOne({ title: "Updated post" });

        expect(loadedUpdatedPost).to.be.not.empty;
        expect(loadedUpdatedPost!.counters).to.be.not.empty;
        expect(loadedUpdatedPost!.counters.information).to.be.not.empty;
        loadedUpdatedPost!.should.be.instanceOf(SimplePost);
        loadedUpdatedPost!.title.should.be.equal("Updated post");
        loadedUpdatedPost!.text.should.be.equal("Everything about post");
        loadedUpdatedPost!.counters.should.be.instanceOf(SimpleCounters);
        loadedUpdatedPost!.counters.likes.should.be.equal(5);
        loadedUpdatedPost!.counters.comments.should.be.equal(2);
        loadedUpdatedPost!.counters.favorites.should.be.equal(10);
        loadedUpdatedPost!.counters.information.should.be.instanceOf(Information);
        loadedUpdatedPost!.counters.information.description.should.be.equal("Hello updated post");

        await postRepository.remove(post);

        const removedPost = await postRepository.findOne({ title: "Post" });
        const removedUpdatedPost = await postRepository.findOne({ title: "Updated post" });
        expect(removedPost).to.be.empty;
        expect(removedUpdatedPost).to.be.empty;
    })));

    it("should properly generate column names", () => Promise.all(connections.map(async connection => {
        const postRepository = connection.getRepository(Post);
        const columns = postRepository.metadata.columns;
        const databaseColumns = columns.map(c => c.databaseName);

        expect(databaseColumns).to.have.members([
            "id",
            "title",
            "text",

            "countersLikes",
            "countersComments",
            "countersFavorites",

            "countersInformationDescription",
            "countersTestDataDescription",

            "testCountersLikes",
            "testCountersComments",
            "testCountersFavorites",

            "testCountersInformationDescription",
            "testCountersTestDataDescription",
        ]);
    })));
});
