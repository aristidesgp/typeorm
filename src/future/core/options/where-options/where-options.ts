import { DriverTypes } from "../../driver"
import {
  AnyEntity,
  AnyEntityList,
  ColumnCompileType,
  EntityProps,
  ReferencedEntity,
} from "../../entity"

export type WhereExpression<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  // driver: Source
  entity: Entity
  options: WhereOptions<Types, Entities, Entity>[]
}

export type WhereOperator<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
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
export type WhereOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> =
  | WhereExpression<Types, Entities, Entity>
  | WhereOperatorOptions<Types, Entities, Entity>

export type WhereOptionsOperatorProperty<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends string & keyof Entity["columns"]
  ?
      | ColumnCompileType<
          Entity["driver"]["types"],
          Entities,
          Entity["model"],
          P,
          Entity["columns"][P]
        >
      | WhereOperator<
          Types,
          Entities,
          Entity,
          ColumnCompileType<
            Entity["driver"]["types"],
            Entities,
            Entity["model"],
            P,
            Entity["columns"][P]
          >
        >
      | WhereExpression<Types, Entities, Entity>
  : P extends keyof Entity["embeds"]
  ? WhereOptions<Types, Entities, Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? WhereOptions<Types, Entities, ReferencedEntity<Entities, Entity, P>>
  : never

export type WhereOperatorOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<
    Types,
    Entities,
    Entity,
    P
  >
}
