// import { AnyDataSource, DriverEntities } from "../data-source"
// import { FindOptions, FindReturnType } from "../find-options"
// import { ForceEmptyTypeIfUndefined } from "../util"

/**
 * A single repository managing a particular entity.
 */
export type CoreRepository = {}
/*<
  Source extends AnyDataSource,
  Entity extends DriverEntities<Source>
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
}*/
