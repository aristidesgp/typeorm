import {
  AnyEntity,
  FindOptionsCache,
  PersistenceWithChunkOptions,
  PersistenceWithListenersOptions,
  PersistenceWithTransactionOptions,
} from "../../core"
import {
  SubscriberCommonTypes,
  SubscriberTransactionalTypes,
} from "../../core/subscriber"
import { PostgresDataSource } from "./data-source-types"

export interface PostgresColumnTypes {
  int: { type: number }
  varchar: { type: string }
  boolean: { type: boolean }
}
export type PostgresOrderTypes =
  | "asc"
  | "desc"
  | {
      direction?: "asc" | "desc"
      nulls?: "first" | "last"
    }

export type PostgresIsolationLevels =
  | "READ UNCOMMITTED"
  | "READ COMMITTED"
  | "REPEATABLE READ"
  | "SERIALIZABLE"

export type PostgresLocking =
  | { mode: "optimistic"; version: number | Date }
  | {
      mode:
        | "pessimistic_read"
        | "pessimistic_write"
        | "dirty_read"
        | "pessimistic_partial_write"
        | "pessimistic_write_or_fail"
        | "for_no_key_update"
      tables?: string[]
    }

export type PostgresDataSourceTypes = {
  columnTypes: PostgresColumnTypes
  orderTypes: PostgresOrderTypes
  findOptions: {
    /**
     * If this is set to true, query will be executed in a transaction.
     * By default query isn't wrapped into transaction.
     */
    transaction?: boolean

    /**
     * Indicates what locking mode should be used.
     */
    lockTypes?: PostgresLocking
  }
  insertResult: any
  updateResult: any
  deleteResult: any
  queryResult: any
  transactionOptions: {
    isolationLevel?: PostgresIsolationLevels
  }
  insertOptions: PostgresInsertOptions
  updateOptions: PostgresUpdateOptions
  updateByOptions: PostgresUpdateByOptions
  deleteOptions: PostgresDeleteOptions
  deleteByOptions: PostgresDeleteByOptions
  archiveOptions: PostgresArchiveOptions
  archiveByOptions: PostgresArchiveByOptions
  unarchiveOptions: PostgresUnarchiveOptions
  unarchiveByOptions: PostgresUnarchiveByOptions

  subscriberTypes: SubscriberCommonTypes<PostgresDataSource<any>, AnyEntity> &
    SubscriberTransactionalTypes<PostgresDataSource<any>, AnyEntity>
}

export type PostgresInsertOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresUpdateOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresUpdateByOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresDeleteOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresDeleteByOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresArchiveOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresArchiveByOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresUnarchiveOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions

export type PostgresUnarchiveByOptions = PersistenceWithTransactionOptions &
  PersistenceWithChunkOptions &
  PersistenceWithListenersOptions
