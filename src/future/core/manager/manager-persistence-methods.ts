import { AnyDriver } from "../driver"
import {
  AnyEntity,
  EntityFromReference,
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
export interface ManagerPersistenceMethods<Driver extends AnyDriver> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
    options?: InsertOptions<Driver, Entity>,
  ): Promise<EntityModelAfterInsert<Driver, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    models: Model[],
    options?: InsertOptions<Driver, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
    options?: UpdateOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    options: UpdateByOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
    options?: DeleteOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    models: Model[],
    options?: DeleteOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    options: DeleteByOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
    options?: ArchiveOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    models: Model[],
    options?: ArchiveOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    options: ArchiveByOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
    options?: UnarchiveOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    models: Model[],
    options?: UnarchiveOptions<Driver, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    options: UnarchiveByOptions<Driver, Entity>,
  ): Promise<void>
}
