import { DriverTypes } from "../driver"
import { AnyEntity } from "../entity"
import {
  EntityModelAfterInsert,
  EntityModelForInsert,
} from "../entity/entity-insert"
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
} from "../options"

/**
 * Interface for repositories that implement persistence / alteration operations.
 */
export interface RepositoryPersistenceMethods<
  Types extends DriverTypes,
  Entity extends AnyEntity
> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<Model extends EntityModelForInsert<Types, Entity>>(
    model: Model,
    options?: InsertOptions<Types, Entity>,
  ): Promise<EntityModelAfterInsert<Types, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<Model extends EntityModelPartial<Types, Entity>>(
    models: Model[],
    options?: InsertOptions<Types, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Source, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<Model extends EntityModelPartial<Types, Entity>>(
    model: Model,
    options?: UpdateOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy(options: UpdateByOptions<Types, Entity>): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<Model extends EntityModelPartial<Types, Entity>>(
    model: Model,
    options?: DeleteOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<Model extends EntityModelPartial<Types, Entity>>(
    models: Model[],
    options?: DeleteOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy(options: DeleteByOptions<Types, Entity>): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<Model extends EntityModelPartial<Types, Entity>>(
    model: Model,
    options?: ArchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<Model extends EntityModelPartial<Types, Entity>>(
    models: Model[],
    options?: ArchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy(options: ArchiveByOptions<Types, Entity>): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Model extends EntityModelPartial<Types, Entity>>(
    model: Model,
    options?: UnarchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Model extends EntityModelPartial<Types, Entity>>(
    models: Model[],
    options?: UnarchiveOptions<Types, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy(options: UnarchiveByOptions<Types, Entity>): Promise<void>
}
