import { AnyEntityList } from "../../core"
import { createPostgresManager } from "../manager"
import { createPostgresQueryRunner } from "../query-runner"
import { PostgresDriverOptions } from "./driver-options-types"
import { PostgresDriver } from "./driver-types"

export function postgres<Options extends PostgresDriverOptions<AnyEntityList>>(
  options: Options,
): PostgresDriver<Options> {
  // return null as any
  return {
    types: null as any,
    manager: null as any,
    queryRunner: null as any,
    options,
    builder: {
      manager(dataSource) {
        return createPostgresManager(dataSource)
      },
      queryRunner(dataSource) {
        return createPostgresQueryRunner()
      },
    },
  }
}
