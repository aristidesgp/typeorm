/**
 * Database's table check constraint stored in this class.
 */
export interface TableCheck {
  /**
   * Constraint name.
   */
  name?: string

  /**
   * Column that contains this constraint.
   */
  columnNames?: string[]

  /**
   * Check expression.
   */
  expression?: string
}
