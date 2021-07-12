import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { ConnectionBase, ConnectionReleasable } from "../connection/connection"
import { ManagerBase } from "../manager"
import { DataSourceTypes } from "./data-source-column-types"
import { BaseDataSourceOptions } from "./data-source-options"

/**
 * Any driver implementation.
 * Helper type.
 */
export type AnyDataSource = CoreDataSource<
  BaseDataSourceOptions,
  ManagerBase<any>,
  ConnectionBase,
  any
>

/**
 *
 */
export interface CoreDataSource<
  Options extends BaseDataSourceOptions,
  Manager extends ManagerBase<any>,
  Connection extends ConnectionBase,
  Types extends DataSourceTypes
> {

  /**
   * Unique type identifier.
   * Can be used to check if object is an instance of DataSource.
   */
  "@type": "DataSource"

  /**
   * Special property to store information about connection type.
   */
  "@connection": Connection

  /**
   *
   */
  types: Types

  /**
   * Indicates if connection with a data source was initialized or not.
   * In most database implementations this connection means connection to a connection pool.
   */
  isConnected: boolean

  /**
   * Data Source options.
   */
  options: Options

  /**
   * Main manager to perform database operations.
   * Isn't bounded to a specific connection, every operation call might use a separate connection.
   */
  manager: Manager

  /**
   * All entity metadatas that are registered in this data source.
   */
  entityMetadatas: EntityMetadata[]

  /**
   * Initializes a data source connection.
   * This method should be called once on application bootstrap.
   * This method not necessarily creates a database connection (depend on database type),
   * but it also can setup a connection pool with database to use.
   *
   * Returns self.
   */
  connect(): Promise<this>

  /**
   * Closes any opened connections with the database.
   * In most database types it also means connection poll will be closed.
   * Once connection is closed, manager and repositories cannot be used,
   * until connection with a data source won't be initialized using {@link connect()} method.
   */
  close(): Promise<void>

  /**
   * Performs all synchronization operations on a database.
   * Depend on the database type it can be a schema synchronization.
   * Can be used only after {@link connect()} method was called.
   */
  synchronize(): Promise<void>

  /**
   * If connection pool is used, this method takes a single free connection from the pool and returns it.
   * Once you done with connection, it must be released using {@link ConnectionReleasable.release()}.
   */
  createConnection(): Connection

  // builder: {
  //   manager(): Manager
  //   connection(): Connection
  // }

  // subscribers -> needs a re-design, based on observables, maybe driver-specific
  // queryResultCache -> need design
  // relationLoader -> need design
  // relationIdLoader -> need design

  // createEntityManager -> first QueryRunner should be driver-specific
  // dropDatabase -> should be driver specific
  // runMigrations -> will be moved to separate migration tool
  // undoLastMigration -> will be moved to separate migration tool
  // showMigrations -> will be moved to separate migration tool
  // hasMetadata -> first EntityMetadata must be rewritten
  // getMetadata -> first EntityMetadata must be rewritten
  // getManyToManyMetadata -> first EntityMetadata must be rewritten
  // transaction -> deprecated, manager method should be used instead (reason: reduce confusion, too many ways to do same)
  // query -> deprecated, manager method should be used instead (reason: reduce confusion, too many ways to do same)
  // createQueryBuilder -> deprecated, manager method should be used instead (reason: reduce confusion, too many ways to do same)
}

export type QueryResult<
  DataSource extends AnyDataSource
> = DataSource["types"]["queryResult"]

export type InsertResult<
  DataSource extends AnyDataSource
> = DataSource["types"]["insertResult"]

export type UpdateResult<
  DataSource extends AnyDataSource
> = DataSource["types"]["updateResult"]

export type DeleteResult<
  DataSource extends AnyDataSource
> = DataSource["types"]["deleteResult"]

export type TransactionOptions<
  DataSource extends AnyDataSource
> = DataSource["types"]["transactionOptions"]
