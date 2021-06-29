import { EntityMetadata } from "../../../metadata/EntityMetadata"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

export type SubscriberTypes = {
  [key: string]: (...args: any[]) => any
}

/**
 * Common subscriber types for most drivers.
 */
export type SubscriberCommonTypes<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  afterLoad: AfterLoadEvent<DataSource, Entity>
  beforeInsert: BeforeInsertEvent<DataSource, Entity>
  afterInsert: AfterInsertEvent<DataSource, Entity>
  beforeUpdate: BeforeUpdateEvent<DataSource, Entity>
  afterUpdate: AfterUpdateEvent<DataSource, Entity>
  beforeDelete: BeforeDeleteEvent<DataSource, Entity>
  afterDelete: AfterDeleteEvent<DataSource, Entity>
}

/**
 * Subscriber types for drivers supporting transactions.
 */
export type SubscriberTransactionalTypes<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  beforeTransactionStart: BeforeTransactionStart<DataSource, Entity>
  afterTransactionStart: AfterTransactionStart<DataSource, Entity>
  beforeTransactionCommit: BeforeTransactionCommit<DataSource, Entity>
  afterTransactionCommit: AfterTransactionCommit<DataSource, Entity>
  beforeTransactionRollback: BeforeTransactionRollback<DataSource, Entity>
  afterTransactionRollback: AfterTransactionRollback<DataSource, Entity>
}

export interface CommonEntityEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  dataSource: DataSource
  metadata: EntityMetadata
}

export interface AfterLoadEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeInsertEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterInsertEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeUpdateEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterUpdateEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeDeleteEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterDeleteEvent<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeTransactionStart<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterTransactionStart<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeTransactionCommit<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterTransactionCommit<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface BeforeTransactionRollback<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}

export interface AfterTransactionRollback<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> extends CommonEntityEvent<DataSource, Entity> {}
