import { AnyDataSource, DataSourceEntity } from "../data-source"
import { AnyDriver } from "../driver"
import { EntityColumnList } from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelationList } from "./entity-relations"

/**
 * Represents any entity. Convenience type.
 */
export type AnyEntity = EntityCore<
  AnyDriver,
  EntityColumnList<AnyDriver>,
  EntityRelationList,
  EntityEmbedList<AnyDriver>
>

/**
 * Core entity.
 * Drivers must build their entities and return this interface.
 */
export interface EntityCore<
  Driver extends AnyDriver,
  Columns extends EntityColumnList<Driver>,
  Relations extends EntityRelationList,
  Embeds extends EntityEmbedList<Driver>
> {
  "@type": "Entity"
  driver: Driver
  columns: Columns
  relations: Relations
  embeds: Embeds
  columnsEmbeds: Columns & Embeds
  columnsEmbedsRelations: Columns & Embeds & Relations
}

/**
 * List of named entities.
 */
export type AnyEntityList = {
  [name: string]: AnyEntity
}

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 */
export type ReferencedEntity<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  RelationName extends keyof Entity["relations"]
> = Source["driver"]["options"]["entities"][Entity["relations"][RelationName]["reference"]]

/**
 * Entity reference can either be an entity name, either reference to entity declaration.
 */
export type EntityReference<Source extends AnyDataSource> =
  | keyof Source["driver"]["options"]["entities"]
  | DataSourceEntity<Source>

/**
 * Resolves given entity or entity name to the entity.
 * If given value is entity name, finds entity with such name and returns it.
 * If given value is entity itself, simply returns it.
 */
export type EntityPointer<
  Source extends AnyDataSource,
  Reference extends EntityReference<Source>
> = Reference extends keyof Source["driver"]["options"]["entities"]
  ? Source["driver"]["options"]["entities"][Reference]
  : Reference extends DataSourceEntity<Source>
  ? Reference
  : never
