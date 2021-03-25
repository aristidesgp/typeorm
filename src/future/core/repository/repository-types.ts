import { AnyDataSource, DataSourceEntities } from "../data-source"
import { FindOptions, FindReturnType } from "../find-options"
import { ForceEmptyTypeIfUndefined } from "../util"

/**
 * List of all repositories registered in the app.
 */
export type RepositoryList<Source extends AnyDataSource> = {
  [P in keyof Source["options"]["entities"]]: Repository<
    Source,
    Source["options"]["entities"][P]
  >
}

/**
 * A single repository managing a particular entity.
 */
export type Repository<
  Source extends AnyDataSource,
  Entity extends DataSourceEntities<Source>
> = {
  find<
    FindEntity extends Entity,
    Options extends FindOptions<Source, FindEntity>
  >(
    options: Options,
  ): FindReturnType<
    Source,
    FindEntity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  >

  options<
    FindEntity extends Entity,
    Options extends FindOptions<Source, Entity>
  >(
    options: Options,
  ): Options
}
