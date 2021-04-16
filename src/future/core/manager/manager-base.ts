import { AnyDataSource } from "../data-source"
import { DriverTypes } from "../driver"
import { AnyEntityList } from "../entity"

/**
 * Base Manager interface for all driver Manager implementations.
 */
export interface ManagerBase<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {
  /**
   * Unique type identifier.
   */
  "@type": "Manager"

  /**
   * Data source of this repository.
   */
  dataSource: AnyDataSource // todo: CoreDataSource<Types, Collection>
}
