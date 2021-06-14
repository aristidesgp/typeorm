import {
  AnyEntity,
  RepositoryBase,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryFindMethods,
  RepositoryPersistenceMethods,
  RepositoryTreeMethods,
} from "../../core"
import { Releasable } from "../../core"
import { PostgresDataSource } from "../data-source"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<Entity extends AnyEntity>
  extends RepositoryBase<PostgresDataSource<any>, Entity>,
    RepositoryBasicMethods<PostgresDataSource<any>, Entity>,
    RepositoryCommonRdbmsMethods<PostgresDataSource<any>, Entity>,
    RepositoryFindMethods<PostgresDataSource<any>, Entity>,
    RepositoryPersistenceMethods<PostgresDataSource<any>, Entity>,
    RepositoryTreeMethods<PostgresDataSource<any>, Entity>,
    Releasable {}
