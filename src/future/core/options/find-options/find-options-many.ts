import { AnyDataSource, DataSourceEntity } from "../../data-source"
import { FindOptions } from "./find-options-one"

/**
 * Extending find options for queries loading multiple items.
 */
export interface FindOptionsMany<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> extends FindOptions<Source, Entity> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  take?: number
}
