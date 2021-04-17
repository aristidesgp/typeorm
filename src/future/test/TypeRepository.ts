import { model } from "../../repository/model"
import { DataSource } from "../core"
import { Postgres } from "../postgres"

export const AlbumEntity = Postgres.entity({
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
      reference: "PhotoEntity" as const,
    },
  },
})

export const PhotoEntity = Postgres.entity({
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
      inverse: "photos" as const,
      reference: "AlbumEntity" as const,
    },
    users: {
      type: "many-to-many",
      owner: false,
      inverse: "photos" as const,
      reference: "UserEntity" as const,
    },
  },
})

export const ProfileEmbed = Postgres.entity({
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
      reference: "PhotoEntity" as const,
    },
  },
})

export const UserEntity = Postgres.entity({
  model: model<{
    id: number
    name: string
    haha: string
    fullName(): string
  }>(),
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
      reference: "PhotoEntity" as const,
      referencedColumns: [
        { referencedColumn: "filename" } as const,
        { referencedColumn: "id" } as const,
      ],
    },
    photos: {
      type: "many-to-many",
      owner: true,
      reference: "PhotoEntity" as const,
      referencedTable: {
        ownerColumns: [
          { referencedColumn: "name" as const },
          { referencedColumn: "status" as const },
        ],
        inverseColumns: [
          { referencedColumn: "filename" } as const,
          { referencedColumn: "id" } as const,
        ],
      },
    },
  },
  embeds: {
    profile: ProfileEmbed,
  },
})

export const CarInfoEmbed = Postgres.entity({
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

export const CarEntity = Postgres.entity({
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
      reference: "PhotoEntity" as const,
    },
  },
  embeds: {
    info: CarInfoEmbed,
  },
})

// -----------------------------------------------------------------
// usage example
// -----------------------------------------------------------------

const entities = Postgres.entities({
  UserEntity,
  PhotoEntity,
  AlbumEntity,
  CarEntity,
})

const UserResolver = entities.resolve("UserEntity", {
  async haha() {
    return 1
  },
})

const UserRepository = entities.repository("UserEntity", {
  async allUsers() {
    return this.findBy({
      where: {},
    })
  },
})

const myDataSource = DataSource.create({
  type: Postgres({
    username: "",
    password: "",
    database: "",
    entities,
    resolvers: [UserResolver],
    repositories: {
      ...UserRepository,
    },
  }),
})

async function test() {
  console.log(myDataSource.manager.repository("UserEntity").allUsers())
  console.log(
    myDataSource.manager.repository("PhotoEntity").findBy({
      where: {
        id: 1,
      },
    }),
  )

  const a = await myDataSource.manager
    .repository("UserEntity")
    .findOneByOrFail({
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
    .repository("UserEntity")
    .increment({ id: 1 }, "profile.maritalStatus", 1)

  const c = myDataSource.manager.repository("UserEntity").create({
    name: "Olim",
    profile: {
      bio: "soset",
    },
  })
  console.log(c)

  const id = myDataSource.manager.repository("UserEntity").getId(c)
  console.log(id)

  // const x: SelectAll<EntityPrimaryColumnValueMap<typeof UserEntity>> = {
  //   id: true,
  // }
  // console.log(x)

  const d = myDataSource.manager.repository("UserEntity").merge(
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

  const f = await myDataSource.manager.repository("UserEntity").insert({
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

  const users = await myDataSource.manager.find(UserEntity, {
    name: "Umed",
  })
  console.log(users)

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
}

test()

const UserWithAvatarEager = myDataSource.manager
  .repository("UserEntity")
  .findOptions.select({
    avatar: true,
    photos: true,
    profile: {
      educationPhotos: true,
    },
  })

console.log(UserWithAvatarEager)

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

// entity can have 3 base types:
// - simple, active-record, class (for decorators)
// AR methods:
// hasId()
// save(Connection)
// remove()
// archive()
// unarchive()
// reload(FindOptions)
// load{RelationName}(FindOptions)
// count{RelationName}(FindOptions)
// has{RelationName}(FindOptions)
// count{ManyToMany/OneToMany-RelationName}(FindOptions)
// add{ManyToMany/OneToMany-RelationName}(RelatedEntityMap)
// remove{ManyToMany/OneToMany-RelationName}(RelatedEntityMap)
