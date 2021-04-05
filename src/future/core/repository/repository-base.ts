import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { AnyDataSource, DataSourceEntity } from "../data-source"

/**
 * Base Repository interface for all driver Repository implementations.
 */
export interface RepositoryBase<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Unique type identifier.
   */
  "@type": "Repository"

  /**
   * Data source of this repository.
   */
  dataSource: Source

  /**
   * Entity metadata of the entity managed by this repository.
   */
  metadata: EntityMetadata

  /**
   * Entity that is being managed by this repository.
   */
  entity: Entity
}
