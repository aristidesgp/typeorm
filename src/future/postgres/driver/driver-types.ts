import { CoreDataSource, CoreDriver } from "../../core"
import { PostgresManager } from "../manager"
import { PostgresQueryRunner } from "../query-runner"
import { PostgresColumnTypes } from "./driver-column-types"
import { PostgresDriverOptions } from "./driver-options-types"

export interface PostgresDriver<Options extends PostgresDriverOptions<any>>
  extends CoreDriver<
    Options,
    PostgresManager<CoreDataSource<PostgresDriver<Options>>>,
    PostgresQueryRunner,
    PostgresColumnTypes
  > {}
