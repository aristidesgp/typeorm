import { BaseDriverOptions, AnyEntityList } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDriverOptions<Entities extends AnyEntityList>
  extends BaseDriverOptions<Entities> {
  // todo: add postgres-specific driver options
}
