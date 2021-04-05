import { AnyDataSource } from "../data-source"
import {
  EntityPointer,
  EntityPrimaryColumnMixedValueMap,
  EntityReference,
} from "../entity"
import {
  FindOptions,
  FindOptionsBuilder,
  FindOptionsMany,
  FindReturnType,
} from "../options/find-options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { ForceCast } from "../util"

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
   * Finds entities matching given find options.
   */
  find<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptionsMany<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[]
  >

  /**
   * Finds entities matching given ids.
   * Optionally find options can be applied.
   */
  findByIds<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptionsMany<Source, Entity>
  >(
    entityRef: EntityRef,
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[]
  >

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it returns null.
   */
  findOne<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<FindReturnType<
    Source,
    Entity,
    ForceCast<Options["select"], {}>,
    false
  > | null>

  /**
   * Finds first entity matching given find options.
   * If entity was not found in the database - it throws an Error.
   */
  findOneOrFail<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>
  >

  /**
   * Finds entity matching given entity id.
   * Optionally options can be applied.
   * If entity was not found in the database - it returns null.
   */
  findOneById<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
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
  findOneByIdOrFail<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    id: EntityPrimaryColumnMixedValueMap<Entity>,
    options?: Options,
  ): Promise<
    FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>
  >

  /**
   * Counts entities matching given find options.
   * Also counts all entities matching given conditions,
   * but ignores pagination settings ("skip" and "take" options).
   */
  findAndCount<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptions<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<
    [
      FindReturnType<Source, Entity, ForceCast<Options["select"], {}>, false>[],
      number,
    ]
  >

  /**
   * Counts entities matching given find options.
   */
  count<
    EntityRef extends EntityReference<Source>,
    Entity extends EntityPointer<Source, EntityRef>,
    Options extends FindOptionsCount<Source, Entity>
  >(
    entityRef: EntityRef,
    options: Options,
  ): Promise<number>
}
