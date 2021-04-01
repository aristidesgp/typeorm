/**
 * Force casts given T to CastTo if T is undefined.
 */
export type ForceCast<T, CastTo> = T extends undefined ? CastTo : T

/**
 * Extracts all values of a given object T.
 */
export type ValueOf<T> = T[keyof T]

/**
 * This magic type checks if given string literal union type contains more than one type inside.
 * Type returns never if literal type contains only one type.
 */
export type MoreThanOneElement<T extends string> = {
  [P in T]: Exclude<T, P> extends never ? never : P
}[T]

/**
 * This magic type makes intellisense to output
 */
export type FlatTypeHint<T> = true extends false ? never : T

/**
 * Converts union type to intersection.
 */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
