import { Postgres } from "../../../src/future/postgres"
import {
  UserEntity,
  PhotoEntity,
  WorkerEntity,
} from "./repository-find-methods-entities"
import { IsExact, AssertTrue } from "conditional-type-checks"
import { DataSource } from "../../../src/future/core"

describe("repository-basic-methods", () => {
  const myDataSource = DataSource.create({
    type: Postgres({
      database: "",
      username: "",
      password: "",
      entities: Postgres.entities({
        UserEntity: UserEntity(),
        PhotoEntity: PhotoEntity(),
        WorkerEntity: WorkerEntity(),
      }),
    }),
  })

  describe("find", () => {
    test("without any selection - returns all standard columns including from embeds", async () => {
      const found = await myDataSource.manager.repository(UserEntity).find({})

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            name: string
            active: boolean
            phones: string
            profile: {
              bio: string
              maritalStatus: string
              adult: boolean
              kids: number
            }
          }[]
        >
      >
    })

    test("simple columns selection", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          name: true,
          active: true,
          phones: true,
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            name: string
            active: boolean
            phones: string
          }[]
        >
      >
    })

    test("select columns from embed", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          profile: {
            bio: true,
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            profile: {
              bio: string
            }
          }[]
        >
      >
    })

    test("select only columns from embed", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          profile: {
            bio: true,
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            profile: {
              bio: string
            }
          }[]
        >
      >
    })

    test("selecting relations without any columns specified must return all standard columns", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          avatar: true,
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            name: string
            active: boolean
            phones: string
            avatar: {
              id: number
              filename: string | null
            }
            profile: {
              bio: string
              maritalStatus: string
              adult: boolean
              kids: number
            }
          }[]
        >
      >
    })

    test("selecting relations without any columns specified must return all standard columns", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          avatar: {
            id: true,
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            name: string
            active: boolean
            phones: string
            avatar: {
              id: number
            }
            profile: {
              bio: string
              maritalStatus: string
              adult: boolean
              kids: number
            }
          }[]
        >
      >
    })

    test("select the whole relation", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          avatar: true,
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            avatar: {
              id: number
              filename: string | null
            }
          }[]
        >
      >
    })

    test("select some relation columns", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          avatar: {
            id: true,
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            avatar: {
              id: number
            }
          }[]
        >
      >
    })

    test("select some embed's relation columns", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          profile: {
            educationPhotos: {
              id: true,
            },
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            profile: {
              educationPhotos: { id: number }[]
            }
          }[]
        >
      >
    })

    test("select embed's the wole relation", async () => {
      const found = await myDataSource.manager.repository(UserEntity).findBy({
        select: {
          id: true,
          profile: {
            educationPhotos: true,
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            profile: {
              educationPhotos: { id: number; filename: string | null }[]
            }
          }[]
        >
      >
    })

    test("select some embed's nested embeds columns", async () => {
      const found = await myDataSource.manager.repository(WorkerEntity).findBy({
        select: {
          id: true,
          workerProfile: {
            education: {
              name: true,
            },
            expirience: {
              name: true,
            },
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            workerProfile: {
              education: {
                name: string
              }
              expirience: {
                name: string
              }
            }
          }[]
        >
      >
    })

    test("select embed's nested embeds columns and embed's nested embeds the whole relations", async () => {
      const found = await myDataSource.manager.repository(WorkerEntity).findBy({
        select: {
          id: true,
          workerProfile: {
            education: {
              name: true,
              campusPhotos: true,
            },
            expirience: {
              name: true,
              organizationPhotos: true,
            },
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            workerProfile: {
              education: {
                name: string
                campusPhotos: {
                  id: number
                  filename: string | null
                }[]
              }
              expirience: {
                name: string
                organizationPhotos: {
                  id: number
                  filename: string | null
                }[]
              }
            }
          }[]
        >
      >
    })

    test("select embed's nested embeds columns and embed's nested embeds some relations columns", async () => {
      const found = await myDataSource.manager.repository(WorkerEntity).findBy({
        select: {
          id: true,
          workerProfile: {
            education: {
              name: true,
              campusPhotos: {
                id: true,
              },
            },
            expirience: {
              name: true,
              organizationPhotos: {
                id: true,
              },
            },
          },
        },
      })

      type foundAssert = AssertTrue<
        IsExact<
          typeof found,
          {
            id: number
            workerProfile: {
              education: {
                name: string
                campusPhotos: {
                  id: number
                }[]
              }
              expirience: {
                name: string
                organizationPhotos: {
                  id: number
                }[]
              }
            }
          }[]
        >
      >
    })
  })
})

// myDataSource.manager.repository("UserEntityWithRelations").find({
//   select: {
//     //@ts-expect-error
//     marmelad: true,
//     id: true,
//   },
// })
