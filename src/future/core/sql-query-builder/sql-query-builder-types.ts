import { Observable } from "zen-observable-ts"
import { AnyDriver } from "../driver"
import {
  AnyEntity,
  EntityFromReference,
  EntityModelPartial,
  EntityReference,
} from "../entity"

/**
 * Type of parameters being sent to sql and sqlFragment functions.
 */
export type SQLTemplateStringParameterTypes =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | boolean[]
  | object

/**
 * Type returned by `sql` and `sqlFragment` functions.
 */
export type SQLTemplate = {
  type: "sql" | "sqlFragment"
  strings: TemplateStringsArray
  parameters: SQLTemplateStringParameterTypes[]
}

/**
 * Helps to build SQL query.
 */
export type SqlQueryBuilderMapped<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  /**
   * Executes built SQL query and returns data returned by database.
   * T must be provided in order to identify what is the real data type of the returned data.
   */
  execute(): Promise<EntityModelPartial<Driver, Entity>>

  /**
   * Executes built query and streams returned data.
   */
  stream(): Observable<EntityModelPartial<Driver, Entity>>
}

/**
 * Helps to build SQL query.
 */
export interface SqlQueryBuilder<Driver extends AnyDriver> {
  /**
   * List of sql templates registered in query builder.
   */
  templates: SQLTemplate[]

  /**
   * Appends given SQL string to the query.
   */
  append(sql: this): this

  /**
   */
  mapTo<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entity: Reference,
  ): SqlQueryBuilderMapped<Driver, Entity>

  /**
   * Additional options applied to query.
   */
  options(options: {
    /**
     * Wraps query into transaction.
     */
    transaction?: boolean

    /**
     * Caches given query.
     */
    cache?: boolean
  }): this

  /**
   * Executes built SQL query and returns data returned by database.
   * T must be provided in order to identify what is the real data type of the returned data.
   */
  execute<T>(): Promise<T>

  /**
   * Executes built query and streams returned data.
   */
  stream<T>(): Observable<T>

  /**
   * Returns "outputted" sql.
   */
  getSql(): string
}

// queryRunner?: QueryRunner,
// - hydration
// - relations
// - cache
// - listeners
// - transaction
// - take / skip
// - getOneOrFail
// - stream -> observable?
