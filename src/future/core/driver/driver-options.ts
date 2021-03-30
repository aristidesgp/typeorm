import { EntityList } from "../entity"

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDriverOptions = BaseDriverOptions<EntityList>

/**
 * Options passed to the DataSource.
 */
export interface BaseDriverOptions<Entities extends EntityList> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Entities
}
