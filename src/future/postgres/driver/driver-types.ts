import { CoreDriver } from "../../core"
import { PostgresQueryRunner } from "../query-runner/query-runner-types"
import { PostgresColumnTypes } from "./driver-column-types"
import { PostgresManager } from "../manager"
import { PostgresDriverOptions } from "./driver-options-types"

export interface PostgresDriver<Options extends PostgresDriverOptions<any>>
  extends CoreDriver<
    Options,
    PostgresManager<PostgresDriver<Options>>,
    PostgresQueryRunner,
    PostgresColumnTypes
  > {}
