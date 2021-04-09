import { AnyDataSource } from "../data-source"
import { EntityPointer, EntityReference } from "../entity"
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
export interface ManagerFindMethods<Source extends AnyDataSource> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>
  >(
    entityRef: EntityRef,
  ): FindOptionsBuilder<Source, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Where extends WhereOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptionsMany<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
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
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Where extends WhereOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<FindReturnType<
    Source,
    Entity,
    ForceCastIfUndefined<Options["select"], {}>,
    false
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Where extends WhereOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
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
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Where extends WhereOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    where: Where,
  ): Promise<[FindReturnType<Source, Entity, {}, false>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    [
      FindReturnType<
        Source,
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
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Where extends WhereOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptionsCount<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<number>
}
