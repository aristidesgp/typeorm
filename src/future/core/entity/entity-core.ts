import { AnyModel } from "../../../repository/model"
import { AnyDriver } from "../driver"
import {
  EntityColumnList,
  EntityMethods,
  EntityProperties,
} from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelation, EntityRelationList } from "./entity-relations"

export type AnyEntityFactory = () => AnyEntity

/**
 * Represents any entity. Convenience type.
 */
export type AnyEntity = EntityCore<
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

export type AnyRepositoryList = {
  [entityName: string]: any
}

export interface EntityCollection<Entities extends AnyEntityList> {
  "@type": "EntityCollection"
  entities: Entities
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
  Entity extends AnyEntity,
  RelationName extends keyof Entity["relations"]
> = Entity["relations"][RelationName] extends EntityRelation<any>
  ? ReturnType<Entity["relations"][RelationName]["reference"]>
  : never
/* Entity["relations"][RelationName]["reference"] extends string
  ? Entities[Entity["relations"][RelationName]["reference"]]
  :*/

/**
 * Entity reference can either be an entity name, either reference to entity declaration.

export type EntityReference<Entities extends AnyEntityList> =
  | keyof Entities
  | ValueOf<Entities>
  | (() => ValueOf<Entities>) */

/**
 * Resolves given entity or entity name to the entity.
 * If given value is entity name, finds entity with such name and returns it.
 * If given value is entity itself, simply returns it.

export type EntityPointer<
  Reference extends EntityReference<Entities>
> = Reference extends AnyEntity
  ? Entities[Reference]
  : Reference extends ValueOf<Entities>
  ? Reference
  : Reference extends () => infer U
  ? U
  : never */
