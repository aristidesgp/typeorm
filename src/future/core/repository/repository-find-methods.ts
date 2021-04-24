import { DriverTypes } from "../driver"
import { AnyEntity } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindReturnType,
  WhereOperatorOptions,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { ForceCastIfUndefined } from "../util"

/**
 * Interface for repositories that implement find* methods.
 */
export interface RepositoryFindMethods<
  Types extends DriverTypes,
  Entity extends AnyEntity
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: FindOptionsBuilder<Types, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Where extends WhereOperatorOptions<Types, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all">[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<Options extends FindOptionsMany<Types, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Types,
      Entity,
      ForceCastIfUndefined<Options["select"], {}>,
      false,
      "all"
    >[]
  >

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<Where extends WhereOptions<Types, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all"> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<Options extends FindOptions<Types, Entity>>(
    options: Options,
  ): Promise<FindReturnType<
    Types,
    Entity,
    ForceCastIfUndefined<Options["select"], {}>,
    false,
    "all"
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Where extends WhereOptions<Types, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all">>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<Options extends FindOptions<Types, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Types,
      Entity,
      ForceCastIfUndefined<Options["select"], {}>,
      false,
      "all"
    >
  >

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<Where extends WhereOptions<Types, Entity>>(
    where: Where,
  ): Promise<[FindReturnType<Types, Entity, {}, false, "all">[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<Options extends FindOptions<Types, Entity>>(
    options: Options,
  ): Promise<
    [
      FindReturnType<
        Types,
        Entity,
        ForceCastIfUndefined<Options["select"], {}>,
        false,
        "all"
      >[],
      number,
      "all",
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<Where extends WhereOptions<Types, Entity>>(
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<Options extends FindOptionsCount<Types, Entity>>(
    options: Options,
  ): Promise<number>
}
