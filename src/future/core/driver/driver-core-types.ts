import { AnyDataSource } from "../data-source"
import { CoreManager } from "../manager"
import { CoreQueryRunner } from "../query-runner"
import { DriverTypes } from "./driver-column-types"
import { AnyDriverOptions } from "./driver-options"

/**
 * Any driver implementation.
 * Helper type.
 */
export type AnyDriver = CoreDriver<
  AnyDriverOptions,
  CoreManager,
  CoreQueryRunner,
  any
>

/**
 *
 */
export type CoreDriver<
  Options extends AnyDriverOptions,
  Manager extends CoreManager,
  QueryRunner extends CoreQueryRunner,
  Types extends DriverTypes
> = {
  options: Options
  manager: Manager
  queryRunner: QueryRunner
  types: Types
  builder: {
    manager(dataSource: AnyDataSource): Manager
    queryRunner(dataSource: AnyDataSource): QueryRunner
  }
}
