import { AnyEntity } from "../../entity"
import { Operator } from "./index"

/**
 * Helper function to create a new WhereOperator.
 */
export function createOperator<Entity extends AnyEntity, ValueType>(
  name: string,
  value: any,
): Operator<Entity, ValueType> {
  return () => ({
    "@type": "Operator",
    __entity: null as any,
    __valueType: null as any,
    name,
    value,
  })
}
