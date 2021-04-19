import { DriverTypes } from "../../driver"
import { AnyEntity } from "../../entity/entity-core"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<Types extends DriverTypes, Entity extends AnyEntity>(
  ...args: WhereOptions<Types, Entity>[]
): WhereExpression<Types, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Types extends DriverTypes, Entity extends AnyEntity>(
  ...args: WhereOptions<Types, Entity>[]
): WhereExpression<Types, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Types extends DriverTypes, Entity extends AnyEntity>(
  ...args: WhereOptions<Types, Entity>[]
): WhereExpression<Types, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Types extends DriverTypes, Entity extends AnyEntity>(
  ...args: WhereOptions<Types, Entity>[]
): WhereExpression<Types, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
