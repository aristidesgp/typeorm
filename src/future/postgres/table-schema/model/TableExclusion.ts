/**
 * Database's table exclusion constraint stored in this class.
 */
export interface TableExclusion {
  /**
   * Constraint name.
   */
  name?: string

  /**
   * Exclusion expression.
   */
  expression?: string
}
