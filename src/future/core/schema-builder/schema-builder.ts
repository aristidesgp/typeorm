/**
 * Schema synchronization process based on entity metadatas.
 */
export type SchemaBuilder = {
  /**
   * Executes schema synchronization process.
   */
  synchronize(): Promise<void>

  /**
   * Returns migrations which can to be executed by schema builder.
   */
  migrations(): Promise<MigrationList<any>>
}

/**
 * Contains list of "up" and "down" migrations.
 */
export type MigrationList<T> = {
  /**
   * List of "up" queries.
   */
  up: T[]

  /**
   * List of "down" queries.
   */
  down: T[]
}
