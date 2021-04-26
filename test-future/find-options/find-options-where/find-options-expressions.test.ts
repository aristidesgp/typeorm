import { Any, DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"
import {
  UserEntity,
  PhotoEntity,
  AlbumEntity,
} from "./find-options-where-entities"

describe("find-options > expressions", () => {
  const myDataSource = DataSource.create({
    type: postgres({
      database: "",
      username: "",
      password: "",
      entities: {
        UserEntity,
        PhotoEntity,
        AlbumEntity,
      },
    }),
  })

  describe("Any()", () => {
    test("check if column type is correct", () => {
      myDataSource.manager.repository(UserEntity).findOptions.where({
        id: Any(1),
        name: Any("1"),
        active: Any(true),
        // phones: ["true", "asd"], TODO
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        //@ts-expect-error
        id: Any("1"),
        //@ts-expect-error
        name: Any(1),
        //@ts-expect-error
        active: Any(1),
      })
    })

    test("check if relation column type is correct", () => {
      myDataSource.manager.repository(UserEntity).findOptions.where({
        avatar: {
          id: Any(1),
          filename: Any("1"),
        },
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        avatar: {
          id: Any(1),
          filename: Any(null),
        },
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        avatar: {
          //@ts-expect-error
          id: Any(null),
          filename: Any(null),
        },
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        avatar: {
          //@ts-expect-error
          id: Any("1"),
          //@ts-expect-error
          filename: Any(1),
        },
      })
    })

    test("check if embed column type is correct", () => {
      myDataSource.manager.repository(UserEntity).findOptions.where({
        profile: {
          bio: Any("1"),
          adult: Any(true),
          kids: Any(1),
        },
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        profile: {
          //@ts-expect-error
          bio: Any(1),
          //@ts-expect-error
          adult: Any(2),
          //@ts-expect-error
          kids: Any("1"),
        },
      })

      myDataSource.manager.repository(UserEntity).findOptions.where({
        profile: {
          //@ts-expect-error
          bio: Any(null),
          //@ts-expect-error
          adult: Any(null),
          //@ts-expect-error
          kids: Any(null),
        },
      })
    })
  })
})
