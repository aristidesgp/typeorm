import {Entity} from "../../../../src/decorator/entity/Entity";
import {PrimaryGeneratedColumn} from "../../../../src/decorator/columns/PrimaryGeneratedColumn";
import {Column} from "../../../../src/decorator/columns/Column";
import {OneToOne} from "../../../../src/decorator/relations/OneToOne";
import {Post} from "../../entity-change-in-subscribers/entity/Post";

@Entity()
export class PostCategory {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(type => Post, post => post.category)
    post: Post;
}