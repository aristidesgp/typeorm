import { EntityReference } from "../entity"
import { LoggerBase } from "../logger"
import { NamingStrategyBase } from "../naming-strategy"

/**
 * Options passed to the DataSource.
 */
export interface BaseDataSourceOptions {
  /**
   * List of entities to be used in this data source.
   */
  entities: EntityReference[]

  /**
   * Naming strategy used to name things.
   */
  namingStrategy?: NamingStrategyBase

  /**
   * Logger used to log things.
   */
  logger?: LoggerBase

  /**
   * Indicates if schema synchronization is enabled or not.
   */
  synchronize?: boolean
}

// subscribers -> needs design first
// entityPrefix -> driver-specific and can be named as "tablePrefix", "documentPrefix", etc.
// cache -> not sure if should be driver-specific
