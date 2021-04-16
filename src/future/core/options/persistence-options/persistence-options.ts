import { DriverTypes } from "../../driver"
import { AnyEntityList } from "../../entity"
import { ValueOf } from "../../util"
import { WhereOptions } from "../where-options"

/**
 * Entity insert options.
 */
export type InsertOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = Types["insertOptions"]

/**
 * Entity update options.
 */
export type UpdateOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = Types["updateOptions"]

/**
 * Entity update by options.
 */
export type UpdateByOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = {
  where: WhereOptions<Types, Entities, Entity>
} & Types["updateByOptions"]

/**
 * Entity delete options.
 */
export type DeleteOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = Types["deleteOptions"]

/**
 * Entity delete by options.
 */
export type DeleteByOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = {
  where: WhereOptions<Types, Entities, Entity>
} & Types["deleteByOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = Types["archiveOptions"]

/**
 * Archive (soft-remove) options.
 */
export type ArchiveByOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = {
  where: WhereOptions<Types, Entities, Entity>
} & Types["archiveByOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = Types["unarchiveOptions"]

/**
 * Entities unarchive options.
 */
export type UnarchiveByOptions<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends ValueOf<Entities>
> = {
  where: WhereOptions<Types, Entities, Entity>
} & Types["unarchiveByOptions"]
