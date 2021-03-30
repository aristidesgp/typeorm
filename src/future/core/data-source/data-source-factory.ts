import { SimpleConsoleLogger } from "../../../logger/SimpleConsoleLogger"
import { DefaultNamingStrategy } from "../../../naming-strategy/DefaultNamingStrategy"
import { AnyDriver } from "../driver"
import { DataSourceOptions } from "./data-source-options-types"
import { CoreDataSource } from "./data-source-core-types"

/**
 * Working with DataSource.
 */
export const DataSource = {
  /**
   * Creates a new data source.
   */
  create<Driver extends AnyDriver>(
    options: DataSourceOptions<Driver>,
  ): CoreDataSource<Driver> {
    const driver = options.type
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
  },
}
