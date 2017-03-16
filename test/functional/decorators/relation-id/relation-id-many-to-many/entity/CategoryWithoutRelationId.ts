import {Entity} from "../../../../../../src/decorator/entity/Entity";
import {PrimaryGeneratedColumn} from "../../../../../../src/decorator/columns/PrimaryGeneratedColumn";
import {Column} from "../../../../../../src/decorator/columns/Column";
import {ManyToMany} from "../../../../../../src/decorator/relations/ManyToMany";
import {JoinTable} from "../../../../../../src/decorator/relations/JoinTable";
import {PostWithoutRelationId} from "./PostWithoutRelationId";
import {Image} from "./Image";

@Entity()
export class CategoryWithoutRelationId {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(type => PostWithoutRelationId, post => post.categories)
    posts: PostWithoutRelationId[];

    @ManyToMany(type => Image)
    @JoinTable()
    images: Image[];

    imageIds: number[];

    postIds: number[];

}