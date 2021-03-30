import { PostgresRepository } from "./repository-types"

export function createPostgresRepository(): PostgresRepository<any, any> {
  return {
    find() {
      return {} as any
    },
    options() {
      return {} as any
    },
  }
}
