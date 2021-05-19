import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = DataSource["types"]["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = DataSource["types"]["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  where: WhereOptions<DataSource, Entity>
} & DataSource["types"]["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = DataSource["types"]["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  where: WhereOptions<DataSource, Entity>
} & DataSource["types"]["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = DataSource["types"]["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  where: WhereOptions<DataSource, Entity>
} & DataSource["types"]["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = DataSource["types"]["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  where: WhereOptions<DataSource, Entity>
} & DataSource["types"]["unarchiveByOptions"]
