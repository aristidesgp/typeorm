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
    findOptions: Options,
    hasId() {
      return {} as any
    },
    getId() {
      return {} as any
    },
    create() {
      return {} as any
    },
    merge() {
      return {} as any
    },
    createQueryBuilder() {
      return {} as any
    },
    async query() {
      return {} as any
    },
    async clear() {
      return {} as any
    },
    async increment() {
      return {} as any
    },
    async decrement() {
      return {} as any
    },
    async save() {
      return {} as any
    },
    async remove() {
      return {} as any
    },
    async softRemove() {
      return {} as any
    },
    async recover() {
      return {} as any
    },
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
    async release() {
      return null as any
    },
  }
}
