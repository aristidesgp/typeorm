import { AnyDataSource } from "../data-source"
import {
  EntityModelPartial,
  EntityPointer,
  EntityPrimaryColumnValueMap,
  EntityReference,
} from "../entity"
import { FindReturnType } from "../find-options"
import { SelectAll } from "../selection"
import { UnionToIntersection } from "../util"

/**
 * Interface for managers that implement basic entity methods supported by all drivers.
 *
 * todo: check if we can implement proper typing for save(models), remove(models), etc.
 */
export interface ManagerBasicMethods<Source extends AnyDataSource> {
  /**
   * Checks if entity has an id.
   * If entity has composite ids, it will check them all.
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
   */
  getId<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: EntityModelPartial<Source, Entity>,
  ): FindReturnType<
    Source,
    Entity,
    SelectAll<EntityPrimaryColumnValueMap<Entity>>,
    false
  >

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Model extends EntityModelPartial<Source, Entity>
  >(
    entity: EntityRef,
    model: Model,
  ): FindReturnType<
    Source,
    Entity,
    SelectAll<EntityPrimaryColumnValueMap<Entity>>,
    false
  >

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
