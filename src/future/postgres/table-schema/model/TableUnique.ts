/**
 * Database's table unique constraint stored in this class.
 */
export interface TableUnique {
  /**
   * Constraint name.
   */
  name?: string

  /**
   * Columns that contains this constraint.
   */
  columnNames: string[]
}
