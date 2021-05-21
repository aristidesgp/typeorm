import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { FindOptions } from "./find-options-one"

/**
 * Extending find options for queries loading multiple items.
 */
export type FindOptionsMany<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = FindOptions<DataSource, Entity> & {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  take?: number
}
