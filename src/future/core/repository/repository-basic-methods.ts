import { DeepPartial } from "../../../common/DeepPartial"
import { AnyDataSource, DataSourceEntity } from "../data-source"
import { EntityPrimaryColumnMixedValueMap } from "../entity"

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
  hasId(entity: Entity): boolean

  /**
   * Gets entity id.
   * Returns *mixed* id - if entity contains multiple primary ids - object will be returned,
   * if entity contains a single primary id - directly value will be returned.
   */
  getId(entity: Entity): EntityPrimaryColumnMixedValueMap<Entity>

  /**
   * Creates a new entity instance.
   *
   * todo: must accept partial and return that partial?
   */
  create(): Entity

  /**
   * Creates new entities and copies all entity properties from given objects into their new entities.
   * Note that it copies only properties that are present in entity schema.
   */
  create(entityLikeArray: DeepPartial<Entity>[]): Entity[]

  /**
   * Creates a new entity instance and copies all entity properties from this object into a new entity.
   * Note that it copies only properties that are present in entity schema.
   */
  create(entityLike: DeepPartial<Entity>): Entity

  /**
   * Merges multiple entities (or entity-like objects) into a given entity.
   */
  merge(mergeIntoEntity: Entity, ...entityLikes: DeepPartial<Entity>[]): Entity
}
