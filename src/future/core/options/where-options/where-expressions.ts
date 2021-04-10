import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity/entity-core"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<Source, Entity>[]
): WhereExpression<Source, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<Source, Entity>[]
): WhereExpression<Source, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<Source, Entity>[]
): WhereExpression<Source, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<Source, Entity>[]
): WhereExpression<Source, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
