import {
  AnyDataSource,
  CoreRepository,
  CoreRepositoryWithFind,
  CoreRepositoryWithOptions,
  DataSourceEntity,
} from "../../core"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> extends CoreRepository,
    CoreRepositoryWithFind<Source, Entity>,
    CoreRepositoryWithOptions<Source, Entity> {}
