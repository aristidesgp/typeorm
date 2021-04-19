import { DriverTypes } from "../../driver"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = Types["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = Types["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Types, Entity>
} & Types["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = Types["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Types, Entity>
} & Types["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = Types["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Types, Entity>
} & Types["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = Types["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<
  Types extends DriverTypes,
  Entity extends AnyEntity
> = {
  where: WhereOptions<Types, Entity>
} & Types["unarchiveByOptions"]
