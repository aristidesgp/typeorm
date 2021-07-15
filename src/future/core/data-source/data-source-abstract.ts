import {ConnectionBase} from "../connection";
import {ManagerBase} from "../manager";
import {BaseDataSourceOptions} from "./data-source-options";
import {DataSourceTypes} from "./data-source-column-types";
import {CoreDataSource} from "./data-source-core-types";
import {nullAsAny} from "../util";

export interface DataSourceAbstractActions<
  Connection extends ConnectionBase,
  Manager extends ManagerBase<any>
> {

  connect(): Promise<void>
  afterEntityMetadataBuild?(): Promise<void>
  disconnect(): Promise<void>
  syncSchema(): Promise<void>
  dropEverything(): Promise<void>
  createConnection(): Connection
  createManager(): Manager
}

export class DataSourceAbstract<Options extends BaseDataSourceOptions,
  Manager extends ManagerBase<any>,
  Connection extends ConnectionBase,
  Types extends DataSourceTypes> implements CoreDataSource<Options,
  Manager,
  Connection,
  Types> {
  "@type" = "DataSource" as const
  "@connection" = nullAsAny()
  "@types" = nullAsAny()
  manager: Manager
  options: Options
  actions: DataSourceAbstractActions<Connection, Manager>
  isConnected = false
  entityMetadatas: []

  constructor(options: Options,
              actions: DataSourceAbstractActions<Connection, Manager>) {
    this.options = options
    this.actions = actions
    this.manager = actions.createManager()
  }

  async connect() {
    // TODO: establish connections with loggers, caching, etc., maybe use events?
    // TODO: figure out what to do with "migrationsRun" flag
    // NOTE: dropSchema is removed

    // if connection already established, simply return
    if (this.isConnected)
      return this

    // connect using given driver action
    await this.actions.connect()

    // set connected to true now
    this.isConnected = true

    // wrap into try/catch if something goes wrong next - we'll need to disconnect from db/pool
    try {
      // this.buildMetadatas()

      if (this.actions.afterEntityMetadataBuild) {
        await this.actions.afterEntityMetadataBuild()
      }

    } catch (err) {
      await this.disconnect()
      throw err
    }

    if (this.options.synchronize === true) {
      await this.synchronize()
    }

    // todo: add "connect" event
    return this
  }

  async disconnect() {
    // TODO: establish connections with loggers, caching, etc., maybe use events?
    // NOTE: disconnect is the name for "close" in previous TypeORM API

    if (!this.isConnected)
      throw new Error(`Connection isn't established, cannot disconnect.`)

    await this.actions.disconnect()
    this.isConnected = false

    // todo: add "disconnect" event
  }

  async synchronize(dropBeforeSync = false) {
    if (!this.isConnected)
      throw new Error(`Connection isn't established, cannot synchronize.`)

    if (dropBeforeSync)
      await this.actions.dropEverything()

    await this.actions.syncSchema()
  }

  createConnection() {
    return this.actions.createConnection()
  }
}
