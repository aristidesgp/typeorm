import { EntityMap } from "../entity";

export type DataSourceDatabaseType = "mysql" | "postgres" | "sqlite"

export type AnyDataSourceOptions = DataSourceOptions<DataSourceDatabaseType, EntityMap>

export type DataSourceOptions<
    DatabaseType extends DataSourceDatabaseType,
    Entities extends EntityMap
> = {
    type: DataSourceDatabaseType
    entities: Entities
}

