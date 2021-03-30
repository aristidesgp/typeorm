import { BaseDriverOptions, EntityList } from "../../core"

/**
 * Postgres driver options.
 */
export interface PostgresDriverOptions<Entities extends EntityList>
  extends BaseDriverOptions<Entities> {
  // todo: add postgres-specific driver options
}
