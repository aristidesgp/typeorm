import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"
import { FindOptionsCache } from "./find-options-cache"

/**
 * Defines a special criteria to find specific entity.
 */
export type FindOptionsCount<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  /**
   * Conditions applied to a query on what needs to be selected from the database.
   */
  where?: WhereOptions<DataSource, Entity>

  /**
   * Whatever cache should be enabled for query or not.
   * This option allows to "cache" query to improve query performance.
   * If set to true - cache will be enabled and default options from data source will be used.
   * If set to number - cache will be enabled and given number of milliseconds will be used as cache expiration time.
   * Alternatively you can use advanced cache options.
   */
  cache?: boolean | number | FindOptionsCache

  /**
   * Indicates if soft-deleted rows should be included in the count.
   */
  withDeleted?: boolean
} & DataSource["types"]["findOptions"]
