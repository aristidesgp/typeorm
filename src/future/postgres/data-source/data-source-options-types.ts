import { AnyEntityList, BaseDataSourceOptions } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDataSourceOptions<Entities extends AnyEntityList>
  extends BaseDataSourceOptions<Entities> {
  username: string
  password: string
  database: string
}
