import { Logger } from "../../../logger/Logger"
import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { NamingStrategyInterface } from "../../../naming-strategy/NamingStrategyInterface"
import { AnyDriver } from "../driver"
import { DataSourceOptions } from "./data-source-options-types"

/**
 * Any DataSource. Helper type.
 *
 * @see CoreDataSource
 */
export type AnyDataSource = CoreDataSource<AnyDriver>

/**
 * DataSource is a main entry in the TypeORM-based application.
 * It is a main entry point to establish connections with a chosen database type and execute queries against it.
 * You can have multiple data sources connected to multiple databases in your application.
 */
export type CoreDataSource<Driver extends AnyDriver> = {
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
   * Working with driver used in this data source.
   */
  driver: Driver

  /**
   * Options.
   */
  options: DataSourceOptions<Driver>

  /**
   * Manager.
   */
  manager: Driver["manager"]

  /**
   * All entity metadatas that are registered for this connection.
   */
  entityMetadatas: EntityMetadata[] // if it will be typed, EntityMetadataList should be created like RepositoryList

  /**
   * Naming strategy used in the connection.
   */
  namingStrategy: NamingStrategyInterface

  /**
   * Logger used to log orm events.
   */
  logger: Logger

  /**
   * Initializes a data source connection.
   * This method should be called once on application bootstrap.
   * This method not necessarily creates database connection (depend on database type),
   * but it also can setup a connection pool with database to use.
   *
   * Returns self.
   */
  connect(): Promise<CoreDataSource<Driver>>

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
   *
   * @param dropBeforeSync If set to true then it drops the database with all its tables and data
   */
  synchronize(dropBeforeSync: boolean): Promise<void>

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
  createQueryRunner(): Driver["queryRunner"]

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
  //
}
