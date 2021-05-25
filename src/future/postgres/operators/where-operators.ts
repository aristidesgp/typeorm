import { AnyEntity, createOperator, EntityColumnPaths } from "../../core"
import { Operator } from "../../core/options/operator"

export function Any<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("any", values)
}

export function Between<Entity extends AnyEntity, ValueType>(
  first: ValueType,
  second: ValueType,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("between", [first, second])
}

export function Equal<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("equal", value)
}

export function Like<Entity extends AnyEntity, ValueType>(
  value: string,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("like", value)
}

export function ILike<Entity extends AnyEntity, ValueType>(
  value: string,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("ilike", value)
}

export function In<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("in", values)
}

export function LessThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("lessThan", value)
}

export function LessThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("lessThanOrEqual", value)
}

export function MoreThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | Operator<Entity, ValueType>,
  value2: number | Operator<Entity, ValueType>,
): Operator<Entity, ValueType>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | ValueType | Operator<Entity, ValueType>,
  value2?: number | ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("moreThan", [value1, value2])
}

export function MoreThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("moreThanOrEqual", value)
}

export function Raw<Entity extends AnyEntity, ValueType>(
  sql: string,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("raw", sql)
}

export function AliasedColumn<Entity extends AnyEntity, ValueType>(
  name: string,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("aliased-column", name)
}

export function Column<Entity extends AnyEntity, ValueType>(
  name: EntityColumnPaths<Entity>,
  // alias?: string
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("column", name)
}

export function SelfColumn<
  Entity extends AnyEntity,
  ValueType
>(): // alias?: string
Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("self-column", undefined)
}

export function Concat<Entity extends AnyEntity, ValueType>(
  ...values: (ValueType | Operator<Entity, ValueType>)[]
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("concat", values)
}

export function Not<Entity extends AnyEntity, ValueType>(
  value: ValueType | Operator<Entity, ValueType>,
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("not", value)
}

export function Plus<Entity extends AnyEntity, ValueType>(
  ...values: (number | Operator<Entity, ValueType>)[]
): Operator<Entity, ValueType> {
  return createOperator<Entity, ValueType>("plus", values)
}
