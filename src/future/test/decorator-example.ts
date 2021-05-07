import { DataSource, EntityRelationReferencedColumnTypeMap } from "../core"
import { entityCls, postgres } from "../postgres"

export class PhotoEntity {
  id: number
  filename: string
  album: AlbumEntity
}

export class AlbumEntity {
  id: number
  name: string
  photos: PhotoEntity[]
}

export class UserEntity {
  id: number
  name: string
  photos: PhotoEntity[]
}

// export const PhotoEntity = () => entityCls(Photo)
// export const AlbumEntity = () => entityCls(Album)
// export const UserEntity = () => entityCls(User)

// -----------------------------------------------------------------
// usage example
// -----------------------------------------------------------------

const myDataSource = DataSource.create({
  type: postgres({
    username: "",
    password: "",
    database: "",
    entities: {
      PhotoEntity,
      AlbumEntity,
      UserEntity,
    },
  }),
})

async function test() {
  const photos = await myDataSource.manager.repository(PhotoEntity).findBy({
    where: {
      id: 1,
    },
  })
  console.log(photos)

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
    // {
    //   profile: {
    //     kids: 1,
    //   },
    // },
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

  const g = await myDataSource.manager.insert(UserEntity, {
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

  // const avatar = await users[0].loadAvatar()
  // console.log(avatar.filename)
  // const photos = await users[0].loadPhotos()
  // console.log(photos)
  // const photosCount = await users[0].countPhotos()
  // console.log(photosCount)

  // type tt1 = EntityRelationReferencedColumnTypeMap<
  //   ReturnType<typeof PhotoEntity>,
  //   ReturnType<typeof UserEntity>["relations"]["avatar"]
  // >
  // type tt2 = EntityRelationReferencedColumnTypeMap<
  //   ReturnType<typeof PhotoEntity>,
  //   ReturnType<typeof UserEntity>["relations"]["photos"]
  // >

  // await users[0].addPhotos([
  //   {
  //     filename: "wow",
  //   },
  // ])
  // console.log(photosCount)

  // const allUsers = await UserRepository.allUsers()
  // console.log(allUsers)

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

  // const id2 = await myDataSource.manager.getId(CarEntity, {})
  // console.log(id2.info.vin)

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
  .repository(UserEntity)
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
