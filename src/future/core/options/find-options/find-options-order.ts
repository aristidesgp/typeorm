import { AnyDriver } from "../../driver"
import {
  AnyEntity,
  AnyEntityCore,
  EntityClass,
  ReferencedEntity,
} from "../../entity"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Entity extends AnyEntityCore
  ? {
      [P in keyof Entity["columns"]]?: Driver["types"]["orderTypes"]
    } &
      {
        [P in keyof Entity["relations"]]?: FindOptionsOrder<
          Driver,
          ReferencedEntity<Entity, P>
        >
      } &
      {
        [P in keyof Entity["embeds"]]?: FindOptionsOrder<
          Driver,
          Entity["embeds"][P]
        >
      }
  : {
      [P in keyof Entity]?: Entity[P] extends Array<infer U>
        ? U extends EntityClass
          ? FindOptionsOrder<Driver, InstanceType<U>>
          : Driver["types"]["orderTypes"]
        : Entity[P] extends EntityClass
        ? FindOptionsOrder<Driver, InstanceType<Entity[P]>>
        : Driver["types"]["orderTypes"]
    }
