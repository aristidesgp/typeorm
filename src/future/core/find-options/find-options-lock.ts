/**
 * Advanced cache options that can be used in find options.
 */
export type FindOptionsLock =
  | { mode: "optimistic"; version: number | Date }
  | {
      mode:
        | "pessimistic_read"
        | "pessimistic_write"
        | "dirty_read"
        | "pessimistic_partial_write"
        | "pessimistic_write_or_fail"
        | "for_no_key_update"
      tables?: string[]
    }
