import { AnyDataSource } from "../data-source"
import {
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
export interface ManagerBasicMethods<Source extends AnyDataSource> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entity: EntityRef,
    model: EntityModelPartial<Source, Entity>,
  ): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   * Returns null if entity doesn't have at least one of its ids.
   */
  getId<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
  ): EntityPrimaryColumnTypeMap<Entity>

  /**
   * Creates a new entity instance.
   */
  create<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
  ): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Models extends EntityModelPartial<Source, Entity>[]
  >(
    entity: EntityRef,
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
