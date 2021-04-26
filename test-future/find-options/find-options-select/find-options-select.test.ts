import {
  UserEntity,
  PhotoEntity,
  AlbumEntity,
} from "./find-options-common-entities"
import { AssertTrue, IsExact } from "conditional-type-checks"
import { DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"

describe("FindOptionsBuilder > select", () => {
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

  test("select basic properties", () => {
    const selection = myDataSource.manager
      .repository(UserEntity)
      .findOptions.select({
        id: true,
        name: true,
        active: true,
      })

    type assert = AssertTrue<
      IsExact<
        typeof selection,
        {
          id: true
          name: true
          active: true
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.select({
      // @ts-expect-error
      id: 1,
      // @ts-expect-error
      name: "my name",
      // @ts-expect-error
      active: {},
      // @ts-expect-error
      phones: null,
    })
  })

  test("select complete relation", () => {
    const selection = myDataSource.manager
      .repository(UserEntity)
      .findOptions.select({
        id: true,
        name: true,
        active: true,
        photos: true,
        avatar: true,
      })

    type assert = AssertTrue<
      IsExact<
        typeof selection,
        {
          id: true
          name: true
          active: true
          photos: true
          avatar: true
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.select({
      id: true,
      //@ts-expect-error
      photos: "myphoto",
      //@ts-expect-error
      avatar: null,
    })
  })

  test("select relation properties", () => {
    const selection = myDataSource.manager
      .repository(UserEntity)
      .findOptions.select({
        id: true,
        name: true,
        active: true,
        photos: {
          id: true,
        },
        avatar: {
          id: true,
        },
      })

    type assert = AssertTrue<
      IsExact<
        typeof selection,
        {
          id: true
          name: true
          active: true
          photos: {
            id: true
          }
          avatar: {
            id: true
          }
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.select({
      id: true,
      photos: {
        //@ts-expect-error
        id: null,
        album: {
          //@ts-expect-error
          id: {},
        },
      },
      avatar: {
        //@ts-expect-error
        id: "myavatar",
      },
    })
  })

  test("select embed properties", () => {
    const selection = myDataSource.manager
      .repository(UserEntity)
      .findOptions.select({
        id: true,
        name: true,
        active: true,
        profile: {
          bio: true,
          adult: true,
        },
      })

    type assert = AssertTrue<
      IsExact<
        typeof selection,
        {
          id: true
          name: true
          active: true
          profile: {
            bio: true
            adult: true
          }
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.select({
      id: false,
      name: true,
      profile: {
        kids: true,
        //@ts-expect-error
        bio: "bio",
        //@ts-expect-error
        adult: {},
      },
    })
  })
})
