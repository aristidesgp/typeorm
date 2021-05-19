import { BaseDataSourceOptions } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDataSourceOptions extends BaseDataSourceOptions {
  username: string
  password: string
  database: string
  // namingStrategy: PostgresNamingStrategy
}
