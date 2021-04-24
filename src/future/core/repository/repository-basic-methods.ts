import {
  AnyEntity,
  EntityModelPartial,
  EntityPrimaryColumnTypeMap,
} from "../entity"
import { UnionToIntersection } from "../util"

/**
 * Interface for repositories that implement basic entity methods supported by all drivers.
 */
export interface RepositoryBasicMethods<Entity extends AnyEntity> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId(model: EntityModelPartial<Entity>): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId<Model extends EntityModelPartial<Entity>>(
    model: Model,
  ): EntityPrimaryColumnTypeMap<Entity>

  /**
   * Creates a new entity instance.
   */
  create<Model extends EntityModelPartial<Entity>>(model: Model): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<Models extends EntityModelPartial<Entity>[]>(
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
