import { AnyDriver } from "../../driver"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Driver["types"]["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Driver["types"]["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Driver, Entity>
} & Driver["types"]["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Driver["types"]["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Driver, Entity>
} & Driver["types"]["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Driver["types"]["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Driver, Entity>
} & Driver["types"]["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = Driver["types"]["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Driver, Entity>
} & Driver["types"]["unarchiveByOptions"]
