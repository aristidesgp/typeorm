import {
  UserEntity,
  EmployerEntity,
  StudentEntity,
  WorkerEntity,
} from "./repository-basic-methods-entities"
import { IsExact, AssertTrue } from "conditional-type-checks"
import { DataSource } from "../../../src/future/core"
import { postgres } from "../../../src/future/postgres"

describe("repository-basic-methods", () => {
  const myDataSource = DataSource.create({
    type: postgres({
      database: "",
      username: "",
      password: "",
      entities: {
        UserEntity,
        EmployerEntity,
        WorkerEntity,
        StudentEntity,
      },
    }),
  })

  describe("hasId", () => {
    test("input model signature", () => {
      myDataSource.manager.repository(UserEntity).hasId({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).hasId({
        id: 1,
      })
    })
  })

  describe("getId", () => {
    test("input model signature", () => {
      myDataSource.manager.repository(UserEntity).getId({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).getId({
        id: 1,
      })
    })
    test("entities with multiple primary keys", () => {
      const userId = myDataSource.manager.repository(UserEntity).getId({
        id: 1,
        name: "Timber",
      })
      type userIdIdAssert = AssertTrue<IsExact<typeof userId.id, number>>
      type userIdNameAssert = AssertTrue<IsExact<typeof userId.name, string>>
      type userIdAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userId, "id" | "name">
      >
    })

    test("entity with embed primary key", () => {
      const userId = myDataSource.manager.repository(EmployerEntity).getId({
        id: 1,
        employerProfile: {
          bio: "Bio",
        },
      })
      type userIdIdAssert = AssertTrue<IsExact<typeof userId.id, number>>
      type userIdBioAssert = AssertTrue<
        IsExact<typeof userId.employerProfile.bio, string>
      >
      type userIdAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userId, "id" | "employerProfile">
      >
      type userIdAllPropertiesAssert2 = AssertTrue<
        IsExact<keyof typeof userId.employerProfile, "bio">
      >
    })

    test("entity with embed two primary key", () => {
      const userId = myDataSource.manager.repository(WorkerEntity).getId({
        id: 1,
        workerProfile: {
          bio: "bio",
          maritalStatus: "status",
        },
      })
      type userIdIdAssert = AssertTrue<IsExact<typeof userId.id, number>>
      type userIdBioAssert = AssertTrue<
        IsExact<typeof userId.workerProfile.bio, string>
      >
      type userIdMaritalStatusAssert = AssertTrue<
        IsExact<typeof userId.workerProfile.maritalStatus, string>
      >
      type userIdAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userId, "id" | "workerProfile">
      >
      type userIdAllPropertiesAssert2 = AssertTrue<
        IsExact<keyof typeof userId.workerProfile, "bio" | "maritalStatus">
      >
    })

    test("entity with embed2 primary key", () => {
      const userId = myDataSource.manager.repository(StudentEntity).getId({
        id: 1,
        studentProfile: {
          bio: "bio",
          education: {
            name: "name",
          },
        },
      })
      type userIdIdAssert = AssertTrue<IsExact<typeof userId.id, number>>
      type profileBioAssert = AssertTrue<
        IsExact<typeof userId.studentProfile.bio, string>
      >
      type educationNameAssert = AssertTrue<
        IsExact<typeof userId.studentProfile.education.name, string>
      >
      type userIdAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userId, "id" | "studentProfile">
      >
      type userIdAllPropertiesAssert2 = AssertTrue<
        IsExact<keyof typeof userId.studentProfile, "bio" | "education">
      >
      type userIdAllPropertiesAssert3 = AssertTrue<
        IsExact<keyof typeof userId.studentProfile.education, "name">
      >
    })
  })

  describe("create", () => {
    test("input model signature", () => {
      myDataSource.manager.repository(UserEntity).create({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).create({
        id: 1,
      })
    })

    test("partial entity", () => {
      const userPartialEntity = myDataSource.manager
        .repository(UserEntity)
        .create({
          id: 1,
          name: "name",
          active: true,
        })

      type userPartialEntityIdAssert = AssertTrue<
        IsExact<typeof userPartialEntity.id, number>
      >
      type userPartialEntityNameAssert = AssertTrue<
        IsExact<typeof userPartialEntity.name, string>
      >
      type userPartialEntityActiveAssert = AssertTrue<
        IsExact<typeof userPartialEntity.active, true>
      >
      type userPartialEntityAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userPartialEntity, "id" | "name" | "active">
      >
    })

    test("partial entity with embed", () => {
      const userPartialEntity = myDataSource.manager
        .repository(UserEntity)
        .create({
          id: 1,
          name: "name",
          profile: {
            bio: "bio",
            maritalStatus: "status",
          },
        })

      type userPartialEntityIdAssert = AssertTrue<
        IsExact<typeof userPartialEntity.id, number>
      >
      type userPartialEntityNameAssert = AssertTrue<
        IsExact<typeof userPartialEntity.name, string>
      >
      type userPartialEntityProfileBioAssert = AssertTrue<
        IsExact<typeof userPartialEntity.profile.bio, string>
      >
      type userPartialEntityProfileMaritalStatusAssert = AssertTrue<
        IsExact<typeof userPartialEntity.profile.maritalStatus, string>
      >
      type userPartialEntityProfileAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userPartialEntity.profile, "bio" | "maritalStatus">
      >
      type userPartialEntityAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof userPartialEntity, "id" | "name" | "profile">
      >
    })
  })

  describe("merge", () => {
    test("input model signature", () => {
      myDataSource.manager.repository(UserEntity).merge({
        //@ts-expect-error
        marmelad: true,
      })

      myDataSource.manager.repository(UserEntity).merge({
        id: 1,
      })
    })

    test("merge two entities", () => {
      const user1 = myDataSource.manager.repository(UserEntity).create({
        id: 1,
        name: "name",
      })

      const user2 = myDataSource.manager.repository(UserEntity).create({
        id: 1,
        phones: "phones",
      })

      const mergedEntity = myDataSource.manager
        .repository(UserEntity)
        .merge(user1, user2)

      type mergedEntityIdAssert = AssertTrue<
        IsExact<typeof mergedEntity.id, number>
      >
      type mergedEntityNameAssert = AssertTrue<
        IsExact<typeof mergedEntity.name, string>
      >
      type mergedEntityPhoneAssert = AssertTrue<
        IsExact<typeof mergedEntity.phones, string>
      >
      type mergedEntityAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof mergedEntity, "id" | "name" | "phones">
      >
    })

    test("merge two entities with embed", () => {
      const user1 = myDataSource.manager.repository(UserEntity).create({
        id: 1,
        name: "name",
        profile: { bio: "bio" },
      })

      const user2 = myDataSource.manager.repository(UserEntity).create({
        id: 1,
        phones: "phones",
        profile: { maritalStatus: "status" },
      })

      const mergedEntity = myDataSource.manager
        .repository(UserEntity)
        .merge(user1, user2)

      type mergedEntityIdAssert = AssertTrue<
        IsExact<typeof mergedEntity.id, number>
      >
      type mergedEntityNameAssert = AssertTrue<
        IsExact<typeof mergedEntity.name, string>
      >
      type mergedEntityPhoneAssert = AssertTrue<
        IsExact<typeof mergedEntity.phones, string>
      >
      type mergedEntityEmbedBioAssert = AssertTrue<
        IsExact<typeof mergedEntity.profile.bio, string>
      >
      type mergedEntityEmbedMaritalStatusAssert = AssertTrue<
        IsExact<typeof mergedEntity.profile.maritalStatus, string>
      >
      type mergedEntityAllPropertiesAssert = AssertTrue<
        IsExact<keyof typeof mergedEntity, "id" | "name" | "phones" | "profile">
      >
      type mergedEntityAllPropertiesAssert2 = AssertTrue<
        IsExact<keyof typeof mergedEntity.profile, "bio" | "maritalStatus">
      >
    })
  })
})
