import {
  UserEntity,
  PhotoEntity,
  AlbumEntity,
} from "./manager-basic-methods-entities"
import { DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"

describe("manager basic methods", () => {
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

  test("has id cannot accept incorrect values", () => {
    myDataSource.manager.repository(UserEntity).hasId({
      id: 1,
    })
  })
})
