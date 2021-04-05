import { AnyDataSource, DataSourceEntity } from "../data-source"
import { EntityPrimaryColumnMixedValueMap } from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindReturnType,
  WhereOptions,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { ForceCast } from "../util"

/**
 * Interface for repositories that implement find* methods.
 */
export interface RepositoryFindMethods<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: FindOptionsBuilder<Source, Entity>

  /**
   * Finds entities by a given criteria.
   */
  find<Where extends WhereOptions<Source, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false>[]>

  /**
   * Finds entities by a given find options.
   */
  findBy<Options extends FindOptionsMany<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[]
  >

  /**
   * Finds entities matching given ids.
   * Optionally find options can be applied.
   */
  findByIds<Options extends FindOptionsMany<Source, Entity>>(
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[]
  >

  /**
   * Finds first entity by a given where criteria.
   * If entity was not found in the database - it returns null.
   */
  findOne<Where extends WhereOptions<Source, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false> | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOneBy<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<FindReturnType<
    Source,
    Entity,
    ForceCast<Options["select"], {}>,
    false
  > | null>

  /**
   * Finds first entity matching given where criteria.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<Where extends WhereOptions<Source, Entity>>(
    where: Where,
  ): Promise<FindReturnType<Source, Entity, {}, false>>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneByOrFail<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>
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
    ForceCast<Options["select"], {}>,
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
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>
  >

  /**
   * Counts entities matching given where criteria.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<Where extends WhereOptions<Source, Entity>>(
    where: Where,
  ): Promise<[FindReturnType<Source, Entity, {}, false>[], number]>

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCountBy<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    [
      FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[],
      number,
    ]
  >

  /**
   * Counts entities matching given where criteria.
   */
  count<Where extends WhereOptions<Source, Entity>>(
    where: Where,
  ): Promise<number>

  /**
   * Counts entities matching given count options.
   */
  countBy<Options extends FindOptionsCount<Source, Entity>>(
    options: Options,
  ): Promise<number>
}
