import { Observable } from "zen-observable-ts"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"
import {
  FindOptions,
  FindOptionsMany,
  FindType,
  WhereConditions,
  WhereOptions,
  FindOptionsCount,
} from "../options"

/**
 * Interface for repositories that implement observe* methods.
 */
export interface RepositoryObserveMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Observes entities by a given where criteria.
   */
  observe<Where extends WhereConditions<DataSource, Entity>>(
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined>[]>

  /**
   * Observes entities by a given options.
   */
  observeBy<Options extends FindOptionsMany<DataSource, Entity>>(
    options: Options,
  ): Observable<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>[]
  >

  /**
   * Observes first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  observeOne<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined> | null>

  /**
   * Observes first entity matching given options.
   * If entity was not found in the database - it returns null.
   */
  observeOneBy<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Observable<FindType<
    DataSource,
    Entity,
    Options["select"],
    Options["virtuals"]
  > | null>

  /**
   * Observes first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  observeOneOrFail<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined>>

  /**
   * Observes first entity matching given observe options.
   * If entity was not found in the database - it throws an Error.
   */
  observeOneByOrFail<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Observable<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>
  >

  /**
   * Creates an observer listening to entities count matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  observeAndCount<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Observable<[FindType<DataSource, Entity, undefined, undefined>[], number]>

  /**
   * Creates an observer listening to entities count matching given observe options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  observeAndCountBy<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Observable<
    [
      FindType<DataSource, Entity, Options["select"], Options["virtuals"]>[],
      number,
    ]
  >

  /**
   * Creates an observer listening to entities count matching given where criteria.
   */
  observeCount<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Observable<number>

  /**
   * Creates an observer listening to entities count matching given count options.
   */
  observeCountBy<Options extends FindOptionsCount<DataSource, Entity>>(
    options: Options,
  ): Observable<number>
}
