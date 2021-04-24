import { Postgres } from "../../../src/future/postgres"
import { UserEntity } from "./repository-persistence-methods-entities"
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
      }),
    }),
  })

  describe("insert", () => {
    test("insert", async () => {
      myDataSource.manager.repository(UserEntity).insert({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).insert({
        id: 1,
        name: "myName",
        active: true,
        phones: "985-59-44-19",
      })

      myDataSource.manager.repository(UserEntity).insert([
        {
          id: 1,
          name: "myName",
          active: true,
          phones: "985-59-44-19",
        },
        {
          id: 2,
          name: "yourName",
          active: true,
          phones: "985-59-44-11",
        },
      ])
    })
  })

  describe("update", () => {
    test("update", async () => {
      myDataSource.manager.repository(UserEntity).update({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).update({
        id: 1,
        name: "myName",
        active: true,
      })
    })
  })

  describe("updateBy", () => {
    test("updateBy", async () => {
      myDataSource.manager.repository(UserEntity).updateBy({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).updateBy({
        where: {
          id: 1,
          name: "myName",
          active: true,
        },
      })
    })
  })
})
