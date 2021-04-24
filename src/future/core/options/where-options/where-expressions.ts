import { AnyEntity } from "../../entity/entity-core"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<Entity extends AnyEntity>(
  ...args: WhereOptions<Entity>[]
): WhereExpression<Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Entity extends AnyEntity>(
  ...args: WhereOptions<Entity>[]
): WhereExpression<Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Entity extends AnyEntity>(
  ...args: WhereOptions<Entity>[]
): WhereExpression<Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Entity extends AnyEntity>(
  ...args: WhereOptions<Entity>[]
): WhereExpression<Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
