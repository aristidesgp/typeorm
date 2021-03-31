/**
 * Returns empty type (e.g. {}) if given T is undefined.
 *
 * todo: maybe better to do ForceCast<T, Forced>
 */
export type ForceEmptyTypeIfUndefined<T> = T extends undefined ? {} : T

export type ValueOf<T> = T[keyof T]

/**
 * This magic type checks if given string literal union type contains more than one type inside.
 * Type returns never if literal type contains only one type.
 */
export type MoreThanOneElement<T extends string> = {
  [P in T]: Exclude<T, P> extends never ? never : P
}[T]
