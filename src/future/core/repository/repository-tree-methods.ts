import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity"

/**
 * Interface for repositories that implement methods working with tree tables / structures.
 */
export interface RepositoryTreeMethods<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> {}
