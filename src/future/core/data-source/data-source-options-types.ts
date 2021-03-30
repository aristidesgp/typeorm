import { AnyDriver } from "../driver"

export type DataSourceOptions<Driver extends AnyDriver> = {
  driver: Driver
  // subscribers
  // namingStrategy
  // logger
  // synchronize
  // entityPrefix
  // cache
}
