import { AnyDriver, DriverEntities } from "../driver"
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
  Driver extends AnyDriver,
  Entity extends DriverEntities<Driver>
> {
  find<Options extends FindOptions<Driver, Entity>>(
    options: Options,
  ): FindReturnType<
    Driver,
    Entity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  >
}

/**
 *
 */
export interface CoreRepositoryWithOptions<
  Driver extends AnyDriver,
  Entity extends DriverEntities<Driver>
> {
  options<
    FindEntity extends Entity,
    Options extends FindOptions<Driver, Entity>
  >(
    options: Options,
  ): Options
}
