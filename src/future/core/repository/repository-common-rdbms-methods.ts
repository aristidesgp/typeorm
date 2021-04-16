import { SelectQueryBuilder } from "../../../query-builder/SelectQueryBuilder"
import { QueryRunner } from "../../../query-runner/QueryRunner"
import { DriverTypes, QueryResult, UpdateResult } from "../driver"
import { AnyEntityList, EntityColumnPaths } from "../entity"
import { WhereOptions } from "../options"
import { ValueOf } from "../util"

/**
 * Interface for repositories that implement common RDBMS methods.
 */
export interface RepositoryCommonRdbmsMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> {
  /**
   * Creates a new query builder that can be used to build and execute any SQL query.
   */
  createQueryBuilder(
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity>

  /**
   * Executes a raw SQL query and returns raw database results.
   */
  query(query: string, parameters?: any[]): Promise<QueryResult<Types>>

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
    where: WhereOptions<Types, Entities, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Types>>

  /**
   * Decrements some column by provided value of the entities matched given conditions.
   */
  decrement(
    where: WhereOptions<Types, Entities, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Types>>
}
