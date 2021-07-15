import {PostgresManager} from "../manager"
import {PostgresConnection} from "../query-runner"
import {PostgresDataSourceOptions} from "./data-source-options-types"
import {PostgresDataSource} from "./data-source-types"
import {DataSourceAbstract} from "../../core";
import {PostgresDataSourceTypes} from "./data-source-column-types";

export function postgres<Options extends PostgresDataSourceOptions>(
  options: Options,
): PostgresDataSource<Options> {
  return new DataSourceAbstract<
    Options,
    PostgresManager,
    PostgresConnection,
    PostgresDataSourceTypes
    >(options, {
    async connect() {
    },
    async disconnect() {
    },
    async dropEverything() {
    },
    async syncSchema() {
    },
    createConnection() {
      return null as any
    },
    createManager() {
      return null as any
    }
  })
}
