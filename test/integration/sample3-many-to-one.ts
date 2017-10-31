import "reflect-metadata";
import {expect} from "chai";
import {Connection} from "../../src/connection/Connection";
import {createConnection} from "../../src/index";
import {Repository} from "../../src/repository/Repository";
import {PostDetails} from "../../sample/sample3-many-to-one/entity/PostDetails";
import {Post} from "../../sample/sample3-many-to-one/entity/Post";
import {PostCategory} from "../../sample/sample3-many-to-one/entity/PostCategory";
import {PostAuthor} from "../../sample/sample3-many-to-one/entity/PostAuthor";
import {PostMetadata} from "../../sample/sample3-many-to-one/entity/PostMetadata";
import {PostImage} from "../../sample/sample3-many-to-one/entity/PostImage";
import {PostInformation} from "../../sample/sample3-many-to-one/entity/PostInformation";
import {setupSingleTestingConnection} from "../utils/test-utils";

describe("many-to-one", function() {

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    // connect to db
    let connection: Connection;
    before(async function() {
        connection = await createConnection(setupSingleTestingConnection("mysql", {
            entities: [Post, PostDetails, PostCategory, PostMetadata, PostImage, PostInformation, PostAuthor],
        }));
    });

    after(() => connection.close());

    // clean up database before each test
    function reloadDatabase() {
        return connection.synchronize(true);
    }

    let postRepository: Repository<Post>,
        postDetailsRepository: Repository<PostDetails>,
        postCategoryRepository: Repository<PostCategory>,
        postImageRepository: Repository<PostImage>,
        postMetadataRepository: Repository<PostMetadata>;
    before(function() {
        postRepository = connection.getRepository(Post);
        postDetailsRepository = connection.getRepository(PostDetails);
        postCategoryRepository = connection.getRepository(PostCategory);
        postImageRepository = connection.getRepository(PostImage);
        postMetadataRepository = connection.getRepository(PostMetadata);
    });

    // -------------------------------------------------------------------------
    // Specifications
    // -------------------------------------------------------------------------

    describe("insert post and details (has inverse relation + full cascade options)", function() {
        let newPost: Post, details: PostDetails, savedPost: Post;
        
        before(reloadDatabase);

        before(function() {
            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";
            
            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;
            return postRepository.save(newPost).then(post => savedPost = post as Post);
        });

        it("should return the same post instance after its created", function () {
            savedPost.should.be.equal(newPost);
        });

        it("should return the same post details instance after its created", function () {
            savedPost.details.should.be.equal(newPost.details);
        });

        it("should have a new generated id after post is created", function () {
            expect(savedPost.id).not.to.be.empty;
            expect(savedPost.details.id).not.to.be.empty;
        });

        it("should have inserted post in the database", function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            
            return postRepository.findOne(savedPost.id).should.eventually.eql(expectedPost);
        });

        it("should have inserted post details in the database", function() {
            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;
            
            return postDetailsRepository.findOne(savedPost.details.id).should.eventually.eql(expectedDetails);
        });

        it("should load post and its details if left join used", function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            expectedPost.details = new PostDetails();
            expectedPost.details.id = savedPost.details.id;
            expectedPost.details.authorName = savedPost.details.authorName;
            expectedPost.details.comment = savedPost.details.comment;
            expectedPost.details.metadata = savedPost.details.metadata;
            
            return postRepository
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.details", "details")
                .where("post.id=:id")
                .setParameter("id", savedPost.id)
                .getOne()
                .should.eventually.eql(expectedPost);
        });

        it("should load details and its post if left join used (from reverse side)", function() {

            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;

            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            
            expectedDetails.posts = [];
            expectedDetails.posts.push(expectedPost);
            
            return postDetailsRepository
                .createQueryBuilder("details")
                .leftJoinAndSelect("details.posts", "posts")
                .where("details.id=:id")
                .setParameter("id", savedPost.id)
                .getOne()
                .should.eventually.eql(expectedDetails);
        });

        it("should load saved post without details if left joins are not specified", function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            
            return postRepository
                .createQueryBuilder("post")
                .where("post.id=:id", { id: savedPost.id })
                .getOne()
                .should.eventually.eql(expectedPost);
        });

        it("should load saved post without details if left joins are not specified", function() {
            const expectedDetails = new PostDetails();
            expectedDetails.id = savedPost.details.id;
            expectedDetails.authorName = savedPost.details.authorName;
            expectedDetails.comment = savedPost.details.comment;
            expectedDetails.metadata = savedPost.details.metadata;
            
            return postDetailsRepository
                .createQueryBuilder("details")
                .where("details.id=:id", { id: savedPost.id })
                .getOne()
                .should.eventually.eql(expectedDetails);
        });

    });

    describe("insert post and category (one-side relation)", function() {
        let newPost: Post, category: PostCategory, savedPost: Post;

        before(reloadDatabase);

        before(function() {
            category = new PostCategory();
            category.name = "technology";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.category = category;

            return postRepository.save(newPost).then(post => savedPost = post as Post);
        });

        it("should return the same post instance after its created", function () {
            savedPost.should.be.equal(newPost);
        });

        it("should return the same post category instance after its created", function () {
            savedPost.category.should.be.equal(newPost.category);
        });

        it("should have a new generated id after post is created", function () {
            expect(savedPost.id).not.to.be.empty;
            expect(savedPost.category.id).not.to.be.empty;
        });

        it("should have inserted post in the database", function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.text = savedPost.text;
            expectedPost.title = savedPost.title;
            return postRepository.findOne(savedPost.id).should.eventually.eql(expectedPost);
        });

        it("should have inserted category in the database", function() {
            const expectedPost = new PostCategory();
            expectedPost.id = savedPost.category.id;
            expectedPost.name = "technology";
            return postCategoryRepository.findOne(savedPost.category.id).should.eventually.eql(expectedPost);
        });

        it("should load post and its category if left join used", function() {
            const expectedPost = new Post();
            expectedPost.id = savedPost.id;
            expectedPost.title = savedPost.title;
            expectedPost.text = savedPost.text;
            expectedPost.category = new PostCategory();
            expectedPost.category.id = savedPost.category.id;
            expectedPost.category.name = savedPost.category.name;

            return postRepository
                .createQueryBuilder("post")
                .leftJoinAndSelect("post.category", "category")
                .where("post.id=:id", { id: savedPost.id })
                .getOne()
                .should.eventually.eql(expectedPost);
        });

        it("should load details and its post if left join used (from reverse side)", function() {
            // later need to specify with what exception we reject it
            /*return postCategoryRepository
                .createQueryBuilder("category")
                .leftJoinAndSelect("category.post", "post")
                .where("category.id=:id", { id: savedPost.id })
                .getSingleResult()
                .should.be.rejectedWith(Error);*/ // not working, find fix
        });
        
    });

    describe("cascade updates should not be executed when cascadeUpdate option is not set", function() {
        let newPost: Post, details: PostDetails, savedPost: Post;

        before(reloadDatabase);

        before(function() {

            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;

            return postRepository
                .save(newPost)
                .then(post => savedPost = post as Post);
        });

        it("should ignore updates in the model and do not update the db when entity is updated", function () {
            newPost.details.comment = "i am updated comment";
            return postRepository.save(newPost).then(updatedPost => {
                updatedPost.details!.comment!.should.be.equal("i am updated comment");
                return postRepository
                    .createQueryBuilder("post")
                    .leftJoinAndSelect("post.details", "details")
                    .where("post.id=:id")
                    .setParameter("id", updatedPost.id)
                    .getOne();
            }).then(updatedPostReloaded => {
                updatedPostReloaded!.details.comment!.should.be.equal("this is post");
            });
        }); // todo: also check that updates throw exception in strict cascades mode
    });

    describe("cascade remove should not be executed when cascadeRemove option is not set", function() {
        let newPost: Post, details: PostDetails, savedPost: Post;

        before(reloadDatabase);

        before(function() {

            details = new PostDetails();
            details.authorName = "Umed";
            details.comment = "this is post";
            details.metadata = "post,posting,postman";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";
            newPost.details = details;

            return postRepository
                .save(newPost)
                .then(post => savedPost = post as Post);
        });

        it("should ignore updates in the model and do not update the db when entity is updated", function () {
            delete newPost.details;
            return postRepository.save(newPost).then(updatedPost => {
                return postRepository
                    .createQueryBuilder("post")
                    .leftJoinAndSelect("post.details", "details")
                    .where("post.id=:id")
                    .setParameter("id", updatedPost.id)
                    .getOne();
            }).then(updatedPostReloaded => {
                updatedPostReloaded!.details.comment!.should.be.equal("this is post");
            });
        });
    });

    describe("cascade updates should be executed when cascadeUpdate option is set", function() {
        let newPost: Post, newImage: PostImage, savedImage: PostImage;

        before(reloadDatabase);

        it("should update a relation successfully when updated", function () {

            newImage = new PostImage();
            newImage.url = "logo.png";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";

            return postImageRepository
                .save(newImage)
                .then(image => {
                    savedImage = image as PostImage;
                    newPost.image = image as PostImage;
                    return postRepository.save(newPost);

                }).then(post => {
                    newPost = post as Post;
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.image", "image")
                        .where("post.id=:id")
                        .setParameter("id", post.id)
                        .getOne();

                }).then(loadedPost => {
                    loadedPost!.image.url = "new-logo.png";
                    return postRepository.save(loadedPost!);

                }).then(() => {
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.image", "image")
                        .where("post.id=:id")
                        .setParameter("id", newPost.id)
                        .getOne();
                    
                }).then(reloadedPost => {
                    reloadedPost!.image.url.should.be.equal("new-logo.png");
                });
        });

    });

    describe("cascade remove should be executed when cascadeRemove option is set", function() {
        let newPost: Post, newMetadata: PostMetadata, savedMetadata: PostMetadata;

        before(reloadDatabase);

        it("should remove a relation entity successfully when removed", function () {

            newMetadata = new PostMetadata();
            newMetadata.description = "this is post metadata";

            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";

            return postMetadataRepository
                .save(newMetadata)
                .then(metadata => {
                    savedMetadata = metadata as PostMetadata;
                    newPost.metadata = metadata as PostMetadata;
                    return postRepository.save(newPost);

                }).then(post => {
                    newPost = post as Post;
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.metadata", "metadata")
                        .where("post.id=:id")
                        .setParameter("id", post.id)
                        .getOne();

                }).then(loadedPost => {
                    loadedPost!.metadata = null;
                    return postRepository.save(loadedPost!);

                }).then(() => {
                    return postRepository
                        .createQueryBuilder("post")
                        .leftJoinAndSelect("post.metadata", "metadata")
                        .where("post.id=:id")
                        .setParameter("id", newPost.id)
                        .getOne();

                }).then(reloadedPost => {
                    expect(reloadedPost!.metadata).to.be.null;
                });
        });

    });

    describe("insert post details from reverse side", function() {
        let newPost: Post, details: PostDetails, savedDetails: PostDetails;

        before(reloadDatabase);

        before(function() {
            newPost = new Post();
            newPost.text = "Hello post";
            newPost.title = "this is post title";

            details = new PostDetails();
            details.comment = "post details comment";
            details.posts = [];
            details.posts.push(newPost);

            return postDetailsRepository.save(details).then(details => savedDetails = details as PostDetails);
        });

        it("should return the same post instance after its created", function () {
            savedDetails.posts[0].should.be.equal(newPost);
        });

        it("should return the same post details instance after its created", function () {
            savedDetails.should.be.equal(details);
        });

        it("should have a new generated id after post is created", function () {
            expect(savedDetails.id).not.to.be.empty;
            expect(details.id).not.to.be.empty;
        });

        it("should have inserted post in the database", function() {
            const expectedPost = new Post();
            expectedPost.id = newPost.id;
            expectedPost.text = newPost.text;
            expectedPost.title = newPost.title;
            return postRepository.findOne(savedDetails.id).should.eventually.eql(expectedPost);
        });

        it("should have inserted details in the database", function() {
            const expectedDetails = new PostDetails();
            expectedDetails.id = details.id;
            expectedDetails.comment = details.comment;
            expectedDetails.metadata = null;
            expectedDetails.authorName = null;
            return postDetailsRepository.findOne(details.id).should.eventually.eql(expectedDetails);
        });

        it("should load post and its details if left join used", function() {
            const expectedDetails = new PostDetails();
            expectedDetails.id = savedDetails.id;
            expectedDetails.comment = savedDetails.comment;
            expectedDetails.metadata = null;
            expectedDetails.authorName = null;
            expectedDetails.posts = [];
            expectedDetails.posts.push(new Post());
            expectedDetails.posts[0].id = newPost.id;
            expectedDetails.posts[0].text = newPost.text;
            expectedDetails.posts[0].title = newPost.title;

            return postDetailsRepository
                .createQueryBuilder("details")
                .leftJoinAndSelect("details.posts", "posts")
                .where("details.id=:id", { id: savedDetails.id })
                .getOne()
                .should.eventually.eql(expectedDetails);
        });

    });

});
