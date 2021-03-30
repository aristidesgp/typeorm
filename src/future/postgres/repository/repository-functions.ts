import { AnyDataSource, DataSourceEntity } from "../../core"
import { PostgresRepository } from "./repository-types"

export function createPostgresRepository(): PostgresRepository<
  AnyDataSource,
  DataSourceEntity<AnyDataSource>
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
