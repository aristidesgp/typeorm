import { AnyDriver } from "../driver"
import { AnyEntity } from "../entity"
import { FindExpression, FindOptionsWhere } from "./find-options-where"

export function Or<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Driver, Entity>[]
): FindExpression<Driver, Entity> {
  return {
    "@type": "FindExpression",
    kind: "or",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function And<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Driver, Entity>[]
): FindExpression<Driver, Entity> {
  return {
    "@type": "FindExpression",
    kind: "and",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Not<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Driver, Entity>[]
): FindExpression<Driver, Entity> {
  return {
    "@type": "FindExpression",
    kind: "not",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

export function Xor<Driver extends AnyDriver, Entity extends AnyEntity>(
  ...args: FindOptionsWhere<Driver, Entity>[]
): FindExpression<Driver, Entity> {
  return {
    "@type": "FindExpression",
    kind: "xor",
    driver: null as any,
    entity: null as any,
    options: args,
  }
}

// todo: export function Where
