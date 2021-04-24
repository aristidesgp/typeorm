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
> = FindReturnType<Types, Entity, {}, false, "all">

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = DeepPartial<FindReturnType<Types, Entity, {}, false, "all">>

export type EntityModelForCreate<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = DeepPartial<FindReturnType<Types, Entity, {}, false, "create">>

export type EntityModelVirtuals<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = FindReturnType<Types, Entity, {}, false, "virtuals">

// export type EntityModelCreate<
//   Types extends DriverTypes,
//   Entity extends AnyEntity
// > = {
//   [P in keyof EntityPropsWithModel<Entity> as P extends EntitySelectionAllColumns<
//     Types,
//     Entity,
//     {}
//   >
//     ? P
//     : never]: FindReturnTypeProperty<
//     Types,
//     Entity,
//     {},
//     P,
//     EntityPropsWithModel<Entity>[P]["property"],
//     false
//   >
// }
