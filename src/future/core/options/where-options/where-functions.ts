import { AnyEntity } from "../../entity"
import { WhereOperator } from "./where-options"

/**
 * Helper function to create a new WhereOperator.
 */
export function createWhereOperator<Entity extends AnyEntity, ValueType>(
  name: string,
  value: any,
): WhereOperator<Entity, ValueType> {
  return () => ({
    "@type": "WhereOperator",
    __entity: null as any,
    __valueType: null as any,
    name,
    value,
  })
}
