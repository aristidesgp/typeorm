import {FindOptionsWhere} from "../src/future/core";
import { postgres } from "../src/future/postgres";
import {AlbumEntity} from "./entity/Album";
import {PhotoEntity} from "./entity/Photo";
import {UserEntity} from "./entity/User";

describe("find-options > common cases", () => {
    const driver = postgres({
        entities: {
            UserEntity,
            PhotoEntity,
            AlbumEntity
        }
    })

    test("check if column type is correct", () => {
        //@ts-ignore
        const correct: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            id: 1,
            name: "1",
            active: true,
            // phones: ["true", "asd"], TODO
        }
        //@ts-ignore
        const incorrect: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            //@ts-expect-error
            id: "1",
            //@ts-expect-error
            name: 1,
            //@ts-expect-error
            active: 1,
        }
    })

    test("check if relation column type is correct", () => {
        //@ts-ignore
        const correct: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            avatar: {
                id: 1,
                filename: "1"
            },
        }
        //@ts-ignore
        const correct2: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            avatar: {
                id: 1,
                filename: null
            },
        }

        //@ts-ignore
        const incorrect: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            avatar: {
                //@ts-expect-error
                id: "1",
                //@ts-expect-error
                filename: 1,
            },
        }
    })

    test("check if embed column type is correct", () => {
        //@ts-ignore
        const correct: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            profile: {
                bio: "1",
                adult: true,
                kids: 1
            },
        }

        //@ts-ignore
        const incorrect: FindOptionsWhere<typeof driver, typeof UserEntity> = {
            profile: {
                //@ts-expect-error
                bio: 1,
                //@ts-expect-error
                adult: 2,
                //@ts-expect-error
                kids: "1"
            },
        }
    })
})
