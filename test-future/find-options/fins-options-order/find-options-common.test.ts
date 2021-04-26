import { DataSource } from "../../../src/future/core"
import { AssertTrue, IsExact } from "conditional-type-checks"
import { postgres } from "../../../src/future/postgres"
import {
  AlbumEntity,
  PhotoEntity,
  UserEntity,
} from "./find-options-order-entities"

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

  test("order basic properties", () => {
    const order = myDataSource.manager
      .repository(UserEntity)
      .findOptions.order({
        id: "asc",
      })

    type assert = AssertTrue<
      IsExact<
        typeof order,
        {
          id: "asc"
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.order({
      // @ts-expect-error
      id: 1,
      // @ts-expect-error
      name: "my name",
      active: {},
      // @ts-expect-error
      phones: null,
    })
  })

  test("order complete relation", () => {
    const order = myDataSource.manager
      .repository(UserEntity)
      .findOptions.order({
        id: "asc",
        name: "desc",
        photos: "asc",
        avatar: "desc",
      })

    type assert = AssertTrue<
      IsExact<
        typeof order,
        {
          id: "asc"
          name: "desc"
          photos: string
          avatar: string
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.order({
      id: "asc",
      photos: "myphoto",
      //@ts-expect-error
      avatar: null,
    })
  })

  test("order relation properties", () => {
    const order = myDataSource.manager
      .repository(UserEntity)
      .findOptions.order({
        id: "asc",
        name: "desc",
        active: "asc",
        photos: {
          id: "asc",
        },
        avatar: {
          id: "desc",
        },
      })

    type assert = AssertTrue<
      IsExact<
        typeof order,
        {
          id: "asc"
          name: "desc"
          active: "asc"
          photos: {
            id: "asc"
          }
          avatar: {
            id: "desc"
          }
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.order({
      id: "asc",
      photos: {
        //@ts-expect-error
        id: null,
        album: {
          id: {},
        },
      },
      avatar: {
        //@ts-expect-error
        id: "myavatar",
      },
    })
  })

  test("order embed properties", () => {
    const order = myDataSource.manager
      .repository(UserEntity)
      .findOptions.order({
        id: "asc",
        name: "desc",
        active: "asc",
        profile: {
          bio: "asc",
          adult: "desc",
        },
      })

    type assert = AssertTrue<
      IsExact<
        typeof order,
        {
          id: "asc"
          name: "desc"
          active: "asc"
          profile: {
            bio: "asc"
            adult: "desc"
          }
        }
      >
    >

    myDataSource.manager.repository(UserEntity).findOptions.order({
      id: "asc",
      name: "desc",
      profile: {
        kids: "asc",
        //@ts-expect-error
        bio: "bio",
        adult: {},
      },
    })
  })
})
