import { AnyDataSource } from "../data-source"
import { AnyDriver } from "../driver"

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
    type: keyof Driver["columnTypes"]
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
        | Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"][]
        | null
    : Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
  : Entity["columns"][Property]["nullable"] extends true
  ?
      | Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
      | null
  : Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
