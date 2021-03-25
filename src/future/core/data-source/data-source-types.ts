import { EntityMap } from "../entity";
import { Manager } from "../manager";
import { ValueOf } from "../util";
import { DriverType, DataSourceOptions } from "./data-source-options-types";


export type AnyDataSource = DataSource<DataSourceOptions<DriverType, EntityMap>>

export type DataSourceEntities<Source extends AnyDataSource> = ValueOf<Source["options"]["entities"]>

export type DataSource<Options extends DataSourceOptions<DriverType, EntityMap>> = {
    "@type": "DataSource"
    options: Options
    manager: Manager<DataSource<Options>>
}
