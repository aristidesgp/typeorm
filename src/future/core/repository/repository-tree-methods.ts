import { DriverTypes } from "../driver"
import { AnyEntity } from "../entity"

/**
 * Interface for repositories that implement methods working with tree tables / structures.
 */
export interface RepositoryTreeMethods<
  Types extends DriverTypes,
  Entity extends AnyEntity
> {}
