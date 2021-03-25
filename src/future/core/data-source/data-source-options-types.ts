import { DriverType } from "../driver"
import { EntityList } from "../entity"

export type AnyDataSourceOptions = DataSourceOptions<DriverType, EntityList>

export type DataSourceOptions<
  ScopeDriverType extends DriverType,
  Entities extends EntityList
> = {
  /**
   * Driver type, e.g. postgres, mysql, sqlite, etc.
   *
   * @see DriverType
   */
  type: ScopeDriverType

  /**
   * List of entities to be used in this data source.
   */
  entities: Entities

  // subscribers
  // namingStrategy
  // logger
  // synchronize
  // entityPrefix
  // cache
}
