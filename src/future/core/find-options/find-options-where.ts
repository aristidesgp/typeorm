import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity"
import { ColumnCompileType, EntityProps } from "./find-options-select"

export type FindExpression<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  "@type": "FindExpression"
  kind: "not" | "or" | "and" | "xor"
  driver: Driver
  entity: Entity
  options: FindOptionsWhere<Driver, Entity>[]
}

export type FindOperator<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
> = {
  "@type": "FindOperator"
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
  driver: Driver
  entity: Entity
  valueType: ValueType
  value: any
}

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type FindOptionsWhere<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = FindExpression<Driver, Entity> | FindOperatorWhereOptions<Driver, Entity>

export type FindOperatorWhereOptionsProperty<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends keyof Entity["columns"]
  ?
      | ColumnCompileType<Entity, P>
      | FindOperator<Driver, Entity, ColumnCompileType<Entity, P>>
      | FindExpression<Driver, Entity>
  : P extends keyof Entity["embeds"]
  ? FindOptionsWhere<Driver, Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? FindOptionsWhere<
      Driver,
      Driver["options"]["entities"][Entity["relations"][P]["reference"]]
    >
  : never

export type FindOperatorWhereOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: FindOperatorWhereOptionsProperty<
    Driver,
    Entity,
    P
  >
}
