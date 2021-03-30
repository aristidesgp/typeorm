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
