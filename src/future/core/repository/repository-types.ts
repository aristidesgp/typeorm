import { AnyDataSource } from "../data-source"
import { DriverEntities } from "../driver"
import { FindOptions, FindReturnType } from "../find-options"
import { ForceEmptyTypeIfUndefined } from "../util"

/**
 * A single repository managing a particular entity.
 */
export type CoreRepository = {
  "@type": "Repository"
}

/**
 *
 */
export interface CoreRepositoryWithFind<
  Source extends AnyDataSource,
  Entity extends DriverEntities<Source["driver"]>
> {
  find<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): FindReturnType<
    Source,
    Entity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  >
}

/**
 *
 */
export interface CoreRepositoryWithOptions<
  Source extends AnyDataSource,
  Entity extends DriverEntities<Source["driver"]>
> {
  options<
    FindEntity extends Entity,
    Options extends FindOptions<Source, Entity>
  >(
    options: Options,
  ): Options
}
