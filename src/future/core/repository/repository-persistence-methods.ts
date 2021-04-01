import { DeepPartial } from "../../../common/DeepPartial"
import { RemoveOptions } from "../../../repository/RemoveOptions"
import { SaveOptions } from "../../../repository/SaveOptions"
import { AnyDataSource, DataSourceEntity } from "../data-source"

/**
 * Interface for repositories that implement persistence / alteration operations.
 */
export interface RepositoryPersistenceMethods<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Saves one or many given entities in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options?: SaveOptions,
  ): Promise<T | T[]>

  /**
   * Removes one or many given entities from the database.
   */
  remove(
    entityOrEntities: Entity | Entity[],
    options?: RemoveOptions,
  ): Promise<Entity | Entity[]>

  /**
   * Marks given one or many entities as "soft deleted".
   */
  softRemove<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<void>

  /**
   * Recovers given one or many entities previously removed by "softRemove" operation.
   */
  recover<T extends DeepPartial<Entity>>(
    entities: T | T[],
    options?: SaveOptions,
  ): Promise<void>
}
