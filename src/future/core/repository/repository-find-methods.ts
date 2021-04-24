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
export interface RepositoryFindMethods<Entity extends AnyEntity> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: FindOptionsBuilder<Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Where extends WhereOperatorOptions<Entity>>(
    where: Where,
  ): Promise<FindReturnType<Entity, {}, false, "all">[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<Options extends FindOptionsMany<Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
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
  findOne<Where extends WhereOptions<Entity>>(
    where: Where,
  ): Promise<FindReturnType<Entity, {}, false, "all"> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<Options extends FindOptions<Entity>>(
    options: Options,
  ): Promise<FindReturnType<
    Entity,
    ForceCastIfUndefined<Options["select"], {}>,
    false,
    "all"
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Where extends WhereOptions<Entity>>(
    where: Where,
  ): Promise<FindReturnType<Entity, {}, false, "all">>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<Options extends FindOptions<Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
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
  findAndCount<Where extends WhereOptions<Entity>>(
    where: Where,
  ): Promise<[FindReturnType<Entity, {}, false, "all">[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<Options extends FindOptions<Entity>>(
    options: Options,
  ): Promise<
    [
      FindReturnType<
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
  count<Where extends WhereOptions<Entity>>(where: Where): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<Options extends FindOptionsCount<Entity>>(
    options: Options,
  ): Promise<number>
}
