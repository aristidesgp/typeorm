import { AnyDataSource, DataSourceEntity } from "../../data-source"
import { FindOptionsWhere } from "../find-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = Source["driver"]["types"]["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = Source["driver"]["types"]["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  where: FindOptionsWhere<Source, Entity>
} & Source["driver"]["types"]["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = Source["driver"]["types"]["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  where: FindOptionsWhere<Source, Entity>
} & Source["driver"]["types"]["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = Source["driver"]["types"]["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  where: FindOptionsWhere<Source, Entity>
} & Source["driver"]["types"]["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = Source["driver"]["types"]["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  where: FindOptionsWhere<Source, Entity>
} & Source["driver"]["types"]["unarchiveByOptions"]
