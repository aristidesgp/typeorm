import { PostgresRepository } from "../../postgres"
import { AnyDataSource } from "../data-source"
import { EntityPointer, EntityReference } from "../entity"

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
}
