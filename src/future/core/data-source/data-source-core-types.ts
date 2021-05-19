import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { ConnectionBase } from "../connection/connection"
import { LoggerBase } from "../logger"
import { ManagerBase } from "../manager"
import { NamingStrategyBase } from "../naming-strategy"
import { DataSourceTypes } from "./data-source-column-types"
import { AnyDataSourceOptions } from "./data-source-options"

/**
 * Any driver implementation.
 * Helper type.
 */
export type AnyDataSource = CoreDataSource<
  AnyDataSourceOptions,
  ManagerBase<any>,
  ConnectionBase,
  NamingStrategyBase,
  any
>

/**
 *
 */
export interface CoreDataSource<
  Options extends AnyDataSourceOptions,
  Manager extends ManagerBase<any>,
  Connection extends ConnectionBase,
  NamingStrategy extends NamingStrategyBase,
  Types extends DataSourceTypes
> {
  // todo: rename to __ or move everything to driver: { } ?
  connection: Connection
  types: Types
  builder: {
    manager(): Manager
    connection(): Connection
  }

  /**
   * Unique type identifier.
   * Can be used to check if object is an instance of DataSource.
   */
  "@type": "DataSource"

  /**
   * Indicates if connection with a data source was initialized or not.
   * In most database implementations this connection means connection to a connection pool.
   */
  isConnected: boolean

  /**
   * Options.
   */
  options: Options

  /**
   * Manager.
   */
  manager: Manager

  /**
   * All entity metadatas that are registered for this connection.
   */
  entityMetadatas: EntityMetadata[] // if it will be typed, EntityMetadataList should be created like RepositoryList

  /**
   * Naming strategy used in the connection.
   */
  namingStrategy: NamingStrategy

  /**
   * Logger used to log orm events.
   */
  logger: LoggerBase

  /**
   * Initializes a data source connection.
   * This method should be called once on application bootstrap.
   * This method not necessarily creates database connection (depend on database type),
   * but it also can setup a connection pool with database to use.
   *
   * Returns self.
   */
  connect(): Promise<this>

  /**
   * Closes any opened connection with a database.
   * In most database types it also means connection poll will be closed.
   * Once connection is closed, manager and repositories cannot be used,
   * until connection with a data source won't be initialized using {@link connect()} method.
   */
  close(): Promise<void>

  /**
   * Creates database schema for all entities registered in this connection.
   * Can be used only after connection to the database is established.
   *
   * Returns self.
   */
  synchronize(): Promise<void>

  /**
   * Creates a query runner used for perform queries on a single database connection.
   * Using query runners you can control your queries to execute using single database connection and
   * manually control your database transaction.
   *
   * Mode is used in replication mode and indicates whatever you want to connect
   * to master database or any of slave databases.
   * If you perform writes you must use master database,
   * if you perform reads you can use slave databases.
   */
  createConnection(): Connection

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

export type IsolationLevels<
  DataSource extends AnyDataSource
> = DataSource["types"]["isolationLevels"]
