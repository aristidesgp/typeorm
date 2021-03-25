import { Driver, DriverTypes, Manager } from "../core";

export type PostgresTypes = DriverTypes<{
    int: { type: number };
    varchar: { type: string };
    boolean: { type: boolean };
}>;

export const PostgresDriver: Driver = {
    builder: {
        manager(): Manager<any> {
            return null as any;
        }
    }
};
