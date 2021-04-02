import {
  AnyDataSource,
  ManagerBase,
  ManagerBasicMethods,
  ManagerCommonRdbmsMethods,
  ManagerFindMethods,
  ManagerPersistenceMethods,
  ManagerRepositoryMethods,
  ManagerTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"

export interface PostgresManager<Source extends AnyDataSource>
  extends ManagerBase,
    ManagerBasicMethods<Source>,
    ManagerCommonRdbmsMethods<Source>,
    ManagerFindMethods<Source>,
    ManagerPersistenceMethods<Source>,
    ManagerRepositoryMethods<Source>,
    ManagerTreeMethods<Source>,
    Releasable {}
