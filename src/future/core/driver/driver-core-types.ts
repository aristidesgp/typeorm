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
  ManagerBase<any>,
  CoreQueryRunner,
  any
>

/**
 *
 */
export type CoreDriver<
  Options extends AnyDriverOptions,
  Manager extends ManagerBase<any>,
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

export type QueryResult<
  Driver extends AnyDriver
> = Driver["types"]["queryResult"]

export type InsertResult<
  Driver extends AnyDriver
> = Driver["types"]["insertResult"]

export type UpdateResult<
  Driver extends AnyDriver
> = Driver["types"]["updateResult"]

export type DeleteResult<
  Driver extends AnyDriver
> = Driver["types"]["deleteResult"]

export type IsolationLevels<
  Driver extends AnyDriver
> = Driver["types"]["isolationLevels"]
