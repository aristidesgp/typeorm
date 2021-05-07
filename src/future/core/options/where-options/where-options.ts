import { AnyDriver } from "../../driver"
import {
  AnyEntity,
  AnyEntityCore,
  ColumnCompileType,
  EntityProps,
  ReferencedEntity,
} from "../../entity"

export type WhereExpression<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  // driver: Source
  entity: Entity
  options: WhereOptions<Driver, Entity>[]
}

export type WhereOperator<Entity extends AnyEntity, ValueType> = {
  "@type": "WhereOperator"
  kind:
    | "any"
    | "between"
    | "equal"
    | "ilike"
    | "like"
    | "in"
    | "lessThan"
    | "lessThanOrEqual"
    | "moreThan"
    | "moreThanOrEqual"
    | "raw"
    // | "and"
    // | "or"
    // | "not"
    | "escaped"
    | "column"
  // driver: Source
  entity: Entity
  valueType: ValueType
  value: any
}

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type WhereOptions<Driver extends AnyDriver, Entity extends AnyEntity> =
  | WhereExpression<Driver, Entity>
  | WhereOperatorOptions<Driver, Entity>

export type WhereOptionsOperatorProperty<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
> = Entity extends AnyEntityCore
  ? P extends string & keyof Entity["columns"]
    ?
        | ColumnCompileType<Driver, Entity, P>
        | WhereOperator<Entity, ColumnCompileType<Driver, Entity, P>>
        | WhereExpression<Driver, Entity>
    : P extends keyof Entity["embeds"]
    ? object & WhereOptions<Driver, Entity["embeds"][P]>
    : P extends keyof Entity["relations"]
    ? object & WhereOptions<Driver, ReferencedEntity<Entity, P>>
    : never
  : P extends keyof Entity
  ?
      | Entity[P]
      | WhereOperator<Entity, Entity[P]>
      | WhereExpression<Driver, Entity>
  : unknown

export type WhereOperatorOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<
    Driver,
    Entity,
    P
  >
}
