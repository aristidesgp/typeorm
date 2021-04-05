import { AnyDataSource } from "../data-source"

/**
 * Base Manager interface for all driver Manager implementations.
 */
export interface ManagerBase<Source extends AnyDataSource> {
  /**
   * Unique type identifier.
   */
  "@type": "Manager"

  /**
   * Data source of this repository.
   */
  dataSource: Source
}
