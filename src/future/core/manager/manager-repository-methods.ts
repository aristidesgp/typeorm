import { DriverTypes } from "../driver"
import { AnyEntityList, EntityReference } from "../entity/entity-core"

/**
 * Interface for managers supporting repositories.
 */
export interface ManagerRepositoryMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {
  /**
   * Gets an entity repository by a given entity name.
   */
  repository<EntityRef extends EntityReference<Entities>>(
    entity: EntityRef,
  ): any // PostgresRepository<Types, EntityPointer<Entities, EntityRef>> // todo: FIX POSTGRES DEP

  /**
   * Gets an entity repository by a given entity name and applies given custom repository functions.
   * This method is used to create custom repositories.
   */
  // repository<// todo: FIX POSTGRES DEP
  //   EntityRef extends EntityReference<Entities>,
  //   Entity extends EntityPointer<Entities, EntityRef>,
  //   CustomRepository
  // >(
  //   entity: EntityRef,
  //   custom: CustomRepository & ThisType<PostgresRepository<Source, Entity>>,
  // ): any // PostgresRepository<Source, Entity> & CustomRepository
}
