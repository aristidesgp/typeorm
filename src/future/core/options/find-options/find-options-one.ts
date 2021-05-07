import { AnyDriver } from "../../driver"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"
import { FindOptionsCache } from "./find-options-cache"
import { FindOptionsOrder } from "./find-options-order"
import { FindOptionsSelect } from "./find-options-select"

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity // ValueOf<Entities>
> {
  /**
   * What data needs to be selected from the loaded entity.
   */
  select?: FindOptionsSelect<Entity>

  /**
   * Conditions applied to a query on what needs to be selected from the database.
   */
  where?: WhereOptions<Driver, Entity>

  /**
   * Order options applied to a query.
   */
  order?: FindOptionsOrder<Driver, Entity>

  /**
   * Indicates what locking mode should be used.
   */
  lock?: Driver["types"]["lockTypes"]

  /**
   * Whatever cache should be enabled for query or not.
   * This option allows to "cache" query to improve query performance.
   * If set to true - cache will be enabled and default options from data source will be used.
   * If set to number - cache will be enabled and given number of milliseconds will be used as cache expiration time.
   * Alternatively you can use advanced cache options.
   */
  cache?: boolean | number | FindOptionsCache

  /**
   * If this is set to true, query will be executed in a transaction.
   * By default `find` queries aren't wrapped into transaction.
   */
  transaction?: boolean

  /**
   * Indicates if soft-deleted rows should be included in the result.
   */
  withDeleted?: boolean
}
