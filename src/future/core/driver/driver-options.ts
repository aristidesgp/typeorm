import {
  AnyEntity,
  AnyEntityCollection,
  AnyRepositoryList,
  EntityResolver,
} from "../entity"

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDriverOptions = BaseDriverOptions<
  AnyEntityCollection,
  AnyRepositoryList
>

/**
 * Options passed to the DataSource.
 */
export interface BaseDriverOptions<
  Collection extends AnyEntityCollection,
  CustomRepositories extends AnyRepositoryList
> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Collection

  /**
   * List of resolvers registered in the data source.
   */
  resolvers: EntityResolver<AnyEntity>[]

  /**
   * List of custom repositories registered in the data source.
   */
  repositories: CustomRepositories
}
