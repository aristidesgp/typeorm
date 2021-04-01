import { DeepPartial } from "../../../common/DeepPartial"
import { AnyDataSource } from "../data-source"
import { AnyDriver } from "../driver"
import { EntityProps, FindReturnType } from "../find-options"
import { MoreThanOneElement, ValueOf } from "../util"

export type AnyEntity = CoreEntity<
  AnyDriver,
  EntityColumns<AnyDriver>,
  EntityRelations,
  EntityEmbeds<AnyDriver>
>

export type CoreEntity<
  Driver extends AnyDriver,
  Columns extends EntityColumns<Driver>,
  Relations extends EntityRelations,
  Embeds extends EntityEmbeds<Driver>
> = {
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

export type EntityColumns<Driver extends AnyDriver> = {
  [key: string]: {
    primary?: boolean
    type: keyof Driver["types"]["columnTypes"]
    nullable?: boolean
    array?: boolean
    transform?: {
      from(value: any): any
      to(value: any): any
    }
  }
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
  Entity extends AnyEntity,
  Property extends keyof Entity["columns"]
> = Entity["columns"][Property]["array"] extends true
  ? Entity["columns"][Property]["nullable"] extends true
    ?
        | Entity["driver"]["types"]["columnTypes"][Entity["columns"][Property]["type"]]["type"][]
        | null
    : Entity["driver"]["types"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
  : Entity["columns"][Property]["nullable"] extends true
  ?
      | Entity["driver"]["types"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
      | null
  : Entity["driver"]["types"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]

/**
 * Returns primary column names of a given entity.
 *
 * For example for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true}, age: { type: "int" }}
 * This function will return "id" | "name" type.
 *
 * todo: add support for primaries in embeds
 */
export type EntityPrimaryColumnNames<Entity extends AnyEntity> = {
  [P in keyof Entity["columns"]]: Entity["columns"][P]["primary"] extends true
    ? P
    : never
}[string & keyof Entity["columns"]]

/**
 * Mixed value map consist of primary columns and their values of the given entity.
 * It is *mixed* because if entity has only one primary column,
 * its type will be directly equal to this primary column type.
 * But if entity has multiple primary columns, its type will be equal to the object consist
 * of these properties and their values.
 *
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" }}
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" }}
 *    value will be: string
 *
 * todo: add support for primaries in embeds
 */
export type EntityPrimaryColumnMixedValueMap<
  Entity extends AnyEntity
> = MoreThanOneElement<EntityPrimaryColumnNames<Entity>> extends never
  ? ColumnCompileType<Entity, EntityPrimaryColumnNames<Entity>>
  : {
      [P in EntityPrimaryColumnNames<Entity>]: ColumnCompileType<Entity, P>
    }

/**
 * Primary columns and their values of the given entity.
 * Unlike *mixed* it doesn't flatten object if there is only one primary column in the entity.
 *
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" } }
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" } }
 *    value will be: { id: string }
 *
 * todo: add support for primaries in embeds
 */
export type EntityPrimaryColumnValueMap<Entity extends AnyEntity> = {
  [P in EntityPrimaryColumnNames<Entity>]: ColumnCompileType<Entity, P>
}

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
