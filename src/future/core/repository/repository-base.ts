import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { AnyDataSource } from "../data-source"
import { DriverTypes } from "../driver"
import { AnyEntityList } from "../entity"
import { ValueOf } from "../util"

/**
 * Base Repository interface for all driver Repository implementations.
 */
export interface RepositoryBase<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> {
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
