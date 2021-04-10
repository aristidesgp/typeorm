import { PostgresRepository } from "../../postgres"
import { AnyDataSource } from "../data-source"
import { EntityPointer, EntityReference } from "../entity/entity-core"

/**
 * Interface for managers supporting repositories.
 */
export interface ManagerRepositoryMethods<Source extends AnyDataSource> {
  /**
   * Gets an entity repository by a given entity name.
   */
  repository<EntityRef extends EntityReference<Source>>(
    entity: EntityRef,
  ): PostgresRepository<Source, EntityPointer<Source, EntityRef>>

  /**
   * Gets an entity repository by a given entity name and applies given custom repository functions.
   * This method is used to create custom repositories.
   */
  repository<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    CustomRepository
  >(
    entity: EntityRef,
    custom: CustomRepository & ThisType<PostgresRepository<any, Entity>>,
  ): PostgresRepository<Source, Entity> & CustomRepository
}
