import { AnyDataSource } from "../data-source"
import { CoreManager } from "../manager"
import { CoreQueryRunner } from "../query-runner"
import { AnyDriverOptions } from "./driver-options"

/**
 * Any driver implementation.
 * Helper type.
 */
export type AnyDriver = CoreDriver<any, CoreManager, any, any>

/**
 *
 */
export type CoreDriver<
  Options extends AnyDriverOptions,
  Manager extends CoreManager,
  QueryRunner extends CoreQueryRunner,
  ColumnTypes // extends DriverColumnTypes
> = {
  options: Options
  manager: Manager
  queryRunner: QueryRunner
  columnTypes: ColumnTypes
  builder: {
    manager(dataSource: AnyDataSource): Manager
    queryRunner(dataSource: AnyDataSource): QueryRunner
  }
}
