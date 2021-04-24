import { DriverTypes } from "../driver"
import { AnyEntity } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindReturnType,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { ForceCastIfUndefined } from "../util"

/**
 * Interface for managers that implement find* methods.
 */
export interface ManagerFindMethods<Types extends DriverTypes> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions<Entity extends AnyEntity>(
    entityRef: () => Entity,
  ): FindOptionsBuilder<Types, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Entity extends AnyEntity, Where extends WhereOptions<Types, Entity>>(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all">[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<
    Entity extends AnyEntity,
    Options extends FindOptionsMany<Types, Entity>
  >(
    entityRef: () => Entity,
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
  findOne<Entity extends AnyEntity, Where extends WhereOptions<Types, Entity>>(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all"> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entity>
  >(
    entityRef: () => Entity,
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
  findOneOrFail<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entity, {}, false, "all">>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entity>
  >(
    entityRef: () => Entity,
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
  findAndCount<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<[FindReturnType<Types, Entity, {}, false, "all">[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entity>
  >(
    entityRef: () => Entity,
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
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<Entity extends AnyEntity, Where extends WhereOptions<Types, Entity>>(
    entityRef: () => Entity,
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<
    Entity extends AnyEntity,
    Options extends FindOptionsCount<Types, Entity>
  >(
    entity: () => Entity,
    options: Options,
  ): Promise<number>
}
