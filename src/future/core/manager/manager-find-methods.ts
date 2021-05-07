import { AnyDriver } from "../driver"
import { AnyEntity, EntityFromReference, EntityReference } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindType,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"

/**
 * Interface for managers that implement find* methods.
 */
export interface ManagerFindMethods<Driver extends AnyDriver> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entityRef: Reference,
  ): FindOptionsBuilder<Driver, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<Driver, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptionsMany<Driver, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]>[]>

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<Driver, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<Driver, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]> | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<Driver, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<Driver, Entity, undefined>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<Driver, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<FindType<Driver, Entity, Options["select"]>>

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<Driver, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<[FindType<Driver, Entity, undefined>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<Driver, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<[FindType<Driver, Entity, Options["select"]>[], number]>

  /**
   * Counts entities matching given where criteria.
   */
  count<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<Driver, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptionsCount<Driver, Entity>
  >(
    entity: Reference,
    options: Options,
  ): Promise<number>
}
