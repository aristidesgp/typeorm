import { AnyDriver } from "../../driver"
import { AnyEntity } from "../../entity"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: WhereOptions<Driver, Entity>[]
): WhereExpression<Driver, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: WhereOptions<Driver, Entity>[]
): WhereExpression<Driver, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: WhereOptions<Driver, Entity>[]
): WhereExpression<Driver, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: WhereOptions<Driver, Entity>[]
): WhereExpression<Driver, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
