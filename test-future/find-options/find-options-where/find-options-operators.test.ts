import {
  And,
  Any,
  DataSource,
  Or,
  WhereOptions,
} from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"
import {
  UserEntity,
  PhotoEntity,
  AlbumEntity,
} from "./find-options-where-entities"

describe("find-options > operators", () => {
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
      const correct: WhereOptions<ReturnType<typeof UserEntity>> = Or({
        id: Any(1),
        name: Any("1"),
        active: Any(true),
        // phones: ["true", "asd"], TODO
      })
      //@ts-ignore
      const incorrect: WhereOptions<ReturnType<typeof UserEntity>> = Or({
        //@ts-expect-error
        id: Any("1"),
        //@ts-expect-error
        name: Any(1),
        //@ts-expect-error
        active: Any(1),
      })
    })

    test("check if relation column type is correct", () => {
      //@ts-ignore
      const correct: WhereOptions<ReturnType<typeof UserEntity>> = And({
        avatar: Or({
          id: Any(1),
          filename: Any("1"),
        }),
      })
      //@ts-ignore
      const correct2: WhereOptions<ReturnType<typeof UserEntity>> = And({
        avatar: Or({
          id: Any(1),
          filename: Any(null),
        }),
      })

      //@ts-ignore
      const incorrect: WhereOptions<ReturnType<typeof UserEntity>> = And({
        avatar: Or({
          //@ts-expect-error
          id: Any("1"),
          //@ts-expect-error
          filename: Any(1),
        }),
      })
    })

    test("check if embed column type is correct", () => {
      //@ts-ignore
      const correct: WhereOptions<ReturnType<typeof UserEntity>> = And({
        profile: Or({
          bio: Any("1"),
          adult: Any(true),
          kids: Any(1),
        }),
      })

      //@ts-ignore
      const incorrect: WhereOptions<ReturnType<typeof UserEntity>> = And({
        profile: Or({
          //@ts-expect-error
          bio: Any(1),
          //@ts-expect-error
          adult: Any(2),
          //@ts-expect-error
          kids: Any("1"),
        }),
      })
    })
  })
})
