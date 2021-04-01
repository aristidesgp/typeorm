import { FlatTypeHint } from "../util"

/**
 * "Selects" all properties of the given T.
 * It means it goes through each property in the given T and marks that property name as "true".
 * Used to select all properties of a given entity.
 * Recursive.
 */
export type SelectAll<T> = FlatTypeHint<
  {
    [P in keyof T]: T[P] extends Array<infer U>
      ? Array<SelectAll<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<SelectAll<U>>
      : true
  }
>
