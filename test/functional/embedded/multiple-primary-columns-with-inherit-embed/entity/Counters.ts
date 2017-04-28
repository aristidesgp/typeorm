import {EmbeddableEntity} from "../../../../../src/decorator/entity/EmbeddableEntity";
import {Column} from "../../../../../src/decorator/columns/Column";
import {PrimaryColumn} from "../../../../../src/decorator/columns/PrimaryColumn";
import {Embedded} from "../../../../../src/decorator/Embedded";
import {Subcounters} from "./Subcounters";

@EmbeddableEntity()
export class Counters {

    @PrimaryColumn({unique: true})
    code: number;

    @Column()
    likes: number;

    @Column()
    comments: number;

    @Column()
    favorites: number;

    @Embedded(() => Subcounters)
    subcounters: Subcounters;

}