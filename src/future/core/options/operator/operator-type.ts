import { AnyEntity } from "../../entity"

/**
 * Operators can be used to provide a custom functions which can be injected into
 */
export type Operator<Entity extends AnyEntity, ValueType, ReturnType> = () => {
  /**
   * Unique type identifier.
   */
  "@type": "Operator"

  /**
   * Operator name, e.g. "in", "plus", "minus", etc.
   */
  name: string

  /**
   * Value sent to operator when it was called.
   */
  value: any

  /**
   * Fake property to store type information.
   */
  __entity: Entity

  /**
   * Fake property to store type information.
   */
  __valueType: ValueType

  /**
   * Fake property to store type information.
   */
  __returnType: ReturnType
}
