import { DeepPartial } from "../../../common/DeepPartial"
import { DriverTypes } from "../driver"
import { FindReturnType } from "../options"
import { AnyEntity, AnyEntityList } from "./entity-core"

/**
 * Type signature of a given entity.
 */
export type EntityModel<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = FindReturnType<Types, Entities, Entity, {}, false>

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = DeepPartial<EntityModel<Types, Entities, Entity>>
