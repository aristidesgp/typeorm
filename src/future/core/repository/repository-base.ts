import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Base Repository interface for all driver Repository implementations.
 */
export interface RepositoryBase<Entity extends AnyEntity> {
  /**
   * Unique type identifier.
   */
  "@type": "Repository"

  /**
   * Data source of this repository.
   */
  dataSource: AnyDataSource // todo: CoreDataSource<Types, Collection>

  /**
   * Entity metadata of the entity managed by this repository.
   */
  metadata: EntityMetadata

  /**
   * Entity that is being managed by this repository.
   */
  entity: Entity
}
