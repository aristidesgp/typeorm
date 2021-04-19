import { DriverTypes } from "../../driver"
import {
  AnyEntity,
  ColumnCompileType,
  EntityProps,
  ReferencedEntity,
} from "../../entity"

export type WhereExpression<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  // driver: Source
  entity: Entity
  options: WhereOptions<Types, Entity>[]
}

export type WhereOperator<
  Types extends DriverTypes,
  Entity extends AnyEntity,
  ValueType
> = {
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
export type WhereOptions<Types extends DriverTypes, Entity extends AnyEntity> =
  | WhereExpression<Types, Entity>
  | WhereOperatorOptions<Types, Entity>

export type WhereOptionsOperatorProperty<
  Types extends DriverTypes,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends string & keyof Entity["columns"]
  ?
      | ColumnCompileType<
          Entity["driver"]["types"],
          Entity["model"],
          P,
          Entity["columns"][P]
        >
      | WhereOperator<
          Types,
          Entity,
          ColumnCompileType<
            Entity["driver"]["types"],
            Entity["model"],
            P,
            Entity["columns"][P]
          >
        >
      | WhereExpression<Types, Entity>
  : P extends keyof Entity["embeds"]
  ? WhereOptions<Types, Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? WhereOptions<Types, ReferencedEntity<Entity, P>>
  : never

export type WhereOperatorOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<
    Types,
    Entity,
    P
  >
}
