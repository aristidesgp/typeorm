import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { OrderOptions } from "../order-options"
import { FindOptionVirtuals, SelectOptions } from "../select-options"
import { WhereOptions } from "../where-options"
import { FindOptionsCache } from "./find-options-cache"

/**
 * Defines a special criteria to find specific entity.
 */
export type FindOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  /**
   * "Virtuals" needs to be added to the loaded entity.
   */
  virtuals?: FindOptionVirtuals<DataSource, Entity>

  /**
   * What properties and relations needs to be selected from the loading entities.
   */
  select?: SelectOptions<Entity>

  /**
   * Conditions applied to a query on what needs to be selected from the database.
   */
  where?: WhereOptions<DataSource, Entity>

  /**
   * Order options applied to a query.
   */
  order?: OrderOptions<DataSource, Entity>

  /**
   * Indicates if archived (soft-deleted) entities should be included in the result.
   */
  archived?: boolean

  /**
   * Whatever cache should be enabled for query or not.
   * This option allows to "cache" query to improve query performance.
   * If set to true - cache will be enabled and default options from data source will be used.
   * If set to number - cache will be enabled and given number of milliseconds will be used as cache expiration time.
   * Alternatively you can use advanced cache options.
   */
  cache?: boolean | number | FindOptionsCache
} & DataSource["@types"]["findOptions"]
