import {
  AnyDriver,
  CoreRepository,
  CoreRepositoryWithFind,
  CoreRepositoryWithOptions,
  DriverEntities,
} from "../../core"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Driver extends AnyDriver,
  Entity extends DriverEntities<Driver>
>
  extends CoreRepository,
    CoreRepositoryWithFind<Driver, Entity>,
    CoreRepositoryWithOptions<Driver, Entity> {}
