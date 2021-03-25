import { MigrationsRunOptions } from "./migration-options"

/**
 * Helps to manage and work with migrations.
 */
export const Migrations = {
  /**
   * Runs migrations.
   */
  run(options: MigrationsRunOptions) {
    return true
  },

  /**
   * Undo last executed migration.
   */
  undoLast() {
    return true
  },

  /**
   * Shows list of pending migrations.
   */
  pending() {
    return []
  },
}
