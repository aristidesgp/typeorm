import {entity} from "../../src/future/postgres";

export enum Role {
    Admin,
    User
}

export const ProfileEmbed = entity({
    columns: {
        bio: {
            type: "varchar"
        },
        maritalStatus: {
            type: "varchar"
        },
        adult: {
            type: "boolean"
        },
        kids: {
            type: "int"
        },
    },
    relations: {
        educationPhotos: {
            type: "one-to-many",
            inverse: "",
            reference: "PhotoEntity" as const
        }
    }
})

export const UserEntity = entity({
    columns: {
        id: {
            type: "int"
        },
        name: {
            type: "varchar"
        },
        active: {
            type: "boolean"
        },
        phones: {
            type: "varchar",
            array: true
        },
        // TODO
        // role: {
        //     type: "enum",
        //     enum: Role
        // }
    },
    relations: {
        avatar: {
            type: "many-to-one",
            reference: "PhotoEntity" as const
        },
        photos: {
            type: "many-to-many",
            reference: "PhotoEntity" as const
        }
    },
    embeds: {
        profile: ProfileEmbed
    }
})
