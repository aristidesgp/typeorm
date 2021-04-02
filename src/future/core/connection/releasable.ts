/**
 * If manager is created per-connection (query runner), this interface must be followed.
 */
export interface Releasable {
  /**
   * Releases all resources used by entity manager.
   * This is used when entity manager is created with a single query runner,
   * and this single query runner needs to be released after job with entity manager is done.
   */
  release(): Promise<void>
}
