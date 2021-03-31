import { AnyDataSource, DataSourceEntity } from "../data-source"
import { EntityPrimaryColumnMixedValueMap } from "../entity"
import { FindOptions, FindOptionsMany, FindReturnType } from "../find-options"
import { FindOptionsCount } from "../find-options/find-options-count"
import { ForceEmptyTypeIfUndefined } from "../util"

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
