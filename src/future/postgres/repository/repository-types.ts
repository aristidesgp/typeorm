import {
  AnyEntityList,
  DriverTypes,
  RepositoryBase,
  RepositoryBasicMethods,
  RepositoryCommonRdbmsMethods,
  RepositoryFindMethods,
  RepositoryPersistenceMethods,
  RepositoryTreeMethods,
  ValueOf,
} from "../../core"
import { Releasable } from "../../core/connection"

/**
 * A single repository managing a particular entity.
 */
export interface PostgresRepository<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> extends RepositoryBase<Types, Entities, Entity>,
    RepositoryBasicMethods<Types, Entities, Entity>,
    RepositoryCommonRdbmsMethods<Types, Entities, Entity>,
    RepositoryFindMethods<Types, Entities, Entity>,
    RepositoryPersistenceMethods<Types, Entities, Entity>,
    RepositoryTreeMethods<Types, Entities, Entity>,
    Releasable {}
