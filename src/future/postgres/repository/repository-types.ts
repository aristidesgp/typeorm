import {
  AnyDriver,
  DriverEntities,
  FindOptions,
  FindReturnType,
  ForceEmptyTypeIfUndefined,
} from "../../core"

/**
 * A single repository managing a particular entity.
 */
export type PostgresRepository<
  Driver extends AnyDriver,
  Entity extends DriverEntities<Driver>
> = {
  find<
    FindEntity extends Entity,
    Options extends FindOptions<Driver, FindEntity>
  >(
    options: Options,
  ): FindReturnType<
    Driver,
    FindEntity,
    ForceEmptyTypeIfUndefined<Options["select"]>,
    false
  >

  options<
    FindEntity extends Entity,
    Options extends FindOptions<Driver, Entity>
  >(
    options: Options,
  ): Options
}
