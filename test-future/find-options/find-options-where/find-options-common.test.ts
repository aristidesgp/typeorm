import { DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"
import {
  UserEntity,
  PhotoEntity,
  AlbumEntity,
} from "./find-options-where-entities"

describe("find-options > common cases", () => {
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

  test("where in find cannot accept incorrect values", () => {
    myDataSource.manager.repository(UserEntity).findOptions.where({
      //@ts-expect-error
      id: "1",
    })
  })

  test("check if column type is correct", () => {
    myDataSource.manager.repository(UserEntity).findOptions.where({
      id: 1,
      name: "1",
      active: true,
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      //@ts-expect-error
      id: "1",
      //@ts-expect-error
      name: 1,
      //@ts-expect-error
      active: 1,
    })
  })

  test("check if relation column type is correct", () => {
    myDataSource.manager.repository(UserEntity).findOptions.where({
      avatar: {
        id: 1,
        filename: "1",
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      avatar: {
        id: 1,
        filename: null,
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      avatar: {
        //@ts-expect-error
        id: null,
        filename: null,
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      avatar: {
        //@ts-expect-error
        id: "1",
        //@ts-expect-error
        filename: 1,
      },
    })
  })

  test("check if embed column type is correct", () => {
    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        bio: "1",
        adult: true,
        kids: 1,
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        //@ts-expect-error
        bio: 1,
        //@ts-expect-error
        adult: 2,
        //@ts-expect-error
        kids: "1",
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        //@ts-expect-error
        bio: null,
        //@ts-expect-error
        adult: null,
        //@ts-expect-error
        kids: null,
      },
    })
  })

  test("check if embed relation column type is correct", () => {
    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        educationPhotos: {
          id: 1,
          filename: null,
        },
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        educationPhotos: {
          //@ts-expect-error
          id: null,
          filename: null,
        },
      },
    })

    myDataSource.manager.repository(UserEntity).findOptions.where({
      profile: {
        educationPhotos: {
          //@ts-expect-error
          id: "1",
          //@ts-expect-error
          filename: 1,
        },
      },
    })
  })
})
