import { AnyModel } from "../../../repository/model"
import { AnyDriver } from "../driver"
import {
  EntityColumnList,
  EntityMethods,
  EntityProperties,
} from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelation, EntityRelationList } from "./entity-relations"

export type AnyEntityCore = EntityCore<
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
 * Represents any entity. Convenience type.
 */
export type AnyEntity = AnyEntityCore | EntityInstance

export type EntityInstance = InstanceType<EntityClass>
export type EntityClass = new (...args: any) => any // & { driver: AnyDriver }

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

export type EntityType = "entity-schema" | "active-record" | "class"

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
export type EntityReference = (() => AnyEntityCore) | EntityClass

export type EntityFromReference<
  Reference extends EntityReference
> = Reference extends () => infer U
  ? U
  : Reference extends EntityClass
  ? InstanceType<Reference>
  : unknown

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 */
export type ReferencedEntity<
  Entity extends AnyEntityCore,
  RelationName extends keyof Entity["relations"]
> = Entity["relations"][RelationName] extends EntityRelation<any>
  ? ReturnType<Entity["relations"][RelationName]["reference"]>
  : never
