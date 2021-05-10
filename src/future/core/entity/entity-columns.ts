import { AnyModel } from "../../../repository/model"
import { AnyDriver, DriverTypes } from "../driver"
import { FlatTypeHint, ForceCastIfNoKeys, NonNever, ValueOf } from "../util"
import { AnyEntity, AnyEntitySchema } from "./entity-core"
import { EntityProps } from "./entity-utils"

/**
 * This type is used to define entity column properties.
 */
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

/**
 * List of columns defined for some entity.
 */
export type EntityColumnList<Driver extends AnyDriver> = {
  [key: string]: EntityColumn<Driver>
}

export type EntityPropertiesItem<Driver extends AnyDriver> = (
  manager: Driver["manager"],
) => any

export type EntityProperties<Driver extends AnyDriver> = {
  [name: string]: EntityPropertiesItem<Driver>
}

export type EntityMethods = {
  [name: string]: any
}

/**
 * Gets a real compile-time type of the column defined in the entity.
 *
 * todo: also need to consider transformers
 *       also add support for manually specified types (maybe through the function)
 */
export type ColumnCompileType<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  ColumnName extends string
> = Entity extends AnyEntitySchema
  ? HasEntityModelColumnType<Entity["model"], ColumnName> extends true
    ? Entity["columns"][ColumnName]["array"] extends true
      ? Entity["columns"][ColumnName]["nullable"] extends true
        ? Entity["model"]["type"][ColumnName][] | null
        : Entity["model"]["type"][ColumnName]
      : Entity["columns"][ColumnName]["nullable"] extends true
      ? Entity["model"]["type"][ColumnName] | null
      : Entity["model"]["type"][ColumnName]
    : Entity["columns"][ColumnName]["array"] extends true
    ? Entity["columns"][ColumnName]["nullable"] extends true
      ?
          | Driver["types"]["columnTypes"][Entity["columns"][ColumnName]["type"]]["type"][]
          | null
      : Driver["types"]["columnTypes"][Entity["columns"][ColumnName]["type"]]["type"]
    : Entity["columns"][ColumnName]["nullable"] extends true
    ?
        | Driver["types"]["columnTypes"][Entity["columns"][ColumnName]["type"]]["type"]
        | null
    : Driver["types"]["columnTypes"][Entity["columns"][ColumnName]["type"]]["type"]
  : ColumnName extends keyof Entity
  ? Entity[ColumnName]
  : unknown

/**
 * Checks if entity model has given property name defined.
 */
export type HasEntityModelColumnType<
  Model extends AnyModel,
  PropertyName extends string
> = Model["type"] extends object
  ? PropertyName extends string & keyof Model["type"]
    ? true
    : false
  : false

/**
 * Returns object consist of columns and their types based on a given entity column names.
 * Careful! Marks column compile types as non-nullable.
 * Such design was chosen because of the requirements where it is currently used.
 */
export type EntityColumnTypeMapByNames<
  Driver extends AnyDriver,
  Entity extends AnyEntitySchema,
  ColumnNames extends string
> = FlatTypeHint<
  {
    [P in ColumnNames]: P extends keyof Entity["columns"]
      ? NonNullable<ColumnCompileType<Driver, Entity, P>>
      : unknown
  }
>

/**
 * Returns columns type map with columns where "generated" set to true.
 *
 * Columns type map is an object where every column name is followed by a computed column type.
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" } }
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" } }
 *    value will be: { id: string }
 */
export type EntityGeneratedColumnTypeMap<
  Driver extends AnyDriver,
  Entity extends AnyEntitySchema
> = NonNever<
  {
    [P in keyof EntityProps<Entity>]: P extends string & keyof Entity["columns"]
      ? Entity["columns"][P]["generated"] extends true
        ? ColumnCompileType<Driver, Entity, P>
        : never
      : P extends keyof Entity["embeds"]
      ? EntityGeneratedColumnTypeMap<Driver, Entity["embeds"][P]>
      : never
  }
>

/**
 * Returns columns type map with columns where "default" is set.
 *
 * Columns type map is an object where every column name is followed by a computed column type.
 * Examples:
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar", primary: true }, age: { type: "int" } }
 *    value will be: { id: string, name: string }
 *
 *  - for { id: { type: "varchar", primary: true }, name: { "varchar" }, age: { type: "int" } }
 *    value will be: { id: string }
 */
export type EntityDefaultColumnTypeMap<
  Driver extends AnyDriver,
  Entity extends AnyEntitySchema
> = NonNever<
  {
    [P in keyof EntityProps<Entity>]: P extends string & keyof Entity["columns"]
      ? Entity["columns"][P]["default"] extends string | number | boolean
        ? ColumnCompileType<Driver, Entity, P>
        : never
      : P extends keyof Entity["embeds"]
      ? EntityDefaultColumnTypeMap<Driver, Entity["embeds"][P]>
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
> = Entity extends AnyEntitySchema
  ? ValueOf<
      {
        [P in keyof EntityProps<Entity>]?: P extends string &
          keyof Entity["columns"]
          ? `${Parent}${P}`
          : P extends string & keyof Entity["embeds"]
          ? EntityColumnPaths<
              Entity["embeds"][P],
              `${Parent}${P}.`,
              `${Deepness}.`
            >
          : never
      }
    >
  : string

/**
 * Returns a type map entity columns with primary set to true.
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
export type EntityPrimaryColumnTypeMap<
  Driver extends AnyDriver,
  Entity extends AnyEntity,
  Deepness extends string = "."
> = Entity extends AnyEntitySchema
  ? ForceCastIfNoKeys<
      FlatTypeHint<
        {
          [P in keyof (Entity["columns"] &
            Entity["embeds"]) as EntityPrimariesValueMapAsCondition<
            Entity,
            P
          > extends true
            ? P
            : never]: P extends string & keyof Entity["columns"]
            ? ColumnCompileType<Driver, Entity, P>
            : P extends keyof Entity["embeds"]
            ? EntityPrimaryColumnTypeMap<
                Driver,
                Entity["embeds"][P],
                `${Deepness}.`
              >
            : never
        }
      >,
      unknown
    >
  : unknown

/**
 * Returns all primary column names of a given entity.
 * Returns only primary column names of a "first" level of entity - only from columns.
 * Does not return primary column names from the entity embeds.
 */
export type EntityColumnsPrimaryNames<Entity extends AnyEntitySchema> = keyof {
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
  Entity extends AnyEntitySchema,
  Key extends keyof (Entity["columns"] & Entity["embeds"]),
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
