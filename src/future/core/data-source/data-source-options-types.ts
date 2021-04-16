import { AnyDriver } from "../driver"

export type DataSourceOptions<Driver extends AnyDriver> = {
  type: Driver
  // subscribers
  // namingStrategy
  // logger
  // synchronize
  // entityPrefix
  // cache
}

/**
 * Any entity registered in a given DataSource.
 */
// export type DataSourceEntity<Source extends AnyDataSource> = ValueOf<
//   Source["driver"]["options"]["entities"]
// >
