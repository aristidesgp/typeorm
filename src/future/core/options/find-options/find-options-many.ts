import { AnyDriver } from "../../driver"
import { AnyEntity } from "../../entity"
import { FindOptions } from "./find-options-one"

/**
 * Extending find options for queries loading multiple items.
 */
export interface FindOptionsMany<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> extends FindOptions<Driver, Entity> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  take?: number
}
