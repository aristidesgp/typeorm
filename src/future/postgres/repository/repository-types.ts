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
export interface PostgresRepository<
  Types extends DriverTypes,
  Entity extends AnyEntity
> extends RepositoryBase<Types, Entity>,
    RepositoryBasicMethods<Types, Entity>,
    RepositoryCommonRdbmsMethods<Types, Entity>,
    RepositoryFindMethods<Types, Entity>,
    RepositoryPersistenceMethods<Types, Entity>,
    RepositoryTreeMethods<Types, Entity>,
    Releasable {}
