import { AnyDataSource, DataSourceEntity } from "../../data-source"
import { FindOptionsCache } from "./find-options-cache"
import { FindOptionsOrder } from "./find-options-order"
import { FindOptionsSelect } from "./find-options-select"
import { WhereOptions } from "../where-options"

/**
 * Defines a special criteria to find specific entity.
 */
export interface FindOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * What data needs to be selected from the loaded entity.
   */
  select?: FindOptionsSelect<Source, Entity>

  /**
   * Conditions applied to a query on what needs to be selected from the database.
   */
  where?: WhereOptions<Source, Entity>

  /**
   * Order options applied to a query.
   */
  order?: FindOptionsOrder<Source, Entity>

  /**
   * Indicates what locking mode should be used.
   */
  lock?: Source["driver"]["types"]["lock"]

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
