import { AnyDataSource } from "../data-source"
import { ManagerBase } from "../manager"
import { CoreQueryRunner } from "../query-runner"
import { DriverTypes } from "./driver-column-types"
import { AnyDriverOptions } from "./driver-options"

/**
 * Any driver implementation.
 * Helper type.
 */
export type AnyDriver = CoreDriver<
  AnyDriverOptions,
  ManagerBase<any, any>,
  CoreQueryRunner,
  any
>

/**
 *
 */
export type CoreDriver<
  Options extends AnyDriverOptions,
  Manager extends ManagerBase<any, any>,
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

export type QueryResult<Types extends DriverTypes> = Types["queryResult"]

export type InsertResult<Types extends DriverTypes> = Types["insertResult"]

export type UpdateResult<Types extends DriverTypes> = Types["updateResult"]

export type DeleteResult<Types extends DriverTypes> = Types["deleteResult"]

export type IsolationLevels<
  Types extends DriverTypes
> = Types["isolationLevels"]
