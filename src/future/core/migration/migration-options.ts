/**
 * Options used for migrations execution.
 */
export type MigrationsRunOptions = {
  /**
   * List of migrations to run.
   */
  migrations: Function[]

  /**
   * Migrations table name, in case of different name from "migrations".
   * Accepts single string name.
   */
  tableName?: string

  /**
   * Transaction mode for migrations to run in.
   */
  transactionMode?: "all" | "none" | "each"
}
