import {
  AnyEntityCollection,
  AnyRepositoryList,
  CoreDriver,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresManager } from "../manager"
import { PostgresQueryRunner } from "../query-runner"
import { PostgresDriverTypes } from "./driver-column-types"
import { PostgresDriverOptions } from "./driver-options-types"

export interface PostgresDriver<
  Options extends PostgresDriverOptions<AnyEntityCollection, AnyRepositoryList>
> extends CoreDriver<
    Options,
    PostgresManager<
      PostgresDriverTypes,
      ForceCastIfUndefined<Options["repositories"], {}>
    >,
    PostgresQueryRunner,
    PostgresDriverTypes
  > {}
