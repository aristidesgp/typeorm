import {
  PersistenceWithChunkOptions,
  PersistenceWithListenersOptions,
  PersistenceWithTransactionOptions,
} from "../../core/options/persistence-options"

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

export type PostgresDriverTypes = {
  columnTypes: PostgresColumnTypes
  orderTypes: PostgresOrderTypes
  lockTypes: ""
  insertResult: any
  updateResult: any
  deleteResult: any
  queryResult: any
  isolationLevels: PostgresIsolationLevels
  insertOptions: PostgresInsertOptions
  updateOptions: PostgresUpdateOptions
  updateByOptions: PostgresUpdateByOptions
  deleteOptions: PostgresDeleteOptions
  deleteByOptions: PostgresDeleteByOptions
  archiveOptions: PostgresArchiveOptions
  archiveByOptions: PostgresArchiveByOptions
  unarchiveOptions: PostgresUnarchiveOptions
  unarchiveByOptions: PostgresUnarchiveByOptions
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
