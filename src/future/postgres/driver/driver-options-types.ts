import { AnyEntityList, BaseDriverOptions } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDriverOptions<Entities extends AnyEntityList>
  extends BaseDriverOptions<Entities> {
  username: string
  password: string
  database: string
}
