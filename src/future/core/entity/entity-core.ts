import { AnyModel } from "../../../repository/model"
import { AnyDataSource } from "../data-source"
import {
  EntityColumnList,
  EntityMethods,
  EntityProperties,
} from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelation, EntityRelationList } from "./entity-relations"

/**
 * Represents any entity - entity schema or class-defined entity.
 */
export type AnyEntity = AnyEntitySchema | EntityClassInstance

/**
 * Entity class returning type, e.g. properties of "User", properties of "Photo", etc.
 */
export type EntityClassInstance = InstanceType<EntityClassDefinition>

/**
 * Entity class function, e.g. "User", "Photo", etc.
 */
export type EntityClassDefinition = new (...args: any) => any

/**
 * Any entity schema.
 */
export type AnyEntitySchema = EntitySchema<
  EntitySchemaType,
  AnyModel,
  EntityColumnList<AnyDataSource>,
  EntityRelationList,
  EntityEmbedList<AnyDataSource>,
  EntityMethods,
  EntityProperties<AnyDataSource>,
  EntityProperties<AnyDataSource>
>

/**
 * This type represents entity defined as "entity schema".
 * There are two ways of entity definition: entity schema and class.
 */
export interface EntitySchema<
  Type extends EntitySchemaType,
  Model extends AnyModel,
  Columns extends EntityColumnList<AnyDataSource>,
  Relations extends EntityRelationList,
  Embeds extends EntityEmbedList<AnyDataSource>,
  VirtualMethods extends EntityMethods,
  VirtualLazyProperties extends EntityProperties<AnyDataSource>,
  VirtualEagerProperties extends EntityProperties<AnyDataSource>
> {
  "@type": "Entity"
  type: Type
  model: Model
  virtualMethods: VirtualMethods
  virtualLazyProperties: VirtualLazyProperties
  virtualEagerProperties: VirtualEagerProperties
  columns: Columns
  relations: Relations
  embeds: Embeds
}

/**
 * There are two types of entity schemas:
 *
 * - default
 * - active-record
 *
 * active-record type adds special methods (like "save", "remove", etc.) to your entities.
 */
export type EntitySchemaType = "default" | "active-record"

/**
 * List of named entity definitions.
 */
export type AnyEntityList = {
  [name: string]: EntityReference
}

/**
 * Reference to some entity.
 * Entity schema is wrapped into function because of circular problems.
 */
export type EntityReference = (() => AnyEntitySchema) | EntityClassDefinition

/**
 * Extracts entity from entity reference.
 */
export type EntityFromReference<
  Reference extends EntityReference
> = Reference extends () => infer U
  ? U
  : Reference extends EntityClassDefinition
  ? InstanceType<Reference>
  : unknown

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 * Used only in entity schemas.
 */
export type RelationEntity<
  Entity extends AnyEntitySchema,
  RelationName extends keyof Entity["relations"]
> = Entity["relations"][RelationName] extends EntityRelation<any>
  ? ReturnType<Entity["relations"][RelationName]["reference"]>
  : never
