import { FlatTypeHint, NonNever } from "../util"

/**
 * "Selects" all properties of the given T.
 * It means it goes through each property in the given T and marks that property name as "true".
 * Used to select all properties of a given entity.
 * Recursive.
 */
export type SelectAll<T> = FlatTypeHint<
  NonNever<
    {
      [P in keyof T]: T[P] extends string | number | boolean
        ? true
        : keyof SelectAll<T[P]> extends ""
        ? never
        : SelectAll<T[P]> // : true
    }
  >
>
