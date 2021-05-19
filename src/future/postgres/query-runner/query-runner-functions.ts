import { PostgresConnection } from "./query-runner-types"

export function createPostgresConnection(): PostgresConnection {
  return {
    isReleased: false,
  }
}
