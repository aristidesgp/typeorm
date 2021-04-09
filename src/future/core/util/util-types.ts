/**
 * Force casts given T to CastTo if T is undefined.
 */
export type ForceCastIfUndefined<T, CastTo> = T extends undefined ? CastTo : T

/**
 * Force casts given T to CastTo if T has no keys.
 */
export type ForceCastIfNoKeys<T, CastTo> = keyof T extends "" ? CastTo : T

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

/**
 * Removes "never" properties from a given object.
 */
export type NonNever<T extends {}> = Pick<
  T,
  { [K in keyof T]: T[K] extends never ? never : K }[keyof T]
>

/**
 * Makes all undefined properties of the object undefined AND optional.
 * It means all non-optional undefined properties of a given object will become optional.
 */
export type UndefinedToOptional<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K]
} &
  {
    [K in keyof T as undefined extends T[K] ? never : K]: T[K]
  }
