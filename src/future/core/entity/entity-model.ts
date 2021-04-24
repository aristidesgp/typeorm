import { DeepPartial } from "../../../common/DeepPartial"
import { FindReturnType } from "../options"
import { AnyEntity } from "./entity-core"

/**
 * Type signature of a given entity.
 */
export type EntityModel<Entity extends AnyEntity> = FindReturnType<
  Entity,
  {},
  false,
  "all"
>

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<Entity extends AnyEntity> = DeepPartial<
  FindReturnType<Entity, {}, false, "all">
>

export type EntityModelForCreate<Entity extends AnyEntity> = DeepPartial<
  FindReturnType<Entity, {}, false, "create">
>

export type EntityModelVirtuals<Entity extends AnyEntity> = FindReturnType<
  Entity,
  {},
  false,
  "virtuals"
>

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
