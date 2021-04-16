import { AnyEntity, AnyEntityCollection, EntityResolver } from "../entity"

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDriverOptions = BaseDriverOptions<AnyEntityCollection>

/**
 * Options passed to the DataSource.
 */
export interface BaseDriverOptions<Collection extends AnyEntityCollection> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Collection

  /**
   * List of resolvers registered in the data source.
   */
  resolvers: EntityResolver<AnyEntity>[]
}
