import { AnyDataSource } from "../data-source"
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
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Checks if entity has an id.
   * If entity has multiple ids, it will check them all.
   */
  hasId(model: EntityModelPartial<DataSource, Entity>): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId(
    model: EntityModelPartial<DataSource, Entity>,
  ): EntityPrimaryColumnTypeMap<DataSource, Entity>

  /**
   * Creates a new entity instance.
   */
  create<Model extends EntityCreateParams<DataSource, Entity>>(
    model: Model,
  ): CreatedEntityModel<DataSource, Entity, Model>

  /**
   * Merges multiple entities (or entity-like objects) into a new entity.
   */
  merge<Models extends EntityCreateParams<DataSource, Entity>[]>(
    ...models: Models
  ): MergedEntityModel<DataSource, Entity, Models>
}
