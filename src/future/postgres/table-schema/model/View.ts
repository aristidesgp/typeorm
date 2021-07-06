/**
 * View in the database represented in this class.
 */
export interface View {
  /**
   * Contains database name, schema name and table name.
   * E.g. "myDB"."mySchema"."myTable"
   */
  name: string

  /**
   * Indicates if view is materialized.
   */
  materialized: boolean

  /**
   * View definition.
   */
  expression: string
}
