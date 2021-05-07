import { AnyEntity, AnyEntityCore } from "../../entity/entity-core"
import { WhereOperator } from "./index"

export function Any<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "any",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function Between<Entity extends AnyEntity, ValueType>(
  first: ValueType,
  second: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "between",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: [first, second],
  }
}

export function Equal<Entity extends AnyEntity, ValueType>(
  value: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "equal",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Like<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "like",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function ILike<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "ilike",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function In<Entity extends AnyEntity, ValueType>(
  ...values: ValueType[]
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "in",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function LessThan<Entity extends AnyEntity, ValueType>(
  value: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThan",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function LessThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThanOrEqual",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThan<Entity extends AnyEntity, ValueType>(
  value: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThan",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThanOrEqual<Entity extends AnyEntity, ValueType>(
  value: ValueType,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThanOrEqual",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Raw<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "raw",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Escaped<Entity extends AnyEntity, ValueType>(
  value: string,
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "escaped",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Column<Entity extends AnyEntity, ValueType>(
  name: Entity extends AnyEntityCore ? keyof Entity["columns"] : string,
  // alias?: string
): WhereOperator<Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "column",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: name,
  }
}
