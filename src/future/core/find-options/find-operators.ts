import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"
import { FindOperator } from "./find-options-where"

export function Any<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: string): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: string): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(...values: ValueType[]): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: string): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
>(value: string): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
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
): FindOperator<Source, Entity, ValueType> {
  return {
    "@type": "FindOperator",
    kind: "column",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: name,
  }
}
