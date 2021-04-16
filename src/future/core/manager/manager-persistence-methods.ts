import { DriverTypes } from "../driver"
import {
  AnyEntityList,
  EntityPointer,
  EntityReference,
} from "../entity/entity-core"
import { EntityModelAfterInsert } from "../entity/entity-insert"
import { EntityModelPartial } from "../entity/entity-model"
import {
  ArchiveByOptions,
  ArchiveOptions,
  DeleteByOptions,
  DeleteOptions,
  InsertOptions,
  UnarchiveByOptions,
  UnarchiveOptions,
  UpdateByOptions,
  UpdateOptions,
} from "../options/persistence-options"

/**
 * Interface for managers that implement persistence / alteration operations.
 */
export interface ManagerPersistenceMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: InsertOptions<Types, Entities, Entity>,
  ): Promise<EntityModelAfterInsert<Types, Entities, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: InsertOptions<Types, Entities, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Types, Entities, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: UpdateOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    options: UpdateByOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: DeleteOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: DeleteOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    options: DeleteByOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: ArchiveOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: ArchiveOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    options: ArchiveByOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: UnarchiveOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: UnarchiveOptions<Types, Entities, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    options: UnarchiveByOptions<Types, Entities, Entity>,
  ): Promise<void>
}
