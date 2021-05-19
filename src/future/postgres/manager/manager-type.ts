import {
  AnyEntity,
  EntityFromReference,
  EntityReference,
  ManagerBase,
  ManagerBasicMethods,
  ManagerCommonRdbmsMethods,
  ManagerFindMethods,
  ManagerPersistenceMethods,
  ManagerTreeMethods,
} from "../../core"
import { Releasable } from "../../core/connection"
import { PostgresDataSource } from "../data-source"
import { PostgresRepository } from "../repository"

export interface PostgresManager
  extends ManagerBase<PostgresDataSource<any>>,
    ManagerBasicMethods<PostgresDataSource<any>>,
    ManagerCommonRdbmsMethods<PostgresDataSource<any>>,
    ManagerFindMethods<PostgresDataSource<any>>,
    ManagerPersistenceMethods<PostgresDataSource<any>>,
    // ManagerRepositoryMethods<Types, Entities>,
    ManagerTreeMethods<PostgresDataSource<any>>,
    Releasable {
  /**
   * Gets the entity repository by a given entity name.
   *
   * todo: change current implementation, repository should be inside entity, e.g. Entity["repository"]
   */
  repository<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
  ): /*EntityName extends keyof Repositories
    ? Repositories[EntityName]
    : */ PostgresRepository<Entity> // Entities[EntityName]

  /**
   * Gets an entity repository by a given entity name and applies given custom repository functions.
   * This method is used to create custom repositories.
   */
  repository<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    CustomRepository
  >(
    entity: Reference,
    custom: CustomRepository & ThisType<PostgresRepository<Entity>>,
  ): PostgresRepository<Entity> & CustomRepository
}
