import { DriverTypes } from "../driver"
import { AnyEntityList } from "../entity"
import { ValueOf } from "../util"

/**
 * Interface for repositories that implement methods working with tree tables / structures.
 */
export interface RepositoryTreeMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> {}
