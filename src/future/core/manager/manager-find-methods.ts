import { AnyDataSource } from "../data-source"
import { EntityFromReference, EntityReference } from "../entity"
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
export interface ManagerFindMethods<DataSource extends AnyDataSource> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>
  >(
    entityRef: Reference,
  ): FindOptionsBuilder<DataSource, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptionsMany<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<
    FindType<DataSource, Entity, Options["select"], Options["selectAndMap"]>[]
  >

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<FindType<
    DataSource,
    Entity,
    Options["select"],
    Options["selectAndMap"]
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<FindType<DataSource, Entity, undefined, undefined>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<
    FindType<DataSource, Entity, Options["select"], Options["selectAndMap"]>
  >

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    where: Where,
  ): Promise<[FindType<DataSource, Entity, undefined, undefined>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Options extends FindOptions<DataSource, Entity>
  >(
    entityRef: Reference,
    options: Options,
  ): Promise<
    [
      FindType<
        DataSource,
        Entity,
        Options["select"],
        Options["selectAndMap"]
      >[],
      number,
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<
    Reference extends EntityReference,
    Entity extends EntityFromReference<Reference>,
    Where extends WhereOptions<DataSource, Entity>
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
    Options extends FindOptionsCount<DataSource, Entity>
  >(
    entity: Reference,
    options: Options,
  ): Promise<number>
}
