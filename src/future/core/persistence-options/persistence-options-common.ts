/**
 * Persistence options where transaction is supported.
 */
export interface PersistenceWithTransactionOptions {
  /**
   * By default transactions are enabled and all queries in persistence operation are wrapped into the transaction.
   * You can disable this behaviour by setting { transaction: false } in the persistence options.
   */
  transaction?: boolean
}

/**
 * Persistence options where operations in chunks are supported.
 */
export interface PersistenceWithChunkOptions {
  /**
   * Breaks save execution into chunks of a given size.
   * For example, if you want to save 100,000 objects but you have issues with saving them,
   * you can break them into 10 groups of 10,000 objects (by setting { chunk: 10000 }) and save each group separately.
   * This option is needed to perform very big insertions when you have issues with underlying driver parameter number limitation.
   */
  chunk?: number
}

/**
 * Persistence options where listeners are supported.
 */
export interface PersistenceWithListenersOptions {
  /**
   * Additional data to be passed with persist method.
   * This data can be used in subscribers then.
   */
  data?: any

  /**
   * Indicates if listeners and subscribers are called for this operation.
   * By default they are enabled.
   */
  listeners?: boolean
}
