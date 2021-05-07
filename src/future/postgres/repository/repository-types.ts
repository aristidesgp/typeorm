import {
  AnyEntity,
  RepositoryBase,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryFindMethods,
  RepositoryPersistenceMethods,
  RepositoryTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"
import { PostgresDriver } from "../driver"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<Entity extends AnyEntity>
  extends RepositoryBase<PostgresDriver<any>, Entity>,
    RepositoryBasicMethods<PostgresDriver<any>, Entity>,
    RepositoryCommonRdbmsMethods<PostgresDriver<any>, Entity>,
    RepositoryFindMethods<PostgresDriver<any>, Entity>,
    RepositoryPersistenceMethods<PostgresDriver<any>, Entity>,
    RepositoryTreeMethods<PostgresDriver<any>, Entity>,
    Releasable {}
