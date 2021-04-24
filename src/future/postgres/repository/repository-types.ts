import {
  AnyEntity,
  DriverTypes,
  RepositoryBase,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryFindMethods,
  RepositoryPersistenceMethods,
  RepositoryTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<Entity extends AnyEntity>
  extends RepositoryBase<Entity>,
    RepositoryBasicMethods<Entity>,
    RepositoryCommonRdbmsMethods<Entity>,
    RepositoryFindMethods<Entity>,
    RepositoryPersistenceMethods<Entity>,
    RepositoryTreeMethods<Entity>,
    Releasable {}
