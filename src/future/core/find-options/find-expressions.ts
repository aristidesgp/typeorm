import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"
import { FindExpression, FindOptionsWhere } from "./find-options-where"

export function Or<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Source, Entity>[]
): FindExpression<Source, Entity> {
  return {
    "@type": "FindExpression",
    kind: "or",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Source, Entity>[]
): FindExpression<Source, Entity> {
  return {
    "@type": "FindExpression",
    kind: "and",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Source, Entity>[]
): FindExpression<Source, Entity> {
  return {
    "@type": "FindExpression",
    kind: "not",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Source extends AnyDataSource, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Source, Entity>[]
): FindExpression<Source, Entity> {
  return {
    "@type": "FindExpression",
    kind: "xor",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
