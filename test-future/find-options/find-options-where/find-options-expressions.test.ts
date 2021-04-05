import { Any, WhereOptions } from "../../../src/future/core/options"
import { DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"
import { AlbumEntity } from "../../entity/Album"
import { PhotoEntity } from "../../entity/Photo"
import { UserEntity } from "../../entity/User"

describe("find-options > expressions", () => {
  const myDataSource = DataSource.create({
    type: postgres({
      entities: {
        UserEntity,
        PhotoEntity,
        AlbumEntity,
      },
    }),
  })

  describe("Any()", () => {
    test("check if column type is correct", () => {
      //@ts-ignore
      const correct: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        id: Any(1),
        name: Any("1"),
        active: Any(true),
        // phones: ["true", "asd"], TODO
      }
      //@ts-ignore
      const incorrect: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        //@ts-expect-error
        id: Any("1"),
        //@ts-expect-error
        name: Any(1),
        //@ts-expect-error
        active: Any(1),
      }
    })

    test("check if relation column type is correct", () => {
      //@ts-ignore
      const correct: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        avatar: {
          id: Any(1),
          filename: Any("1"),
        },
      }
      //@ts-ignore
      const correct2: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        avatar: {
          id: Any(1),
          filename: Any(null),
        },
      }

      //@ts-ignore
      const incorrect: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        avatar: {
          //@ts-expect-error
          id: Any("1"),
          //@ts-expect-error
          filename: Any(1),
        },
      }
    })

    test("check if embed column type is correct", () => {
      //@ts-ignore
      const correct: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        profile: {
          bio: Any("1"),
          adult: Any(true),
          kids: Any(1),
        },
      }

      //@ts-ignore
      const incorrect: WhereOptions<typeof myDataSource, typeof UserEntity> = {
        profile: {
          //@ts-expect-error
          bio: Any(1),
          //@ts-expect-error
          adult: Any(2),
          //@ts-expect-error
          kids: Any("1"),
        },
      }
    })
  })
})
