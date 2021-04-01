import { AnyDataSource, DataSourceEntity } from "../data-source"
import { EntityModelPartial, EntityPrimaryColumnValueMap } from "../entity"
import { FindReturnType } from "../find-options"
import { SelectAll } from "../selection"
import { UnionToIntersection } from "../util"

/**
 * Interface for repositories that implement basic entity methods supported by all drivers.
 */
export interface RepositoryBasicMethods<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Checks if entity has an id.
   * If entity has composite ids, it will check them all.
   */
  hasId(model: EntityModelPartial<Source, Entity>): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId<Model extends EntityModelPartial<Source, Entity>>(
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
  create<Model extends EntityModelPartial<Source, Entity>>(model: Model): Model

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge<Models extends EntityModelPartial<Source, Entity>[]>(
    ...models: Models
  ): UnionToIntersection<Models[number]>
}
