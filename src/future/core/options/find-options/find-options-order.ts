import { DriverTypes } from "../../driver"
import {
  AnyEntity,
  AnyEntityList,
  ReferencedEntity,
} from "../../entity/entity-core"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = {
  [P in keyof Entity["columns"]]?: Types["orderTypes"]
} &
  {
    [P in keyof Entity["relations"]]?: FindOptionsOrder<
      Types,
      Entities,
      ReferencedEntity<Entities, Entity, P>
    >
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsOrder<
      Types,
      Entities,
      Entity["embeds"][P]
    >
  }
