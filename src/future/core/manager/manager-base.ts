import { AnyDataSource } from "../data-source"
import { AnyDriver } from "../driver"

/**
 * Base Manager interface for all driver Manager implementations.
 */
export interface ManagerBase<Driver extends AnyDriver> {
  /**
   * Unique type identifier.
   */
  "@type": "Manager"

  /**
   * Data source of this repository.
   */
  dataSource: AnyDataSource // todo: CoreDataSource<Types, Collection>
}
