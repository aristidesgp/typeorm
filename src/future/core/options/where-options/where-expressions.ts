import { DriverTypes } from "../../driver"
import { AnyEntity, AnyEntityList } from "../../entity/entity-core"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
>(
  ...args: WhereOptions<Types, Entities, Entity>[]
): WhereExpression<Types, Entities, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
>(
  ...args: WhereOptions<Types, Entities, Entity>[]
): WhereExpression<Types, Entities, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
>(
  ...args: WhereOptions<Types, Entities, Entity>[]
): WhereExpression<Types, Entities, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity
>(
  ...args: WhereOptions<Types, Entities, Entity>[]
): WhereExpression<Types, Entities, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
