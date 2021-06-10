import { AnyModel } from "../../../repository/model"
import { AnyDataSource } from "../data-source"
import { EntityVirtuals } from "../selection"
import { EntityColumnList } from "./entity-columns"
import { EntityEmbedList } from "./entity-embeds"
import { EntityRelation, EntityRelationList } from "./entity-relations"

/**
 * Represents any entity - entity schema or class-defined entity.
 */
export type AnyEntity = AnyEntitySchema | EntityClassInstance

/**
 * Entity class returning type, e.g. typeof = new Entity()
 */
export type EntityClassInstance = InstanceType<EntityClassDefinition>

/**
 * Entity class function, e.g. typeof = class Entity
 */
export type EntityClassDefinition = new (...args: any) => any

/**
 * Any entity schema.
 * Entity schema is a one way of entity definition.
 */
export type AnyEntitySchema = EntitySchema<
  EntitySchemaType,
  AnyModel,
  EntityColumnList<AnyDataSource>,
  EntityRelationList,
  EntityEmbedList<AnyDataSource>,
  EntityVirtuals<AnyDataSource, AnyEntity>
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
  Virtuals extends EntityVirtuals<AnyDataSource, AnyEntity>
> {
  "@type": "Entity"
  type: Type
  model: Model
  columns: Columns
  relations: Relations
  embeds: Embeds
  virtuals: Virtuals
}

/**
 * There are two types of entity schemas:
 *
 * - simple
 * - advanced
 *
 * "simple" type is a default type and simply return objects / models as they are.
 * "advanced" type adds special methods (like "save", "remove", etc.) to your entities.
 */
export type EntitySchemaType = "simple" | "advanced"

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
