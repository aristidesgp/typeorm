import { DriverTypes } from "../../driver"
import { AnyEntity, AnyEntityList } from "../../entity/entity-core"
import { WhereOperator } from "./index"

export function Any<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "any",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function Between<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(
  first: ValueType,
  second: ValueType,
): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "between",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: [first, second],
  }
}

export function Equal<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "equal",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Like<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "like",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function ILike<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "ilike",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function In<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(...values: ValueType[]): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "in",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: values,
  }
}

export function LessThan<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThan",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function LessThanOrEqual<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "lessThanOrEqual",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThan<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThan",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function MoreThanOrEqual<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: ValueType): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "moreThanOrEqual",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Raw<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "raw",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Escaped<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(value: string): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "escaped",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: value,
  }
}

export function Column<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  ValueType
>(
  name: keyof Entity["columns"],
  // alias?: string
): WhereOperator<Types, Entities, Entity, ValueType> {
  return {
    "@type": "WhereOperator",
    kind: "column",
    // driver: null as any,
    entity: null as any,
    valueType: null as any,
    value: name,
  }
}
