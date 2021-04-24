import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  Entity extends AnyEntity
> = Entity["driver"]["types"]["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  Entity extends AnyEntity
> = Entity["driver"]["types"]["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<Entity extends AnyEntity> = {
  where: WhereOptions<Entity>
} & Entity["driver"]["types"]["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  Entity extends AnyEntity
> = Entity["driver"]["types"]["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<Entity extends AnyEntity> = {
  where: WhereOptions<Entity>
} & Entity["driver"]["types"]["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  Entity extends AnyEntity
> = Entity["driver"]["types"]["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<Entity extends AnyEntity> = {
  where: WhereOptions<Entity>
} & Entity["driver"]["types"]["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  Entity extends AnyEntity
> = Entity["driver"]["types"]["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<Entity extends AnyEntity> = {
  where: WhereOptions<Entity>
} & Entity["driver"]["types"]["unarchiveByOptions"]
