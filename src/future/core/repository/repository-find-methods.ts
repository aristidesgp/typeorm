import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindType,
  WhereOperatorOptions,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"

/**
 * Interface for repositories that implement find* methods.
 */
export interface RepositoryFindMethods<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: FindOptionsBuilder<Driver, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Where extends WhereOperatorOptions<Driver, Entity>>(
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<Options extends FindOptionsMany<Driver, Entity>>(
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]>[]>

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<Where extends WhereOptions<Driver, Entity>>(
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<Options extends FindOptions<Driver, Entity>>(
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]> | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Where extends WhereOptions<Driver, Entity>>(
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<Options extends FindOptions<Driver, Entity>>(
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]>>

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<Where extends WhereOptions<Driver, Entity>>(
    where: Where,
  ): Promise<[FindType<Driver, Entity, undefined>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<Options extends FindOptions<Driver, Entity>>(
    options: Options,
  ): Promise<[FindType<Driver, Entity, Options["select"]>[], number]>

  /**
   * Counts entities matching given where criteria.
   */
  count<Where extends WhereOptions<Driver, Entity>>(
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<Options extends FindOptionsCount<Driver, Entity>>(
    options: Options,
  ): Promise<number>
}
