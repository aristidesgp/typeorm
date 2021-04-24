import {
  AnyEntity,
  ColumnCompileType,
  EntityProps,
  ReferencedEntity,
} from "../../entity"

export type WhereExpression<Entity extends AnyEntity> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  // driver: Source
  entity: Entity
  options: WhereOptions<Entity>[]
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
export type WhereOptions<Entity extends AnyEntity> =
  | WhereExpression<Entity>
  | WhereOperatorOptions<Entity>

export type WhereOptionsOperatorProperty<
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends string & keyof Entity["columns"]
  ?
      | ColumnCompileType<Entity, P>
      | WhereOperator<Entity, ColumnCompileType<Entity, P>>
      | WhereExpression<Entity>
  : P extends keyof Entity["embeds"]
  ? WhereOptions<Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? WhereOptions<ReferencedEntity<Entity, P>>
  : never

export type WhereOperatorOptions<Entity extends AnyEntity> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<Entity, P>
}
