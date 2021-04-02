import { DataSource, EntityPrimaryColumnValueMap } from "../core"
import { SelectAll } from "../core/selection"
import { entity, postgres } from "../postgres"

export const AlbumEntity = entity({
  columns: {
    id: {
      type: "int",
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

export const PhotoEntity = entity({
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
      reference: "AlbumEntity" as const,
    },
  },
})

export const ProfileEmbed = entity({
  columns: {
    bio: {
      type: "varchar",
    },
    maritalStatus: {
      type: "varchar",
    },
    adult: {
      type: "boolean",
    },
    kids: {
      type: "int",
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

export const UserEntity = entity({
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
      default: "user",
    },
  },
  relations: {
    avatar: {
      type: "many-to-one",
      reference: "PhotoEntity" as const,
    },
    photos: {
      type: "many-to-many",
      reference: "PhotoEntity" as const,
    },
  },
  embeds: {
    profile: ProfileEmbed,
  },
})

export const CarInfoEmbed = entity({
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

export const CarEntity = entity({
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

const myDataSource = DataSource.create({
  type: postgres({
    username: "",
    password: "",
    database: "",
    entities: {
      UserEntity,
      PhotoEntity,
      AlbumEntity,
      CarEntity,
    },
    repositories: {
      // UserRepository,
    },
  }),
})
console.log(myDataSource)

export const UserRepository = myDataSource.manager.repository(UserEntity, {
  async loadAllUsers() {
    return []
  },
})
// const repo = myDataSource.manager.repository("UserEntity").

async function test() {
  const a = await myDataSource.manager.repository("UserEntity").findOneOrFail({
    select: {
      id: true,
      ...UserWithAvatarEager,
    },
    where: {
      name: "Umed",
      avatar: {
        id: 1,
      },
    },
  })

  console.log(a.photos[0].filename)

  const b = await myDataSource.manager.repository("UserEntity").findByIds(1)
  console.log(b)

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

  const x: SelectAll<EntityPrimaryColumnValueMap<typeof UserEntity>> = {
    id: true,
  }
  console.log(x)

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

  const f = await myDataSource.manager.save(UserEntity, {
    name: "Umed",
  })
  console.log(f)

  const g = await myDataSource.manager.save(CarEntity, {
    name: "ModelZ",
  })
  console.log(g)

  const a1 = await myDataSource.manager.findOneByIdOrFail(PhotoEntity, 1)
  console.log(a1)

  const a2 = await myDataSource.manager.findOneByIdOrFail(UserEntity, 1)
  console.log(a2)

  const a3 = await myDataSource.manager.findOneByIdOrFail(CarEntity, {
    id: 1,
    info: {
      vin: "wow",
    },
  })
  console.log(a3)

  const id1 = await myDataSource.manager.getId(PhotoEntity, {
    filename: ":wow",
  })
  console.log(id1)

  const id2 = await myDataSource.manager.getId(CarEntity, {})
  console.log(id2.info.vin)

  const users = await UserRepository.find({})
  console.log(users)

  const allUsers = await UserRepository.loadAllUsers()
  console.log(allUsers)

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
