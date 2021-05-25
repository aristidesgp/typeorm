import {
  AnyEntity,
  createWhereOperator,
  EntityColumnPaths,
  WhereOperator,
} from "../../core"

export function Any<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("any", values)
}

export function Between<Entity extends AnyEntity, ValueType>(
  first: ValueType,
  second: ValueType,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("between", [first, second])
}

export function Equal<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("equal", value)
}

export function Like<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("like", value)
}

export function ILike<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("ilike", value)
}

export function In<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("in", values)
}

export function LessThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("lessThan", value)
}

export function LessThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("lessThanOrEqual", value)
}

export function MoreThan<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | WhereOperator<Entity, ValueType>,
  value2: number | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType>
export function MoreThan<Entity extends AnyEntity, ValueType>(
  value1: number | ValueType | WhereOperator<Entity, ValueType>,
  value2?: number | ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("moreThan", [value1, value2])
}

export function MoreThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("moreThanOrEqual", value)
}

export function Raw<Entity extends AnyEntity, ValueType>(
  sql: string,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("raw", sql)
}

export function AliasedColumn<Entity extends AnyEntity, ValueType>(
  name: string,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("aliased-column", name)
}

export function Column<Entity extends AnyEntity, ValueType>(
  name: EntityColumnPaths<Entity>,
  // alias?: string
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("column", name)
}

export function SelfColumn<
  Entity extends AnyEntity,
  ValueType
>(): // alias?: string
WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("self-column", undefined)
}

export function Concat<Entity extends AnyEntity, ValueType>(
  ...values: (ValueType | WhereOperator<Entity, ValueType>)[]
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("concat", values)
}

export function Not<Entity extends AnyEntity, ValueType>(
  value: ValueType | WhereOperator<Entity, ValueType>,
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("not", value)
}

export function Plus<Entity extends AnyEntity, ValueType>(
  ...values: (number | WhereOperator<Entity, ValueType>)[]
): WhereOperator<Entity, ValueType> {
  return createWhereOperator<Entity, ValueType>("plus", values)
}
