import "reflect-metadata";
import {expect} from "chai";
import {createConnection} from "../../../src/index";
import {Post} from "./entity/Post";

describe("sqljs driver > autosave", () => {
    it("should call autoSaveCallback on insert, update and delete", async () => {
        let saves = 0;
        const callback = (database: Uint8Array) => {
            saves++;
        };

        let connection = await createConnection({
            type: "sqljs",
            entities: [Post],
            synchronize: true,
            autoSaveCallback: callback,
            autoSave: true
        });
        
        const repository = connection.getRepository(Post);
        let post = new Post();
        post.title = "A post";
        await repository.save(post);

        let posts = [
            {
                title: "second post"
            },
            {
                title: "third post"
            }
        ];

        repository.createQueryBuilder("api").insert().into(Post).values(posts).execute();

        let savedPost = await repository.findOne({title: "A post"});

        expect(savedPost).not.to.be.undefined;

        if (savedPost) {
            savedPost.title = "A updated post";
            await repository.save(savedPost);
            await repository.remove(savedPost);
        }

        connection.close();

        expect(saves).to.be.equal(5);
    });

    it("should not call autoSaveCallback when autoSave is disabled", async () => {
        let saves = 0;
        const callback = (database: Uint8Array) => {
            saves++;
        };

        let connection = await createConnection({
            type: "sqljs",
            entities: [Post],
            synchronize: true,
            autoSaveCallback: callback,
            autoSave: false
        });
        
        const repository = connection.getRepository(Post);
        let post = new Post();
        post.title = "A post";
        await repository.save(post);

        let savedPost = await repository.findOne({title: "A post"});

        expect(savedPost).not.to.be.undefined;

        if (savedPost) {
            savedPost.title = "A updated post";
            await repository.save(savedPost);
            repository.remove(savedPost);
        }

        connection.close();

        expect(saves).to.be.equal(0);
    });
});
