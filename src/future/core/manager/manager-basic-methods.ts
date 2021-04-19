import { DriverTypes } from "../driver"
import {
  AnyEntity,
  EntityModelPartial,
  EntityPrimaryColumnTypeMap,
} from "../entity"
import { UnionToIntersection } from "../util"

/**
 * Interface for managers that implement basic entity methods supported by all drivers.
 *
 * todo: check if we can implement proper typing for save(models), remove(models), etc.
 */
export interface ManagerBasicMethods<Types extends DriverTypes> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId<Entity extends AnyEntity>(
    entity: () => Entity,
    model: EntityModelPartial<Types, Entity>,
  ): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   * Returns null if entity doesn't have at least one of its ids.
   */
  getId<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
  ): EntityPrimaryColumnTypeMap<Types, Entity>

  /**
   * Creates a new entity instance.
   */
  create<
    Entity extends AnyEntity,
    Model extends EntityModelPartial<Types, Entity>
  >(
    entity: () => Entity,
    model: Model,
  ): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<
    Entity extends AnyEntity,
    Models extends EntityModelPartial<Types, Entity>[]
  >(
    entity: () => Entity,
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
