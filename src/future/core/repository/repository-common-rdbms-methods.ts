import { AnyDataSource, UpdateResult } from "../data-source"
import { AnyEntity, EntityColumnPaths } from "../entity"
import { WhereOptions } from "../options"

/**
 * Interface for repositories that implement common RDBMS methods.
 */
export interface RepositoryCommonRdbmsMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
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
    where: WhereOptions<DataSource, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<DataSource>>

  /**
   * Decrements some column by provided value of the entities matched given conditions.
   */
  decrement(
    where: WhereOptions<DataSource, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<DataSource>>
}
