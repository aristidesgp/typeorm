import { DeepPartial } from "../../../common/DeepPartial"
import { DriverTypes } from "../driver"
import { FindReturnType } from "../options"
import { AnyEntity } from "./entity-core"

/**
 * Type signature of a given entity.
 */
export type EntityModel<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = FindReturnType<Types, Entity, {}, false>

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = DeepPartial<EntityModel<Types, Entity>>
