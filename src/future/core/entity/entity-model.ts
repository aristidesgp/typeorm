import { DeepPartial } from "../../../common/DeepPartial"
import { AnyDataSource } from "../data-source"
import { FindReturnType } from "../options"
import { AnyEntity } from "./entity-core"

/**
 * Type signature of a given entity.
 */
export type EntityModel<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = FindReturnType<Source, Entity, {}, false>

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = DeepPartial<EntityModel<Source, Entity>>
