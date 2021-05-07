import { SelectQueryBuilder } from "../../../query-builder/SelectQueryBuilder"
import { QueryRunner } from "../../../query-runner/QueryRunner"
import {
  AnyDriver,
  IsolationLevels,
  QueryResult,
  UpdateResult,
} from "../driver"
import {
  AnyEntity,
  EntityColumnPaths,
  EntityFromReference,
  EntityReference,
} from "../entity"
import { WhereOptions } from "../options"

/**
 * Interface for managers that implement common RDBMS methods.
 */
export interface ManagerCommonRdbmsMethods<Driver extends AnyDriver> {
  /**
   * Creates a new query builder that can be used to build and execute any SQL query.
   */
  createQueryBuilder<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    alias?: string,
    queryRunner?: QueryRunner,
  ): SelectQueryBuilder<Entity>

  /**
   * Executes a raw SQL query and returns raw database results.
   */
  query(
    query: string,
    parameters?: any[],
  ): Promise<QueryResult<Driver["types"]>>

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   * All database operations must be executed using provided entity manager.
   */
  transaction<Result>(
    runInTransaction: (entityManager: this) => Promise<Result>,
  ): Promise<Result>

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   * All database operations must be executed using provided entity manager.
   */
  transaction<Result>(
    isolationLevel: IsolationLevels<Driver["types"]>,
    runInTransaction: (entityManager: this) => Promise<Result>,
  ): Promise<Result>

  /**
   * Clears all the data from the given table/collection (truncates/drops it).
   *
   * Note: on some drivers this method uses TRUNCATE and may not work as you expect in transactions.
   * @see https://stackoverflow.com/a/5972738/925151
   */
  clear<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
  ): Promise<void>

  /**
   * Increments some column by provided value of the entities matched given conditions.
   */
  increment<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    where: WhereOptions<Driver, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Driver["types"]>>

  /**
   * Decrements some column by provided value of the entities matched given conditions.
   */
  decrement<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
    where: WhereOptions<Driver, Entity>,
    columnPath: EntityColumnPaths<Entity>,
    value: number,
  ): Promise<UpdateResult<Driver["types"]>>
}
