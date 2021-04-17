import {
  AnyEntityList,
  AnyRepositoryList,
  DriverTypes,
  ManagerBase,
  ManagerBasicMethods,
  ManagerCommonRdbmsMethods,
  ManagerFindMethods,
  ManagerPersistenceMethods,
  ManagerTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"
import { PostgresRepository } from "../repository"

export interface PostgresManager<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Repositories extends AnyRepositoryList
> extends ManagerBase<Types, Entities>,
    ManagerBasicMethods<Types, Entities>,
    ManagerCommonRdbmsMethods<Types, Entities>,
    ManagerFindMethods<Types, Entities>,
    ManagerPersistenceMethods<Types, Entities>,
    // ManagerRepositoryMethods<Types, Entities>,
    ManagerTreeMethods<Types, Entities>,
    Releasable {
  /**
   * Gets the entity repository by a given entity name.
   */
  repository<EntityName extends keyof Entities>(
    entity: EntityName,
  ): EntityName extends keyof Repositories
    ? Repositories[EntityName]
    : PostgresRepository<Types, Entities, Entities[EntityName]>
}
