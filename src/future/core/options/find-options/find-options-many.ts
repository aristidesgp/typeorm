import { AnyEntity } from "../../entity"
import { FindOptions } from "./find-options-one"

/**
 * Extending find options for queries loading multiple items.
 */
export interface FindOptionsMany<
  Entity extends AnyEntity // ValueOf<Entities>
> extends FindOptions<Entity> {
  /**
   * Offset (paginated) where from entities should be taken.
   */
  skip?: number

  /**
   * Limit (paginated) - max number of entities should be taken.
   */
  take?: number
}
