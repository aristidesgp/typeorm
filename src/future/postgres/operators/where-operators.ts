import { AnyEntity, createOperator, EntityColumnPaths } from "../../core"
import { Operator } from "../../core"

export function Any<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("any", values)
}

export function Between<Entity extends AnyEntity, ValueType>(
  first: ValueType,
  second: ValueType,
): Operator<Entity, ValueType, boolean> {
  return createOperator<Entity, ValueType, boolean>("between", [first, second])
}

export function Equal<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, boolean> {
  return createOperator<Entity, ValueType, boolean>("equal", value)
}

export function Like<Entity extends AnyEntity, ValueType>(
  value: string,
): Operator<Entity, ValueType, string> {
  return createOperator<Entity, ValueType, string>("like", value)
}

export function ILike<Entity extends AnyEntity, ValueType>(
  value: string,
): Operator<Entity, ValueType, string> {
  return createOperator<Entity, ValueType, string>("ilike", value)
}

export function In<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("in", values)
}

export function LessThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, boolean> {
  return createOperator<Entity, ValueType, boolean>("lessThan", value)
}

export function LessThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, boolean> {
  return createOperator<Entity, ValueType, boolean>("lessThanOrEqual", value)
}

export function MoreThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, number>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | Operator<Entity, ValueType, any>,
  value2: number | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, number>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | ValueType | Operator<Entity, ValueType, any>,
  value2?: number | ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, number> {
  return createOperator<Entity, ValueType, number>("moreThan", [value1, value2])
}

export function MoreThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, boolean> {
  return createOperator<Entity, ValueType, boolean>("moreThanOrEqual", value)
}

export function Raw<Entity extends AnyEntity, ValueType>(
  sql: string,
): Operator<Entity, ValueType, unknown> {
  // todo: create operator for type casting
  return createOperator<Entity, ValueType, unknown>("raw", sql)
}

export function AliasedColumn<Entity extends AnyEntity, ValueType>(
  name: string,
): Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("aliased-column", name)
}

export function Column<Entity extends AnyEntity, ValueType>(
  name: EntityColumnPaths<Entity>,
  // alias?: string
): Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("column", name)
}

export function SelfColumn<
  Entity extends AnyEntity,
  ValueType
>(): // alias?: string
Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("self-column", undefined)
}

export function Concat<Entity extends AnyEntity, ValueType>(
  ...values: (string | number | Operator<Entity, ValueType, any>)[]
): Operator<Entity, ValueType, string> {
  return createOperator<Entity, ValueType, string>("concat", values)
}

export function Not<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType, any>,
): Operator<Entity, ValueType, unknown> {
  return createOperator<Entity, ValueType, unknown>("not", value)
}

export function Plus<Entity extends AnyEntity, ValueType>(
  ...values: (number | Operator<Entity, ValueType, any>)[]
): Operator<Entity, ValueType, number> {
  return createOperator<Entity, ValueType, number>("plus", values)
}

export function Minus<Entity extends AnyEntity, ValueType>(
  ...values: (number | Operator<Entity, ValueType, any>)[]
): Operator<Entity, ValueType, number> {
  return createOperator<Entity, ValueType, number>("minus", values)
}
