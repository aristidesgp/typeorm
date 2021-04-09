import { AnyDataSource, DataSourceEntity } from "../data-source"
import {
  EntityModelForInsert,
  EntityModelJustInserted,
  EntityModelPartial,
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
} from "../options"

/**
 * Interface for repositories that implement persistence / alteration operations.
 */
export interface RepositoryPersistenceMethods<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<Model extends EntityModelForInsert<Source, Entity>>(
    model: Model,
    options?: InsertOptions<Source, Entity>,
  ): Promise<EntityModelJustInserted<Source, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<Model extends EntityModelPartial<Source, Entity>>(
    models: Model[],
    options?: InsertOptions<Source, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Source, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<Model extends EntityModelPartial<Source, Entity>>(
    model: Model,
    options?: UpdateOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy(options: UpdateByOptions<Source, Entity>): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<Model extends EntityModelPartial<Source, Entity>>(
    model: Model,
    options?: DeleteOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<Model extends EntityModelPartial<Source, Entity>>(
    models: Model[],
    options?: DeleteOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy(options: DeleteByOptions<Source, Entity>): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<Model extends EntityModelPartial<Source, Entity>>(
    model: Model,
    options?: ArchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<Model extends EntityModelPartial<Source, Entity>>(
    models: Model[],
    options?: ArchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy(options: ArchiveByOptions<Source, Entity>): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Model extends EntityModelPartial<Source, Entity>>(
    model: Model,
    options?: UnarchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Model extends EntityModelPartial<Source, Entity>>(
    models: Model[],
    options?: UnarchiveOptions<Source, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy(options: UnarchiveByOptions<Source, Entity>): Promise<void>
}
