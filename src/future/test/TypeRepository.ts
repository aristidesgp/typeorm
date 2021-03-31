import { DataSource } from "../core"
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
    },
  }),
})
console.log(myDataSource)

// const repo = myDataSource.manager.repository("UserEntity").

async function test() {
  const a = await myDataSource.manager.repository("UserEntity").findOneOrFail({
    select: {
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
