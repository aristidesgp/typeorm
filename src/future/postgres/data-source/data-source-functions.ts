import { SimpleConsoleLogger } from "../../../logger/SimpleConsoleLogger"
import { DefaultNamingStrategy } from "../../../naming-strategy/DefaultNamingStrategy"
import { AnyEntityList } from "../../core"
import { createPostgresManager } from "../manager"
import { createPostgresConnection } from "../query-runner"
import { PostgresDataSourceOptions } from "./data-source-options-types"
import { PostgresDataSource } from "./data-source-types"

export function postgres<Options extends PostgresDataSourceOptions>(
  options: Options,
): PostgresDataSource<Options> {
  // return null as any
  return {
    "@type": "DataSource",
    options,
    isConnected: false,
    // get manager() {
    //   return this.builder.manager(this)
    // },
    entityMetadatas: [],
    // namingStrategy: null as any, // new DefaultNamingStrategy(),
    // logger: new SimpleConsoleLogger(),
    async connect() {
      return this
    },
    async close() {},
    async synchronize() {},
    createConnection() {
      return this.builder.connection(this)
    },
    types: null as any,
    manager: null as any,
    connection: null as any,
    builder: {
      manager() {
        return createPostgresManager()
      },
      connection() {
        return createPostgresConnection()
      },
    },
  }
}
