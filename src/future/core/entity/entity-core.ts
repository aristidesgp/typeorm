import { AnyModel } from "../../../repository/model"
import { AnyDriver } from "../driver"
import {
  EntityColumnList,
  EntityMethods,
  EntityProperties,
} from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelation, EntityRelationList } from "./entity-relations"

/**
 * Represents any entity. Convenience type.
 */
export type AnyEntity = EntityCore<
  EntityType,
  AnyDriver,
  AnyModel,
  EntityColumnList<AnyDriver>,
  EntityRelationList,
  EntityEmbedList<AnyDriver>,
  EntityMethods,
  EntityProperties<AnyDriver>,
  EntityProperties<AnyDriver>
>

/**
 * Core entity.
 * Drivers must build their entities and return this interface.
 */
export interface EntityCore<
  Type extends EntityType,
  Driver extends AnyDriver,
  Model extends AnyModel,
  Columns extends EntityColumnList<Driver>,
  Relations extends EntityRelationList,
  Embeds extends EntityEmbedList<Driver>,
  VirtualMethods extends EntityMethods,
  VirtualLazyProperties extends EntityProperties<Driver>,
  VirtualEagerProperties extends EntityProperties<Driver>
> {
  "@type": "Entity"
  type: Type
  driver: Driver
  model: Model
  virtualMethods: VirtualMethods
  virtualLazyProperties: VirtualLazyProperties
  virtualEagerProperties: VirtualEagerProperties
  columns: Columns
  relations: Relations
  embeds: Embeds
  columnsEmbeds: Columns & Embeds
  columnsEmbedsRelations: Columns & Embeds & Relations
}

export type EntityType = "classic" | "active-record"

/**
 * List of named entities.
 */
export type AnyEntityList = {
  [name: string]: EntityReference
}

/**
 * Function that returns entity.
 * Used for referencing entities because of circular problems.
 */
export type EntityReference = () => AnyEntity

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 */
export type ReferencedEntity<
  Entity extends AnyEntity,
  RelationName extends keyof Entity["relations"]
> = Entity["relations"][RelationName] extends EntityRelation<any>
  ? ReturnType<Entity["relations"][RelationName]["reference"]>
  : never
