import { TableColumn } from "./TableColumn"
import { TableIndex } from "./TableIndex"
import { TableForeignKey } from "./TableForeignKey"
import { TableUnique } from "./TableUnique"
import { TableCheck } from "./TableCheck"
import { TableExclusion } from "./TableExclusion"

/**
 * Table in the database represented in this class.
 */
export interface Table {
  /**
   * Contains database name, schema name and table name.
   * E.g. "myDB"."mySchema"."myTable"
   */
  name: string

  /**
   * Table columns.
   */
  columns: TableColumn[]

  /**
   * Table indices.
   */
  indices: TableIndex[]

  /**
   * Table foreign keys.
   */
  foreignKeys: TableForeignKey[]

  /**
   * Table unique constraints.
   */
  uniques: TableUnique[]

  /**
   * Table check constraints.
   */
  checks: TableCheck[]

  /**
   * Table exclusion constraints.
   */
  exclusions: TableExclusion[]

  /**
   * Table engine.
   */
  engine?: string

  /**
   * Indicates if table was just created.
   * This is needed, for example to check if we need to skip primary keys creation
   * for new tables.
   *
   * TODO: extract out of there into rdbms or somewhere else.
   */
  justCreated: boolean
}
