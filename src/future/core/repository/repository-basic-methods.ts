import { DriverTypes } from "../driver"
import {
  AnyEntityList,
  EntityModelPartial,
  EntityPrimaryColumnTypeMap,
} from "../entity"
import { UnionToIntersection, ValueOf } from "../util"

/**
 * Interface for repositories that implement basic entity methods supported by all drivers.
 */
export interface RepositoryBasicMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId(model: EntityModelPartial<Types, Entities, Entity>): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId<Model extends EntityModelPartial<Types, Entities, Entity>>(
    model: Model,
  ): EntityPrimaryColumnTypeMap<Types, Entities, Entity>

  /**
   * Creates a new entity instance.
   */
  create<Model extends EntityModelPartial<Types, Entities, Entity>>(
    model: Model,
  ): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<Models extends EntityModelPartial<Types, Entities, Entity>[]>(
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
