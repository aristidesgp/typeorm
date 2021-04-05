/**
 * Advanced cache options that can be used in find options.
 */
export interface FindOptionsCache {
  /**
   * Unique identifier to assign to the query to be cached.
   */
  id: string

  /**
   * Number of milliseconds for which period query should be cached.
   */
  milliseconds: number
}
