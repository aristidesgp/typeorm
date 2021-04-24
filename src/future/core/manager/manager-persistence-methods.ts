import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity/entity-core"
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
  insert<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    model: Model,
    options?: InsertOptions<Entity>,
  ): Promise<EntityModelAfterInsert<Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    models: Model[],
    options?: InsertOptions<Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    model: Model,
    options?: UpdateOptions<Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: UpdateByOptions<Entity>,
  ): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    model: Model,
    options?: DeleteOptions<Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    models: Model[],
    options?: DeleteOptions<Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: DeleteByOptions<Entity>,
  ): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    model: Model,
    options?: ArchiveOptions<Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    models: Model[],
    options?: ArchiveOptions<Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: ArchiveByOptions<Entity>,
  ): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    model: Model,
    options?: UnarchiveOptions<Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Entity extends AnyEntity, Model extends EntityModelPartial<Entity>>(
    entity: () => Entity,
    models: Model[],
    options?: UnarchiveOptions<Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: UnarchiveByOptions<Entity>,
  ): Promise<void>
}
