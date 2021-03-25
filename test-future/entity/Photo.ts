import {entity} from "../../src/future/postgres";

export const PhotoEntity = entity({
    columns: {
        id: {
            type: "int"
        },
        filename: {
            type: "varchar",
            nullable: true
        },
    },
    relations: {
        album: {
            type: "many-to-one",
            inverse: "photos",
            reference: "AlbumEntity" as const
        }
    },
})
