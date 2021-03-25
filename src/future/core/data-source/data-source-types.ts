import { EntityMap } from "../entity";
import { Manager } from "../manager";
import { ValueOf } from "../util";
import { DataSourceOptions } from "./data-source-options-types";
import {DriverType} from "../driver";


export type AnyDataSource = DataSource<DataSourceOptions<DriverType, EntityMap>>

export type DataSourceEntities<Source extends AnyDataSource> = ValueOf<Source["options"]["entities"]>

export type DataSource<Options extends DataSourceOptions<DriverType, EntityMap>> = {
    "@type": "DataSource"
    options: Options
    manager: Manager<DataSource<Options>>
}
