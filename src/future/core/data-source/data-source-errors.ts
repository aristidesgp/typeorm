import { DriverType } from "../driver";

export const DataSourceErrors = {
    driverTypeNotSupported(type: DriverType) {
        return new Error(`Driver "${type}" isn't supported. Please make sure to specify a correct data source type.`)
    },
    driverTypeFailedToLoad(type: DriverType) {
        return new Error(`Cannot initialize data source with type "${type}". Please make sure to install required driver.`)
    },
}
