import { AnyDriver } from "../driver"
import {
  EntityFromReference,
  EntityModelCreateType,
  EntityModelForCreate,
  EntityModelPartial,
  EntityPrimaryColumnTypeMap,
  EntityReference,
} from "../entity"
import { UnionToIntersection } from "../util"

/**
 * Interface for managers that implement basic entity methods supported by all drivers.
 *
 * todo: check if we can implement proper typing for save(models), remove(models), etc.
 */
export interface ManagerBasicMethods<Driver extends AnyDriver> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    model: EntityModelPartial<Driver, Entity>,
  ): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   * Returns null if entity doesn't have at least one of its ids.
   */
  getId<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelPartial<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
  ): EntityPrimaryColumnTypeMap<Driver, Entity>

  /**
   * Creates a new entity instance.
   */
  create<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Model extends EntityModelForCreate<Driver, Entity>
  >(
    entity: Reference,
    model: Model,
  ): EntityModelCreateType<Driver, Entity, Model>

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Models extends EntityModelForCreate<Driver, Entity>[]
  >(
    entity: Reference,
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
