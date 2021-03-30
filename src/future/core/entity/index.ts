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
