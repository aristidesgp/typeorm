import {
  AnyDataSource,
  CoreRepository,
  CoreRepositoryWithFind,
  CoreRepositoryWithOptions,
  DriverEntities,
} from "../../core"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Source extends AnyDataSource,
  Entity extends DriverEntities<Source["driver"]>
>
  extends CoreRepository,
    CoreRepositoryWithFind<Source, Entity>,
    CoreRepositoryWithOptions<Source, Entity> {}
