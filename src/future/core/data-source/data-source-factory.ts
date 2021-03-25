import { PostgresDriver } from "../../postgres";
import { Driver, DriverType } from "../driver";
import { DataSourceErrors } from "./data-source-errors";
import { AnyDataSourceOptions } from "./data-source-options-types";
import { DataSource } from "./data-source-types";

export const DataSourceFactory = {
    /**
     * List of supported driver types.
     */
    supportedDrivers: [
        "postgres",
        "mysql",
        "sqlite"
    ] as DriverType[],

    /**
     * Checks if given driver type is supported or not.
     */
    isDriverTypeSupported(type: DriverType): boolean {
        return type === "postgres" ||
            type === "mysql" ||
            type === "sqlite"
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
    create<Options extends AnyDataSourceOptions>(options: Options): DataSource<Options> {
        if (!this.isDriverTypeSupported(options.type))
            throw DataSourceErrors.driverTypeNotSupported(options.type)

        const driver = this.loadDriver(options.type)
        const manager = driver.builder.manager()

        return {
            "@type": "DataSource",
            options,
            manager,
        }
    }
}
