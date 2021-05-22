import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { WhereGroup, WhereOptions } from "./where-options"

export function Or<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereGroup<DataSource, Entity> {
  return { $or: args }
}

export function And<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereGroup<DataSource, Entity> {
  return { $and: args }
}

export function Not<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereGroup<DataSource, Entity> {
  return { $not: args }
}

export function Xor<DataSource extends AnyDataSource, Entity extends AnyEntity>(
  ...args: WhereOptions<DataSource, Entity>[]
): WhereGroup<DataSource, Entity> {
  return { $xor: args }
}
