import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity/entity-core"
import { WhereOperator } from "./index"

export function Any<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "any",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function Between<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(
  first: ValueType,
  second: ValueType,
): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "between",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: [first, second],
  }
}

export function Equal<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "equal",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Like<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "like",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function ILike<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "ilike",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function In<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "in",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function LessThan<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThan",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function LessThanOrEqual<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThanOrEqual",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThan<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThan",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThanOrEqual<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThanOrEqual",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Raw<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "raw",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Escaped<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "escaped",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Column<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(
  name: keyof Entity["columns"],
  // alias?: string
): WhereOperator<Source, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "column",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: name,
  }
}
