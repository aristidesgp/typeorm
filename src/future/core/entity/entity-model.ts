import { DeepPartial } from "../../../common/DeepPartial"
import { AnyDriver } from "../driver"
import { FindReturnType } from "../options"
import { AnyEntity, AnyEntitySchema, EntityClassInstance } from "./entity-core"

/**
 * Type signature of a given entity.
 */
export type EntityModel<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? FindReturnType<Driver, Entity, {}, false, "all">
  : Entity extends EntityClassInstance
  ? Entity
  : unknown

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? DeepPartial<EntityModel<Driver, Entity>>
  : DeepPartial<Entity>

export type EntityModelCreateType<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  Model extends EntityModelForCreate<Driver, Entity>
> = Entity extends AnyEntitySchema
  ? Model & EntityModelVirtuals<Driver, Entity>
  : Entity

export type EntityModelForCreate<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? DeepPartial<FindReturnType<Driver, Entity, {}, false, "create">>
  : DeepPartial<Entity>

export type EntityModelVirtuals<
  Driver extends AnyDriver,
  Entity extends AnyEntitySchema
> = FindReturnType<Driver, Entity, {}, false, "virtuals">

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
