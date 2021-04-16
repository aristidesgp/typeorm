import { AnyEntityCollection, CoreDriver } from "../../core"
import { PostgresManager } from "../manager"
import { PostgresQueryRunner } from "../query-runner"
import { PostgresDriverTypes } from "./driver-column-types"
import { PostgresDriverOptions } from "./driver-options-types"

export interface PostgresDriver<
  Options extends PostgresDriverOptions<AnyEntityCollection>
> extends CoreDriver<
    Options,
    PostgresManager<PostgresDriverTypes, Options["entities"]["entities"]>,
    PostgresQueryRunner,
    PostgresDriverTypes
  > {}
