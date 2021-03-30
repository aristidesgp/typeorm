import { AnyDataSource, DataSourceEntity } from "../data-source"
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
  Entity extends DataSourceEntity<Source>
> {
  find<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >
  >
}

/**
 *
 */
export interface CoreRepositoryWithOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  options<
    FindEntity extends Entity,
    Options extends FindOptions<Source, Entity>
  >(
    options: Options,
  ): Options
}
