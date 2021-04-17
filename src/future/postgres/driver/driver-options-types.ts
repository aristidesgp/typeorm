import {
  AnyEntityCollection,
  AnyRepositoryList,
  BaseDriverOptions,
} from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDriverOptions<
  Collection extends AnyEntityCollection,
  CustomRepositories extends AnyRepositoryList
> extends BaseDriverOptions<Collection, CustomRepositories> {
  username: string
  password: string
  database: string
}
