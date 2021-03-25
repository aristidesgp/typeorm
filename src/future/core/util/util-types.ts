/**
 * Returns empty type (e.g. {}) if given T is undefined.
 *
 * todo: maybe better to do ForceCast<T, Forced>
 */
export type ForceEmptyTypeIfUndefined<T> = T extends undefined ? {} : T

export type ValueOf<T> = T[keyof T]
