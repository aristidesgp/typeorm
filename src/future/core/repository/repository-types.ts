import { AnyDataSource, DataSourceEntity } from "../data-source"
import { EntityPrimaryColumnMixedValueMap } from "../entity"
import {
  FindOptions,
  FindOptionsMany,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
  FindReturnType,
} from "../find-options"
import { FindOptionsCount } from "../find-options/find-options-count"
import { ForceEmptyTypeIfUndefined } from "../util"

/**
 * Core Repository interface.
 */
export interface CoreRepository {
  "@type": "Repository"
}

/**
 * Interface for repositories that implement find* methods.
 */
export interface CoreRepositoryWithFind<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Finds entities matching given find options.
   */
  find<Options extends FindOptionsMany<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >[]
  >

  /**
   * Finds entities matching given ids.
   * Optionally options can be applied.
   */
  findByIds<Options extends FindOptionsMany<Source, Entity>>(
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >[]
  >

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOne<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<FindReturnType<
    Source,
    Entity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  > | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >
  >

  /**
   * Finds entity matching given entity id.
   * Optionally options can be applied.
   * If entity was not found in the database - it returns null.
   */
  findOneById<Options extends FindOptions<Source, Entity>>(
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<FindReturnType<
    Source,
    Entity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  > | null>

  /**
   * Finds entity matching given entity id.
   * Optionally options can be applied.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByIdOrFail<Options extends FindOptions<Source, Entity>>(
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >
  >

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    [
      FindReturnType<
        Source,
        Entity,
        ForceEmptyTypeIfUndefined<Options["select"]>,
        false
      >[],
      number,
    ]
  >

  /**
   * Counts entities matching given find options.
   */
  count<Options extends FindOptionsCount<Source, Entity>>(
    options: Options,
  ): Promise<number>
}

/**
 * Interface for repositories that implement "findOptions" method.
 * "findOptions" method allows to build FindOptions object easily.
 */
export interface CoreRepositoryWithOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  findOptions: CoreRepositoryOptionsType<Source, Entity>
}

/**
 * Function that produces FindOptions
 */
export type CoreRepositoryOptionsType<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  /**
   * Creates a FindOptionsMany object.
   */
  <Options extends FindOptionsMany<Source, Entity>>(options: Options): Options

  /**
   * Creates a FindOptionsSelect object.
   */
  select<Select extends FindOptionsSelect<Source, Entity>>(
    select: Select,
  ): Select

  /**
   * Creates a FindOptionsWhere object.
   */
  where<Where extends FindOptionsWhere<Source, Entity>>(where: Where): Where

  /**
   * Creates a FindOptionsOrder object.
   */
  order<Order extends FindOptionsOrder<Source, Entity>>(order: Order): Order
}
