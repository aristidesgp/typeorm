import { DriverType } from "../driver";
import { EntityMap } from "../entity";

export type AnyDataSourceOptions = DataSourceOptions<DriverType, EntityMap>;

export type DataSourceOptions<
    DatabaseType extends DriverType,
    Entities extends EntityMap
> = {
    type: DriverType;
    entities: Entities;
};
