import { EntityMap } from "../entity";
import { Manager } from "../manager";
import { ValueOf } from "../util";
import { DataSourceDatabaseType, DataSourceOptions } from "./data-source-options-types";


export type AnyDataSource = DataSource<DataSourceOptions<DataSourceDatabaseType, EntityMap>>

export type DataSourceEntities<Source extends AnyDataSource> = ValueOf<Source["options"]["entities"]>

export type DataSource<Options extends DataSourceOptions<DataSourceDatabaseType, EntityMap>> = {
    "@type": "DataSource"
    options: Options
    manager: Manager<DataSource<Options>>
}
