import {
  AnyDataSource,
  RepositoryBase,
  RepositoryFindMethods,
  DataSourceEntity,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryPersistenceMethods,
} from "../../core"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> extends RepositoryBase,
    RepositoryBasicMethods<Source, Entity>,
    RepositoryCommonRdbmsMethods<Source, Entity>,
    RepositoryFindMethods<Source, Entity>,
    RepositoryPersistenceMethods<Source, Entity> {}
