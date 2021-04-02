import { RemoveOptions } from "../../../repository/RemoveOptions"
import { SaveOptions } from "../../../repository/SaveOptions"
import { AnyDataSource } from "../data-source"
import {
  EntityDefaultColumnValueMap,
  EntityModelPartial,
  EntityPointer,
  EntityPrimaryColumnValueMap,
  EntityReference,
} from "../entity"
import { FindReturnType } from "../find-options"
import { SelectAll } from "../selection"

/**
 * Interface for managers that implement persistence / alteration operations.
 */
export interface ManagerPersistenceMethods<Source extends AnyDataSource> {
  /**
   * Saves one or many given entities in the database.
   * If entity does not exist in the database then inserts, otherwise updates.
   */
  save<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: SaveOptions,
  ): Promise<
    Model &
      FindReturnType<
        Source,
        Entity,
        SelectAll<
          EntityPrimaryColumnValueMap<Entity> &
            EntityDefaultColumnValueMap<Entity>
        >,
        false
      >
  >

  /**
   * Removes one or many given entities from the database.
   */
  remove<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: RemoveOptions,
  ): Promise<void>

  /**
   * Marks given one or many entities as "soft deleted".
   */
  softRemove<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: SaveOptions,
  ): Promise<void>

  /**
   * Recovers given one or many entities previously removed by "softRemove" operation.
   */
  recover<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
    options?: SaveOptions,
  ): Promise<void>
}
