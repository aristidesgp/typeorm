import { AnyDataSource, DriverEntities } from "../../core"
import { PostgresRepository } from "./repository-types"

export function createPostgresRepository(): PostgresRepository<
  AnyDataSource,
  DriverEntities<AnyDataSource["driver"]>
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
