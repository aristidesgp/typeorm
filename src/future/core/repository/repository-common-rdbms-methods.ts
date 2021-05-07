import { SelectQueryBuilder } from "../../../query-builder/SelectQueryBuilder"
import { QueryRunner } from "../../../query-runner/QueryRunner"
import { AnyDriver, QueryResult, UpdateResult } from "../driver"
import { AnyEntity, EntityColumnPaths } from "../entity"
import { WhereOptions } from "../options"

/**
 * Interface for repositories that implement common RDBMS methods.
 */
export interface RepositoryCommonRdbmsMethods<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> {
  /**
   * Creates a new query builder that can be used to build and execute any SQL query.
   *
   * todo: this probably will be removed since current implementation of the query-builder will be an extension
   */
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity>

  /**
   * Executes a raw SQL query and returns raw database results.
   */
  query(query: string, parameters?: any[]): Promise<QueryResult<Driver>>

  /**
   * Clears all the data from the given table/collection (truncates/drops it).
   *
   * Note: on some drivers this method uses TRUNCATE and may not work as you expect in transactions.
   * @see https://stackoverflow.com/a/5972738/925151
   */
  clear(): Promise<void>

  /**
   * Increments some column by provided value of the entities matched given conditions.
   */
  increment(
    where: WhereOptions<Driver, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Driver>>

  /**
   * Decrements some column by provided value of the entities matched given conditions.
   */
  decrement(
    where: WhereOptions<Driver, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Driver>>
}
