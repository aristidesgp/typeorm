import { AnyEntityList } from "../entity"
import { ValueOf } from "../util"
import { AnyDriver } from "./driver-core-types"

/**
 * Any DataSourceOptions. Helper type.
 */
export type AnyDriverOptions = BaseDriverOptions<AnyEntityList>

/**
 * Options passed to the DataSource.
 */
export interface BaseDriverOptions<Entities extends AnyEntityList> {
  /**
   * List of entities to be used in this data source.
   */
  entities: Entities
}

/**
 * Entities registered in the Driver.
 */
export type DriverEntities<Driver extends AnyDriver> = ValueOf<
  Driver["options"]["entities"]
>
