import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { WhereExpression, WhereOptions } from "./where-options"

export function Or<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereExpression<DataSource, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "or",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereExpression<DataSource, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "and",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereExpression<DataSource, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "not",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereExpression<DataSource, Entity> {
  return {
    "@type": "WhereExpression",
    kind: "xor",
    // driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
