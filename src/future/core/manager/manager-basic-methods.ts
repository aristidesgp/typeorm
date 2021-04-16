import { DriverTypes } from "../driver"
import {
  AnyEntityList,
  EntityModelPartial,
  EntityPointer,
  EntityPrimaryColumnTypeMap,
  EntityReference,
} from "../entity"
import { UnionToIntersection } from "../util"

/**
 * Interface for managers that implement basic entity methods supported by all drivers.
 *
 * todo: check if we can implement proper typing for save(models), remove(models), etc.
 */
export interface ManagerBasicMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    model: EntityModelPartial<Types, Entities, Entity>,
  ): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   * Returns null if entity doesn't have at least one of its ids.
   */
  getId<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
  ): EntityPrimaryColumnTypeMap<Types, Entities, Entity>

  /**
   * Creates a new entity instance.
   */
  create<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Model extends EntityModelPartial<Types, Entities, Entity>
  >(
    entity: EntityRef,
    model: Model,
  ): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Models extends EntityModelPartial<Types, Entities, Entity>[]
  >(
    entity: EntityRef,
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
