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
    async find() {
      return {} as any
    },
    async findByIds() {
      return {} as any
    },
    async findOne() {
      return {} as any
    },
    async findOneOrFail() {
      return {} as any
    },
    async findOneById() {
      return {} as any
    },
    async findOneByIdOrFail() {
      return {} as any
    },
    async findAndCount() {
      return [] as any
    },
    async count() {
      return 0
    },
    findOptions: Options,
  }
}
