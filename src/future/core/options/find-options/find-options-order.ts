import { DriverTypes } from "../../driver"
import { AnyEntity, ReferencedEntity } from "../../entity/entity-core"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  [P in keyof Entity["columns"]]?: Types["orderTypes"]
} &
  {
    [P in keyof Entity["relations"]]?: FindOptionsOrder<
      Types,
      ReferencedEntity<Entity, P>
    >
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsOrder<Types, Entity["embeds"][P]>
  }
