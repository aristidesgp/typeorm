import { AnyDriver } from "../driver"
import {
  AnyEntity,
  CreatedEntityModel,
  EntityCreateParams,
  MergedEntityModel,
  EntityModelPartial,
  EntityPrimaryColumnTypeMap,
} from "../entity"

/**
 * Interface for repositories that implement basic entity methods supported by all drivers.
 */
export interface RepositoryBasicMethods<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId(model: EntityModelPartial<Driver, Entity>): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId(
    model: EntityModelPartial<Driver, Entity>,
  ): EntityPrimaryColumnTypeMap<Driver, Entity>

  /**
   * Creates a new entity instance.
   */
  create<Model extends EntityCreateParams<Driver, Entity>>(
    model: Model,
  ): CreatedEntityModel<Driver, Entity, Model>

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<Models extends EntityCreateParams<Driver, Entity>[]>(
    ...models: Models
  ): MergedEntityModel<Driver, Entity, Models>
}
