import { AnyDataSource } from "../data-source"
import {
  EntityModelJustInserted,
  EntityModelPartial,
  EntityPointer,
  EntityReference,
} from "../entity"
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
export interface ManagerPersistenceMethods<Source extends AnyDataSource> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: InsertOptions<Source, Entity>,
  ): Promise<EntityModelJustInserted<Source, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: InsertOptions<Source, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Source, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: UpdateOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entity: EntityRef,
    options: UpdateByOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: DeleteOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: DeleteOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entity: EntityRef,
    options: DeleteByOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: ArchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: ArchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entity: EntityRef,
    options: ArchiveByOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: UnarchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    models: Model[],
    options?: UnarchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entity: EntityRef,
    options: UnarchiveByOptions<Source, Entity>,
  ): Promise<void>
}
