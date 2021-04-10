import { AnyEntityList } from "../entity/entity-core"

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDriverOptions = BaseDriverOptions<AnyEntityList>

/**
 * Options passed to the DataSource.
 */
export interface BaseDriverOptions<Entities extends AnyEntityList> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Entities
}
