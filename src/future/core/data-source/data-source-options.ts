import { AnyEntityList } from "../entity"
import { LoggerBase } from "../logger"
import { NamingStrategyBase } from "../naming-strategy"

// todo: rename to DataSourceOptions

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDataSourceOptions = BaseDataSourceOptions<AnyEntityList>

/**
 * Options passed to the DataSource.
 */
export interface BaseDataSourceOptions<Entities extends AnyEntityList> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Entities

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
