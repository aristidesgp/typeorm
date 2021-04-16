import {
  AnyEntityList,
  DriverTypes,
  ManagerBase,
  ManagerBasicMethods,
  ManagerCommonRdbmsMethods,
  ManagerFindMethods,
  ManagerPersistenceMethods,
  ManagerRepositoryMethods,
  ManagerTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"

export interface PostgresManager<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> extends ManagerBase<Types, Entities>,
    ManagerBasicMethods<Types, Entities>,
    ManagerCommonRdbmsMethods<Types, Entities>,
    ManagerFindMethods<Types, Entities>,
    ManagerPersistenceMethods<Types, Entities>,
    ManagerRepositoryMethods<Types, Entities>,
    ManagerTreeMethods<Types, Entities>,
    Releasable {}
