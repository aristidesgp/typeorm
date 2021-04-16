import { DriverTypes } from "../../driver"
import { AnyEntityList } from "../../entity"
import { ValueOf } from "../../util"
import { FindOptions } from "./find-options-one"

/**
 * Extending find options for queries loading multiple items.
 */
export interface FindOptionsMany<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> extends FindOptions<Types, Entities, Entity> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  take?: number
}
