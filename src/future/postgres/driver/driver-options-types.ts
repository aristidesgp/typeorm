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
  // todo: add postgres-specific driver options
}
