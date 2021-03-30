import { AnyDriver, DriverEntities } from "../../core"
import { PostgresRepository } from "./repository-types"

export function createPostgresRepository(): PostgresRepository<
  AnyDriver,
  DriverEntities<AnyDriver>
> {
  return {
    "@type": "Repository",
    find() {
      return {} as any
    },
    options() {
      return {} as any
    },
  }
}
