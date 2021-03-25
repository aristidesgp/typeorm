import { Manager } from "../manager";

export type DriverType = "mysql" | "postgres" | "sqlite"

export type AnyDriverTypes = DriverTypes<any>
export type DriverTypes<ColumnTypes extends DriverColumnTypes> = {
    columnTypes: ColumnTypes
}

export type DriverColumnTypes = {
    [databaseTypeName: string]: DriverColumnTypeOptions<any>
}

export type DriverColumnTypeOptions<Type> = {
    type: Type
}

export type Driver = {
    builder: {
        manager(): Manager<any>
    }
}
