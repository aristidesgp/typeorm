import { Postgres } from "../../../src/future/postgres"

export enum Role {
  Admin,
  User,
}

export function UserEntity() {
  return Postgres.entity({
    columns: {
      id: {
        type: "int",
        primary: true,
      },
      name: {
        type: "varchar",
      },
      active: {
        type: "boolean",
      },
      phones: {
        type: "varchar",
        array: true,
      },
    },
  })
}
