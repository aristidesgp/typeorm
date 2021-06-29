import { Observable } from "zen-observable-ts"
import { AnyDataSource } from "../data-source"
import { EntityFromReference, EntityReference } from "../entity"
import {
  FindOptions,
  FindOptionsMany,
  FindOptionsCount,
  FindType,
  WhereOptions,
} from "../options"

/**
 * Interface for managers that implement observe* methods.
 */
export interface ManagerObserveMethods<DataSource extends AnyDataSource> {
  /**
   * Observes entities by a given where criteria.
   */
  observe<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined>[]>

  /**
   * Observes entities by a given find options.
   */
  observeBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptionsMany<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Observable<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>[]
  >

  /**
   * Observes first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  observeOne<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined> | null>

  /**
   * Observes first entity matching given observe options.
   * If entity was not found in the database - it returns null.
   */
  observeOneBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
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
  observeOneOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Observable<FindType<DataSource, Entity, undefined, undefined>>

  /**
   * Observes first entity matching given observe options.
   * If entity was not found in the database - it throws an Error.
   */
  observeOneByOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Observable<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>
  >

  /**
   * Creates an observer listening to entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  observeAndCount<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Observable<[FindType<DataSource, Entity, undefined, undefined>[], number]>

  /**
   * Creates an observer listening to entities matching given observe options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  observeAndCountBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
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
  observeCount<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Observable<number>

  /**
   * Creates an observer listening to entities count matching given count options.
   */
  observeCountBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptionsCount<DataSource, Entity>
  >(
    entity: Reference,
    options: Options,
  ): Observable<number>
}
