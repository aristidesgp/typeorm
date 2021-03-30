import { AnyDriver } from "../driver"
import { ValueOf } from "../util"
import { AnyDataSource } from "./data-source-core-types"

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
export type DataSourceEntity<Source extends AnyDataSource> = ValueOf<
  Source["driver"]["options"]["entities"]
>
