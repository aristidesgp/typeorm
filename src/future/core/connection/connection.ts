/**
 * A single connection to the database.
 * Since most databases use connection pooling, each connection is a single connection from connection pool.
 * For the database implementation not supporting connection pool, a single connection is used.
 */
export interface ConnectionBase {
  // readonly dataSource: DataSource
  // readonly manager: DataSource["driver"]["manager"]

  /**
   * Indicates if connection for this query runner is released.
   * Once its released, query runner cannot run queries anymore.
   */
  readonly isReleased: boolean
}

export interface ConnectionReleasable {
  /**
   * Initializes connection with the database.
   * If connection pool is used, it means it creates / uses a database connection from the connection pool.
   */
  connect(): Promise<void>

  /**
   * Releases used database connection.
   * Connection can't be used after it is released.
   */
  release(): Promise<void>
}

export interface ConnectionCommonRDBMS extends ConnectionBase {
  /**
   * Indicates if transaction is in progress.
   */
  readonly isTransactionActive: boolean
}
