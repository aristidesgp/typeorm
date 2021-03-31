import { AnyDataSource, DataSourceEntity } from "../../core"
import { PostgresRepository } from "./repository-types"

export function createPostgresRepository(): PostgresRepository<
  AnyDataSource,
  DataSourceEntity<AnyDataSource>
> {
  function Options() {
    return {} as any
  }
  Options.select = () => {
    return {} as any
  }
  Options.where = () => {
    return {} as any
  }
  Options.order = () => {
    return {} as any
  }

  return {
    "@type": "Repository",
    find() {
      return {} as any
    },
    findOptions: Options,
  }
}
