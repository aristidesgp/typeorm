import { SimpleConsoleLogger } from "../../../logger/SimpleConsoleLogger"
import { DefaultNamingStrategy } from "../../../naming-strategy/DefaultNamingStrategy"
import { PostgresDriver } from "../../postgres"
import { Driver, DriverType } from "../driver"
import { RepositoryList } from "../repository"
import { DataSourceErrors } from "./data-source-errors"
import { AnyDataSourceOptions } from "./data-source-options-types"
import { DataSource } from "./data-source-types"

export const DataSourceFactory = {
  /**
   * List of supported driver types.
   */
  get supportedDrivers(): DriverType[] {
    return [
      "postgres",
      "cockroachdb",
      "mysql",
      "mariadb",
      "mssql",
      "sap",
      "oracle",
      "sqlite",
      "better-sqlite3",
      "cordova",
      "nativescript",
      "react-native",
      "sqljs",
      "expo",
      "aurora-data-api",
      "aurora-data-api-pg",
      "mongodb",
    ]
  },

  /**
   * Checks if given driver type is supported or not.
   */
  isDriverTypeSupported(type: DriverType): boolean {
    return this.supportedDrivers.indexOf(type) !== -1
  },

  /**
   * Loads driver instance out of a given driver type.
   */
  loadDriver(type: DriverType): Driver {
    // once we split the packages, we'll most probably have dynamic requires here

    if (type === "postgres") {
      return PostgresDriver
    } else if (type === "mysql") {
      // return MysqlDriver
    } else if (type === "sqlite") {
      // return SqliteDriver
    }

    throw DataSourceErrors.driverTypeFailedToLoad(type)
  },

  /**
   * Creates a new data source.
   */
  create<Options extends AnyDataSourceOptions>(
    options: Options,
  ): DataSource<Options> {
    if (!this.isDriverTypeSupported(options.type))
      throw DataSourceErrors.driverTypeNotSupported(options.type)

    const driverPackage: Driver = this.loadDriver(options.type)
    const manager = driverPackage.builder.manager()
    const driver = driverPackage.builder.driver()
    const repositoryList: RepositoryList<any> = {}
    for (let entityName in options.entities) {
      repositoryList[entityName] = driverPackage.builder.repository(
        entityName,
        options.entities[entityName],
      )
    }

    return {
      "@type": "DataSource",
      options,
      isConnected: false,
      driver: driver,
      manager,
      entityMetadatas: [],
      namingStrategy: new DefaultNamingStrategy(),
      logger: new SimpleConsoleLogger(),
      repository: repositoryList,
      async connect() {
        return this
      },
      async close() {},
      async synchronize() {},
      createQueryRunner() {
        return driverPackage.builder.queryRunner()
      },
    }
  },
}
