import { AnyEntityCollection, BaseDriverOptions } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDriverOptions<Collection extends AnyEntityCollection>
  extends BaseDriverOptions<Collection> {
  // todo: add postgres-specific driver options
}
