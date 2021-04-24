import { UserEntity, PhotoEntity, AlbumEntity } from "../../"
import { Postgres } from "../../../src/future/postgres"
import { DataSource } from "../../../src/future/core"

describe("manager basic methods", () => {
  const myDataSource = DataSource.create({
    type: Postgres({
      database: "",
      username: "",
      password: "",
      entities: Postgres.entities({
        UserEntity: UserEntity(),
        PhotoEntity: PhotoEntity(),
        AlbumEntity: AlbumEntity(),
      }),
    }),
  })

  test("has id cannot accept incorrect values", () => {
    myDataSource.manager.repository(UserEntity).hasId({
      id: 1,
    })
  })
})
