import { DriverTypes } from "../driver"
import { AnyEntityList } from "../entity"

/**
 * Interface for mangers that implement methods working with tree tables / structures.
 */
export interface ManagerTreeMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {}
