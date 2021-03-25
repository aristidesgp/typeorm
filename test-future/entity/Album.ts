import {entity} from "../../src/future/postgres";

export const AlbumEntity = entity({
    columns: {
        id: {
            type: "int"
        },
        name: {
            type: "varchar"
        }
    },
    relations: {
        photos: {
            type: "one-to-many",
            inverse: "album",
            reference: "PhotoEntity" as const
        }
    },
})
