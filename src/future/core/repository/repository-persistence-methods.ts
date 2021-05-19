import { AnyDataSource } from "../data-source"
import {
  AnyEntity,
  InsertedEntityModel,
  EntityInsertParams,
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
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Inserts a new entity into the database.
   * Database error will be thrown if entity already exists in the database.
   * Returns a copy of the model with the default / primary column values.
   */
  insert<Model extends EntityInsertParams<DataSource, Entity>>(
    model: Model,
    options?: InsertOptions<DataSource, Entity>,
  ): Promise<InsertedEntityModel<DataSource, Entity, Model>>

  /**
   * Inserts entities in bulk.
   * Database error will be thrown if any of entity exist in the database.
   */
  insert<Model extends EntityInsertParams<DataSource, Entity>>(
    models: Model[],
    options?: InsertOptions<DataSource, Entity>,
  ): Promise<void> // [...EntityModelJustInserted<Source, Entity, Model>[]]

  /**
   * Updates entity in the database.
   * If entity does not exist in the database - error will be thrown.
   */
  update<Model extends EntityModelPartial<DataSource, Entity>>(
    model: Model,
    options?: UpdateOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Updates entities in the database by a given options.
   * If entity does not exist in the database - error will be thrown.
   */
  updateBy(options: UpdateByOptions<DataSource, Entity>): Promise<void>

  /**
   * Removes a given entity from the database.
   */
  delete<Model extends EntityModelPartial<DataSource, Entity>>(
    model: Model,
    options?: DeleteOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Removes given entities from the database.
   */
  delete<Model extends EntityModelPartial<DataSource, Entity>>(
    models: Model[],
    options?: DeleteOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Removes entities by a given options.
   */
  deleteBy(options: DeleteByOptions<DataSource, Entity>): Promise<void>

  /**
   * Marks given entity as "soft deleted".
   */
  archive<Model extends EntityModelPartial<DataSource, Entity>>(
    model: Model,
    options?: ArchiveOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted".
   */
  archive<Model extends EntityModelPartial<DataSource, Entity>>(
    models: Model[],
    options?: ArchiveOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Marks given entities as "soft deleted" by a given options.
   */
  archiveBy(options: ArchiveByOptions<DataSource, Entity>): Promise<void>

  /**
   * Unarchives given entity previously archived (e.g. restore "soft-removed" entity).
   */
  unarchive<Model extends EntityModelPartial<DataSource, Entity>>(
    model: Model,
    options?: UnarchiveOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities previously archived (e.g. restore "soft-removed" entities).
   */
  unarchive<Model extends EntityModelPartial<DataSource, Entity>>(
    models: Model[],
    options?: UnarchiveOptions<DataSource, Entity>,
  ): Promise<void>

  /**
   * Unarchives given entities by a given options.
   */
  unarchiveBy(options: UnarchiveByOptions<DataSource, Entity>): Promise<void>
}
