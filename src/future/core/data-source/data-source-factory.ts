import { PostgresDriver } from "../../postgres";
import { Driver } from "../driver";
import { AnyDataSourceOptions } from "./data-source-options-types";
import { DataSource } from "./data-source-types";

export const DataSourceFactory = {
    create<Options extends AnyDataSourceOptions>(options: Options): DataSource<Options> {

        if (options.type !== "postgres" &&
            options.type !== "mysql" &&
            options.type !== "sqlite") {
            throw new Error(`Driver "${options.type}" isn't supported. Please make sure to specify a correct data source type.`)
        }

        let driver: Driver | undefined = undefined
        if (options.type === "postgres") {
            driver = PostgresDriver
        // } else if (options.type === "mysql") {
        //     driver = MysqlDriver
        // } else if (options.type === "sqlite") {
        //     driver = SqliteDriver
        }
        if (!driver)
            throw new Error(`Cannot initialize data source with type "${options.type}". Please make sure to install required driver.`)

        const manager = driver.builder.manager()

        return {
            "@type": "DataSource",
            options,
            manager,
            // entity: () => {
            //     return undefined as any
            // }
        }
    }
}
