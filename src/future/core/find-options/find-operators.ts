import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity"
import { FindOperator } from "./find-options-where"

export function Any<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(
  first: ValueType,
  second: ValueType,
): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: string): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: string): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: string): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(value: string): FindOperator<Driver, Entity, ValueType> {
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
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ValueType
>(
  name: keyof Entity["columns"],
  // alias?: string
): FindOperator<Driver, Entity, ValueType> {
  return {
    "@type": "FindOperator",
    kind: "column",
    driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: name,
  }
}
