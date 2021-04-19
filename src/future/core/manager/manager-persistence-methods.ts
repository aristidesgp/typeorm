import { DriverTypes } from "../driver"
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
export interface ManagerPersistenceMethods<Types extends DriverTypes> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
    options?: InsertOptions<Types, Entity>,
  ): Promise<EntityModelAfterInsert<Types, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    models: Model[],
    options?: InsertOptions<Types, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Types, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
    options?: UpdateOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: UpdateByOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
    options?: DeleteOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    models: Model[],
    options?: DeleteOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: DeleteByOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
    options?: ArchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    models: Model[],
    options?: ArchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: ArchiveByOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
    options?: UnarchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    models: Model[],
    options?: UnarchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy<Entity extends AnyEntity>(
    entity: () => Entity,
    options: UnarchiveByOptions<Types, Entity>,
  ): Promise<void>
}
