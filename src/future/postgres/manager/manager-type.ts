import {
  AnyEntity,
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
  Repositories extends AnyRepositoryList
> extends ManagerBase<Types>,
    ManagerBasicMethods<Types>,
    ManagerCommonRdbmsMethods<Types>,
    ManagerFindMethods<Types>,
    ManagerPersistenceMethods<Types>,
    // ManagerRepositoryMethods<Types, Entities>,
    ManagerTreeMethods<Types>,
    Releasable {
  /**
   * Gets the entity repository by a given entity name.
   *
   * todo: change current implementation, repository should be inside entity, e.g. Entity["repository"]
   */
  repository<Entity extends AnyEntity>(
    entity: () => Entity,
  ): /*EntityName extends keyof Repositories
    ? Repositories[EntityName]
    : */ PostgresRepository<
    Types,
    Entity
  > // Entities[EntityName]

  /**
   * Gets an entity repository by a given entity name and applies given custom repository functions.
   * This method is used to create custom repositories.
   */
  repository<Entity extends AnyEntity, CustomRepository>(
    entity: () => Entity,
    custom: CustomRepository & ThisType<PostgresRepository<Types, Entity>>,
  ): PostgresRepository<Types, Entity> & CustomRepository
}
