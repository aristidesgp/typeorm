import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Base Repository interface for all driver Repository implementations.
 */
export interface RepositoryBase<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Unique type identifier.
   */
  "@type": "Repository"

  /**
   * Data source of this repository.
   */
  dataSource: DataSource

  /**
   * Entity metadata of the entity managed by this repository.
   */
  metadata: EntityMetadata

  /**
   * Entity that is being managed by this repository.
   */
  entity: Entity
}
