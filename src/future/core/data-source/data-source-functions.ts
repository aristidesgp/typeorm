import { SimpleConsoleLogger } from "../../../logger/SimpleConsoleLogger"
import { DefaultNamingStrategy } from "../../../naming-strategy/DefaultNamingStrategy"
import { AnyDriver } from "../driver"
import { DataSourceOptions } from "./data-source-options-types"
import { DataSource } from "./data-source-core-types"

/**
 * Creates a new data source.
 */
export function createDataSource<Driver extends AnyDriver>(
  options: DataSourceOptions<Driver>,
): DataSource<Driver> {
  const { driver } = options
  return {
    "@type": "DataSource",
    driver,
    options,
    isConnected: false,
    manager: driver.builder.manager(this),
    entityMetadatas: [],
    namingStrategy: new DefaultNamingStrategy(),
    logger: new SimpleConsoleLogger(),
    async connect() {
      return this
    },
    async close() {},
    async synchronize() {},
    createQueryRunner() {
      return driver.builder.queryRunner(this)
    },
  }
}
