import { AnyEntityList, CoreDataSource } from "../../core"
import { PostgresManager } from "../manager"
import { PostgresNamingStrategy } from "../naming-strategy"
import { PostgresConnection } from "../query-runner"
import { PostgresDataSourceTypes } from "./data-source-column-types"
import { PostgresDataSourceOptions } from "./data-source-options-types"

export interface PostgresDataSource<Options extends PostgresDataSourceOptions>
  extends CoreDataSource<
    Options,
    PostgresManager,
    PostgresConnection,
    PostgresDataSourceTypes
  > {}
