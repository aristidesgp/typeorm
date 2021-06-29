import { Column, Concat, Equal, MoreThan, Not, Plus } from "../postgres"
import { sql, sqlFragment } from "../core"
import { entity, postgres } from "../postgres"

export class Photo {
  id: number
  filename: string
  album: Album
}

export class Album {
  id: number
  name: string
  photos: Photo[]
}

export function AlbumEntity() {
  return entity({
    // activeRecord: true,
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
      },
    },
    relations: {
      photos: {
        type: "one-to-many",
        inverse: "album",
        reference: PhotoEntity,
      },
    },
  })
}

export function PhotoEntity() {
  return entity({
    columns: {
      id: {
        primary: true,
        type: "int",
      },
      filename: {
        type: "varchar",
        nullable: true,
      },
    },
    relations: {
      album: {
        type: "many-to-one",
        inverse: "photos",
        reference: AlbumEntity,
      },
      users: {
        type: "many-to-many",
        owner: false,
        inverse: "photos",
        reference: UserEntity,
      },
    },
  })
}

export function ProfileEmbed() {
  return entity({
    columns: {
      passportId: {
        type: "varchar",
        // primary: true,
      },
      bio: {
        type: "varchar",
      },
      maritalStatus: {
        type: "varchar",
        nullable: true,
      },
      adult: {
        type: "boolean",
      },
      kids: {
        type: "int",
        default: 0,
      },
    },
    relations: {
      educationPhotos: {
        type: "one-to-many",
        inverse: "",
        reference: PhotoEntity,
      },
    },
  })
}

export function UserEntity() {
  return entity({
    type: "advanced",
    columns: {
      id: {
        type: "int",
        primary: true,
        generated: true,
      },
      name: {
        type: "varchar",
        // primary: true,
      },
      secondName: {
        type: "varchar",
        // primary: true,
      },
      status: {
        type: "varchar",
        default: "user",
      },
    },
    relations: {
      avatar: {
        type: "many-to-one",
        reference: PhotoEntity,
        referencedColumns: [
          { referencedColumn: "filename" } as const,
          { referencedColumn: "id" } as const,
        ],
      },
      photos: {
        type: "many-to-many",
        owner: true,
        reference: PhotoEntity,
        referencedTable: {
          ownerColumns: [
            { referencedColumn: "name" as const },
            { referencedColumn: "status" as const },
          ],
          inverseColumns: [
            { referencedColumn: "filename" } as const,
            // { referencedColumn: "id" } as const,
          ],
        },
      },
    },
    embeds: {
      profile: ProfileEmbed(),
    },
    virtuals: {
      methods: {
        walkHome() {
          console.log("walking home...")
          return true
        },
      },
      eagerProperties: {
        async fullName(manager) {
          return "Dima Dima"
        },
      },
      lazyProperties: {
        async photosCount(manager) {
          const result = await manager.findBy(PhotoEntity, {
            select: {
              album: {
                id: true,
                photos: {
                  id: true,
                  filename: true,
                  album: true,
                },
              },
            },
            where: {
              id: 1,
            },
          })
          console.log(result)
          return 1
        },
      },
    },
  })
}

export function CarInfoEmbed() {
  return entity({
    columns: {
      vin: {
        primary: true,
        type: "varchar",
      },
      torque: {
        type: "int",
      },
      year: {
        type: "int",
        default: 2021,
      },
    },
  })
}

export function CarEntity() {
  return entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
        // primary: true,
      },
      status: {
        type: "varchar",
        default: "production",
      },
    },
    relations: {
      photo: {
        type: "many-to-one",
        reference: PhotoEntity,
      },
    },
    embeds: {
      info: CarInfoEmbed(),
    },
  })
}
// -----------------------------------------------------------------
// usage example
// -----------------------------------------------------------------

const myDataSource = postgres({
  username: "",
  password: "",
  database: "",
  entities: [UserEntity, PhotoEntity, AlbumEntity, CarEntity],
})

myDataSource.manager.repository(UserEntity)

// myDataSource.options.namingStrategy.

const UserRepository = myDataSource.manager.repository(UserEntity, {
  async allUsers() {
    return this.find({})
  },
})

async function test() {
  // console.log(UserRepository.allUsers())
  console.log(
    myDataSource.manager.repository(PhotoEntity).findBy({
      where: {
        id: 1,
      },
    }),
  )

  const a = await myDataSource.manager.repository(UserEntity).findOneByOrFail({
    select: {
      id: true,
      name: true,
      photos: true,
      // ...UserWithAvatarEager,
    },
    where: {
      name: "Umed",
      avatar: {
        id: 1,
      },
    },
  })

  // a.fullName()

  console.log(a.photos[0].filename)

  // type bbb = EntityPrimariesValueMap<
  //   typeof UserEntity["driver"],
  //   typeof UserEntity["columns"],
  //   typeof UserEntity["embeds"]
  // >
  // type ccc = typeof UserEntity["primariesValueMap"]
  // type aaaa = EntityPrimariesPaths<bbb>
  //
  // type axax = EntityPrimariesMixed<
  //   typeof UserEntity,
  //   EntityPrimariesValueMap<typeof UserEntity>
  // >
  // const x: axax = {}
  // console.log(x)

  // const b = await myDataSource.manager.repository("UserEntity").findByIds(1)
  // console.log(b)

  await myDataSource.manager
    .repository(UserEntity)
    .increment({ id: 1 }, "profile.maritalStatus", 1)

  const c = myDataSource.manager.repository(UserEntity).create({
    name: "Timber",
    profile: {
      bio: "trees",
    },
  })
  console.log(c)

  const id = myDataSource.manager.repository(UserEntity).getId(c)
  console.log(id)

  // const x: SelectAll<EntityPrimaryColumnValueMap<typeof UserEntity>> = {
  //   id: true,
  // }
  // console.log(x)

  const d = myDataSource.manager.repository(UserEntity).merge(
    {
      id: 1,
    },
    c,
    {
      profile: {
        kids: 1,
      },
    },
  )
  console.log(d)

  const e = myDataSource.manager.create(PhotoEntity, {
    filename: "Umed",
  })
  console.log(e)

  // const fx = await myDataSource.manager.repository(PhotoEntity).insert({
  //   id: 1,
  // })

  // const modelForInsert: EntityModelForInsert<
  //   typeof myDataSource,
  //   typeof UserEntity
  // > = {
  //   id: 1,
  //   name: "Timber",
  //   secondName: "Saw",
  //   profile: {
  //     bio: "about trees",
  //     adult: true,
  //     passportId: "timer-saw-0123",
  //   },
  // }
  // console.log(modelForInsert)

  const f = await myDataSource.manager.repository(UserEntity).insert({
    name: "hello",
    secondName: "wow",
    profile: {
      passportId: "",
      bio: "",
      adult: false,
      maritalStatus: "hm",
      kids: 1,
    },
    // avatar: {
    //   id: 1,
    //   filename: 1,
    // },
  })
  console.log(f)

  const g = await myDataSource.manager.insert(CarEntity, {
    name: "ModelZ",
  })
  console.log(g)

  const newUser = myDataSource.manager.create(UserEntity, {
    name: "ModelZ",
  })
  console.log(newUser)

  const users = await myDataSource.manager.findBy(UserEntity, {
    select: {
      id: true,
    },
    where: {
      name: "Umed",
    },
  })

  const avatar = await users[0].loadAvatar()
  console.log(avatar.filename)
  const photos = await users[0].loadPhotos()
  console.log(photos)
  const photosCount = await users[0].countPhotos()
  console.log(photosCount)

  // type tt1 = EntityRelationReferencedColumnTypeMap<
  //   ReturnType<typeof PhotoEntity>,
  //   ReturnType<typeof UserEntity>["relations"]["avatar"]
  // >
  // type tt2 = EntityRelationReferencedColumnTypeMap<
  //   ReturnType<typeof PhotoEntity>,
  //   ReturnType<typeof UserEntity>["relations"]["photos"]
  // >

  await users[0].addPhotos([
    {
      filename: "wow",
    },
  ])
  console.log(photosCount)

  const allUsers = await UserRepository.allUsers()
  console.log(allUsers)

  // const a1 = await myDataSource.manager.findOneByIdOrFail(PhotoEntity, 1)
  // console.log(a1)
  //
  // const a2 = await myDataSource.manager.findByIds(UserEntity, 1)
  // console.log(a2)
  //
  // const a3 = await myDataSource.manager.findOneByIdOrFail(CarEntity, {
  //   id: 1,
  //   info: {
  //     vin: "wow",
  //   },
  // })
  // console.log(a3)

  const id1 = await myDataSource.manager.getId(PhotoEntity, {
    filename: ":wow",
  })
  console.log(id1)

  const id2 = await myDataSource.manager.getId(CarEntity, {})
  console.log(id2.info.vin)

  // const id3 = await myDataSource.manager.getId(UserEntity, {})
  // console.log(id3.profile.passportId)

  // const users = await UserRepository.findBy({
  //   select: {
  //     id: true,
  //   },
  // })
  // console.log(users[0].fullName())
  // console.log(users)
  //
  // const allUsers = await UserRepository.loadAllUsers()
  // console.log(allUsers)

  // myDataSource.manager.reposi
  // .transaction(async (manager) => {
  //   console.log(manager)
  // })

  // const results1 = await myDataSource.manager
  //   .query(sql`SELECT * FROM "users"`)
  //   .append(sqlFragment` WHERE id > 1000`)
  //   .mapTo(UserEntity)
  //   .execute()
  //
  // const results2 = await myDataSource.manager
  //   .query(sql`SELECT * FROM "users"`)
  //   .execute<
  //     {
  //       id: number
  //       name: string
  //     }[]
  //   >()
  //
  // const results3 = await myDataSource.manager
  //   .query(sql`SELECT * FROM "users"`)
  //   .execute<
  //     {
  //       firstName: string
  //       lastName: string
  //     }[]
  //   >()
  //
  // console.log(results1, results2, results3)

  const alwaysSelectAge = myDataSource.manager
    .repository(UserEntity)
    .findOptions.virtuals({
      properties: {
        idPlusId: Plus(Column("id"), Column("id")),
      },
    })

  const userX = await myDataSource.manager
    .repository(UserEntity)
    .findOneByOrFail({
      virtuals: {
        // ...alwaysSelectAge,
        properties: {
          superFullName: Concat("this", "is", "sparta"),
          age: Plus(Column("id"), Column("id")),
        },
        methods: {
          helloAge(name: string) {
            return 1
          },
        },
        relations: {
          photos: {
            properties: {
              waat: Plus(Column("id"), Column("id")),
            },
            methods: {
              ohMyGod() {
                return 2
              },
            },
          },
        },
      },
      select: {
        id: true,
        photos: true,
      },
    })
  console.log(userX.superFullName)
  console.log(userX.age)
  console.log(userX.photos[0])
}

test()

const UserWithAvatarEager = myDataSource.manager
  .repository(UserEntity)
  .findOptions.select({
    avatar: true,
    photos: true,
    profile: {
      educationPhotos: true,
    },
  })

console.log(UserWithAvatarEager)

myDataSource.manager.repository(UserEntity).findOptions.virtuals({
  properties: {
    something: Column("name"),
  },
})

// type ObserveType =
//   | "afterLoad"
//   | "beforeInsert"
//   | "afterInsert"
//   | "beforeUpdate"
//   | "afterUpdate"
//   | "beforeRemove"
//   | "afterRemove"
//   | "beforeTransactionStart"
//   | "afterTransactionStart"
//   | "beforeTransactionCommit"
//   | "afterTransactionCommit"
//   | "beforeTransactionRollback"
//   | "afterTransactionRollback"
//
// function observe(type: ObserveType) {}
//
// myDataSource.manager
//   .repository(UserEntity)
//   .on("afterLoad")
//   .subscribe(() => {})

myDataSource.manager.repository(UserEntity).findOptions.where({
  $or: [
    {
      $ex: [
        MoreThan(Plus(Column("id"), Column("id")), 10),
        // MoreThan(Length(Column("name")), 10),
      ],
      name: Not(Equal("dasd")),
      secondName: Concat(Column("name"), " ", Column("secondName"), "!"),
      // id: MoreThan(),
      // date: Raw(sql`select max(date) from dual`)
      photos: {
        $or: [
          {
            filename: Equal("dasd"),
          },
          {
            filename: "dasd2",
          },
        ],
      },
    },
  ],
})
// myDataSource.manager.repository(UserEntity).findOptions.where(
//   And({
//     name: Equal(1),
//   }),
// )

// const whereOptions: FindOperatorWhereOptions<typeof myDataSource, typeof UserEntity> = Or({
//     avatar: {
//         id: Any(1, 2),
//         album: {
//             photos: And({
//                 filename: Any(null)
//             }, {
//                 filename: Any("1")
//             })
//         }
//     },
//     id: 1,
//     name: "Dima",
//     profile: Or({
//         kids: Any(1),
//         adult: Any(true),
//         educationPhotos: {
//             id: Any(1),
//             filename: Any(null),
//             album: {
//                 photos: And({
//                     filename: Any(null)
//                 }, {filename: Any("1")})
//             }
//         }
//     })
// })
//
// console.log(whereOptions);
