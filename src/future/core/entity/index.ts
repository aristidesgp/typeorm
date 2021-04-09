import { DeepPartial } from "../../../common/DeepPartial"
import { AnyDataSource, DataSourceEntity } from "../data-source"
import { AnyDriver } from "../driver"
import { FindReturnType } from "../options"
import { SelectAll } from "../selection"
import {
  FlatTypeHint,
  ForceCastIfNoKeys,
  NonNever,
  UndefinedToOptional,
  ValueOf,
} from "../util"

export type AnyEntity = CoreEntity<
  AnyDriver,
  EntityColumns<AnyDriver>,
  EntityRelations,
  EntityEmbeds<AnyDriver>
>

export interface CoreEntity<
  Driver extends AnyDriver,
  Columns extends EntityColumns<Driver>,
  Relations extends EntityRelations,
  Embeds extends EntityEmbeds<Driver>
> {
  "@type": "Entity"
  driver: Driver
  columns: Columns
  relations: Relations
  embeds: Embeds
}

/**
 * List of named entities.
 */
export type AnyEntityList = {
  [name: string]: AnyEntity
}

export type EntityColumn<Driver extends AnyDriver> = {
  primary?: boolean
  type: keyof Driver["types"]["columnTypes"]
  generated?: boolean
  nullable?: boolean
  array?: boolean
  default?: any
  transform?: {
    from(value: any): any
    to(value: any): any
  }
}

export type EntityColumns<Driver extends AnyDriver> = {
  [key: string]: EntityColumn<Driver>
}

export type EntityRelationTypes =
  | "one-to-one"
  | "many-to-one"
  | "one-to-many"
  | "many-to-many"

export type EntityRelationItem =
  | {
      type: "one-to-many"
      inverse: string
      reference: string
    }
  | {
      type: "many-to-many"
      inverse?: string
      reference: string
    }
  | {
      type: "one-to-one"
      inverse?: string
      reference: string
    }
  | {
      type: "many-to-one"
      inverse?: string
      reference: string
    }

export type EntityRelations = {
  [key: string]: EntityRelationItem
}

export type EntityEmbeds<Driver extends AnyDriver> = {
  [key: string]: AnyEntity
}

/**
 * Extracts entity that was referenced in a given entity relation.
 * For example for ReferencedEntity<Any, User, "avatar"> returns "Photo" entity.
 */
export type ReferencedEntity<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  Property extends keyof Entity["relations"]
> = Source["driver"]["options"]["entities"][Entity["relations"][Property]["reference"]]

/**
 * Gets a real compile-time type of the column defined in the entity.
 *
 * todo: also need to consider transformers
 */
export type ColumnCompileType<
  Driver extends AnyDriver,
  Column extends EntityColumn<Driver>
> = Column["array"] extends true
  ? Column["nullable"] extends true
    ? Driver["types"]["columnTypes"][Column["type"]]["type"][] | null
    : Driver["types"]["columnTypes"][Column["type"]]["type"]
  : Column["nullable"] extends true
  ? Driver["types"]["columnTypes"][Column["type"]]["type"] | null
  : Driver["types"]["columnTypes"][Column["type"]]["type"]

/**
 * Returns columns value map with "generated" set to true.
 *
 * Columns value map is an object where every column name is followed by a computed column type.
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" } }
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" } }
 *    value will be: { id: string }
 */
export type EntityGeneratedColumnValueMap<Entity extends AnyEntity> = NonNever<
  {
    [P in keyof EntityProps<Entity>]: P extends keyof Entity["columns"]
      ? Entity["columns"][P]["generated"] extends true
        ? ColumnCompileType<Entity["driver"], Entity["columns"][P]>
        : never
      : P extends keyof Entity["embeds"]
      ? EntityGeneratedColumnValueMap<Entity["embeds"][P]>
      : never
  }
>

/**
 * Returns columns value map with "default" value set.
 *
 * Columns value map is an object where every column name is followed by a computed column type.
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" } }
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" } }
 *    value will be: { id: string }
 */
export type EntityDefaultColumnValueMap<Entity extends AnyEntity> = NonNever<
  {
    [P in keyof EntityProps<Entity>]: P extends keyof Entity["columns"]
      ? Entity["columns"][P]["default"] extends string | number | boolean
        ? ColumnCompileType<Entity["driver"], Entity["columns"][P]>
        : never
      : P extends keyof Entity["embeds"]
      ? EntityDefaultColumnValueMap<Entity["embeds"][P]>
      : never
  }
>

/**
 * Extracts all entity columns and columns from its embeds into a single string literal type.
 * Example: for { id, name, profile: { bio, age, photos }} it will return a following type:
 * "id" | "name" | "profile.bio" | "profile.age"
 */
export type EntityColumnPaths<
  Entity extends AnyEntity,
  Parent extends string = "",
  Deepness extends string = "."
> = ValueOf<
  {
    [P in keyof EntityProps<Entity>]?: P extends string &
      keyof Entity["columns"]
      ? `${Parent}${P}`
      : P extends string & keyof Entity["embeds"]
      ? EntityColumnPaths<Entity["embeds"][P], `${Parent}${P}.`, `${Deepness}.`>
      : never
  }
>

/**
 * Returns a type of value map of entity primary columns.
 * Returns "unknown" if no primary keys found in entity.
 *
 * Examples:
 * - { id1 } it will return a following type:
 *   { id1: number }
 * - { id1, id2 } it will return a following type:
 *   { id1: number, id2: string }
 * - { id1, name, profile: { id2, bio, age, photos }} it will return a following type:
 *   { id1: number, { profile: { id2: string }}}
 * - { name, profile: { bio, age, photos }} it will return a following type:
 *   unknown
 *
 * Implementation notes:
 *  - we use ForceCastIfNoKeys to return "unknown" if object was empty
 *  - we use FlatTypeHint to return "clean type" for type hinting purpose
 *  - we use EntityPrimaryColumnValueMapAsCondition helper to simply code a bit
 */
export type EntityPrimariesValueMap<
  Entity extends AnyEntity,
  Deepness extends string = "."
> = ForceCastIfNoKeys<
  FlatTypeHint<
    {
      [P in EntityColumnAndEmbedNames<Entity> as EntityPrimariesValueMapAsCondition<
        Entity,
        P
      > extends true
        ? P
        : never]: P extends keyof Entity["columns"]
        ? ColumnCompileType<Entity["driver"], Entity["columns"][P]>
        : P extends keyof Entity["embeds"]
        ? EntityPrimariesValueMap<Entity["embeds"][P], `${Deepness}.`>
        : never
    }
  >,
  unknown
>

/**
 * Returns all column names and embed names for a given entity.
 * Helper type.
 */
export type EntityColumnAndEmbedNames<
  Entity extends AnyEntity
> = keyof (Entity["columns"] & Entity["embeds"])

/**
 * Returns all primary column names of a given entity.
 * Returns only primary column names of a "first" level of entity - only from columns.
 * Does not return primary column names from the entity embeds.
 */
export type EntityColumnsPrimaryNames<Entity extends AnyEntity> = keyof {
  [P in keyof Entity["columns"] as Entity["columns"][P]["primary"] extends true
    ? P
    : never]: true
}

/**
 * Helper type for a EntityPrimariesValueMap type.
 * For a given Key (entity column name OR entity embed name)
 * returns if entity column name is primary OR if entity embed name contains a primary.
 *
 * Implementation notes:
 *  - Deepness is used because otherwise compiler goes recursive and becomes slow
 *  - check for EntityColumnsPrimaryNames is used to exclude empty embeds without primaries
 */
export type EntityPrimariesValueMapAsCondition<
  Entity extends AnyEntity,
  Key extends EntityColumnAndEmbedNames<Entity>,
  Deepness extends string = "."
> = Key extends keyof Entity["columns"]
  ? Entity["columns"][Key]["primary"] extends true
    ? true
    : false
  : Key extends keyof Entity["embeds"]
  ? Deepness extends ".........."
    ? false
    : EntityColumnsPrimaryNames<Entity["embeds"][Key]> extends ""
    ? false
    : true
  : false

/**
 * Type signature of a given entity.
 */
export type EntityModel<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = FindReturnType<Source, Entity, {}, false>

/**
 * Partially type signature of a given entity.
 */
export type EntityModelPartial<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = DeepPartial<FindReturnType<Source, Entity, {}, false>>

export type EntityModelForInsertColumn<
  Column extends EntityColumn<AnyDriver>,
  Type
> = Column["default"] extends string | number | boolean
  ? Type | undefined
  : Column["generated"] extends true
  ? Type | undefined
  : Column["nullable"] extends true
  ? Type | undefined
  : Type

/**
 * Partially type signature of a given entity.
 */
export type EntityModelForInsert<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = NonNever<
  UndefinedToOptional<
    {
      [P in keyof EntityProps<Entity>]: P extends keyof Entity["columns"]
        ? EntityModelForInsertColumn<
            Entity["columns"][P],
            ColumnCompileType<Source["driver"], Entity["columns"][P]>
          >
        : P extends keyof Entity["embeds"]
        ? EntityModelForInsert<Source, Entity["embeds"][P]>
        : P extends keyof Entity["embeds"]
        ? EntityModelForInsert<Source, Entity["embeds"][P]>
        : never
    }
  >
>

/**
 * Merges generated columns, default columns into given partial entity model.
 */
export type EntityModelJustInserted<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>,
  Model //  extends EntityModelPartial<Source, Entity>
> = Model &
  FindReturnType<
    Source,
    Entity,
    SelectAll<
      EntityGeneratedColumnValueMap<Entity> &
        EntityDefaultColumnValueMap<Entity>
    >,
    false
  >
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

export type EntityProps<Entity extends AnyEntity> = {
  [P in keyof Entity["columns"]]: {
    type: "column"
    property: P
  }
} &
  {
    [P in keyof Entity["relations"]]: {
      type: "relation"
      property: P
    }
  } &
  {
    [P in keyof Entity["embeds"]]: {
      type: "embed"
      property: P
    }
  }
