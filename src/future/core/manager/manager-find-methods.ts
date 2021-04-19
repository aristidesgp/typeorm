import { DriverTypes } from "../driver"
import {
  AnyEntity,
  AnyEntityList,
  EntityPointer,
  EntityReference,
} from "../entity"
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
export interface ManagerFindMethods<
  Types extends DriverTypes,
  Entities extends AnyEntityList
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions<Entity extends AnyEntity>(
    entityRef: () => Entity,
  ): FindOptionsBuilder<Types, Entities, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entities, Entity, {}, false>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<
    Entity extends AnyEntity,
    Options extends FindOptionsMany<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    options: Options,
  ): Promise<
    FindReturnType<
      Types,
      Entities,
      Entity,
      ForceCastIfUndefined<Options["select"], {}>,
      false
    >[]
  >

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entities, Entity, {}, false> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    options: Options,
  ): Promise<FindReturnType<
    Types,
    Entities,
    Entity,
    ForceCastIfUndefined<Options["select"], {}>,
    false
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<FindReturnType<Types, Entities, Entity, {}, false>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    options: Options,
  ): Promise<
    FindReturnType<
      Types,
      Entities,
      Entity,
      ForceCastIfUndefined<Options["select"], {}>,
      false
    >
  >

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<[FindReturnType<Types, Entities, Entity, {}, false>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<
    Entity extends AnyEntity,
    Options extends FindOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    options: Options,
  ): Promise<
    [
      FindReturnType<
        Types,
        Entities,
        Entity,
        ForceCastIfUndefined<Options["select"], {}>,
        false
      >[],
      number,
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<
    Entity extends AnyEntity,
    Where extends WhereOptions<Types, Entities, Entity>
  >(
    entityRef: () => Entity,
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>,
    Options extends FindOptionsCount<Types, Entities, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<number>
}
