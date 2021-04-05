import {
  AnyDataSource,
  RepositoryBase,
  RepositoryFindMethods,
  DataSourceEntity,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryPersistenceMethods,
  RepositoryTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> extends RepositoryBase<Source, Entity>,
    RepositoryBasicMethods<Source, Entity>,
    RepositoryCommonRdbmsMethods<Source, Entity>,
    RepositoryFindMethods<Source, Entity>,
    RepositoryPersistenceMethods<Source, Entity>,
    RepositoryTreeMethods<Source, Entity>,
    Releasable {}
