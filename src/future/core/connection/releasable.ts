/**
 * If manager / repository / other is created per-connection (query runner), this interface must be followed.
 */
export interface Releasable {
  /**
   * Query runner provider used in the context.

  readonly connection: ConnectionBase*/

  /**
   * Releases query runner.
   */
  release(): Promise<void>
}
