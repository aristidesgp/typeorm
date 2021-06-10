import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindType,
  WhereConditions,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"

/**
 * Interface for repositories that implement find* methods.
 */
export interface RepositoryFindMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: FindOptionsBuilder<DataSource, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Where extends WhereConditions<DataSource, Entity>>(
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<Options extends FindOptionsMany<DataSource, Entity>>(
    options: Options,
  ): Promise<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>[]
  >

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Promise<FindType<
    DataSource,
    Entity,
    Options["select"],
    Options["virtuals"]
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Promise<
    FindType<DataSource, Entity, Options["select"], Options["virtuals"]>
  >

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Promise<[FindType<DataSource, Entity, undefined, undefined>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<Options extends FindOptions<DataSource, Entity>>(
    options: Options,
  ): Promise<
    [
      FindType<DataSource, Entity, Options["select"], Options["virtuals"]>[],
      number,
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<Where extends WhereOptions<DataSource, Entity>>(
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<Options extends FindOptionsCount<DataSource, Entity>>(
    options: Options,
  ): Promise<number>
}
