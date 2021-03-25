import { AnyDriverTypes, DriverTypes } from "../driver"

export type AnyEntity = Entity<
  any,
  EntityColumns<AnyDriverTypes>,
  EntityRelations,
  EntityEmbeds<AnyDriverTypes>
>

export type Entity<
  GivenDriverTypes extends DriverTypes<any>,
  Columns extends EntityColumns<AnyDriverTypes>,
  Relations extends EntityRelations,
  Embeds extends EntityEmbeds<AnyDriverTypes>
> = {
  "@type": "Entity"
  driverTypes: GivenDriverTypes
  columns: Columns
  relations: Relations
  embeds: Embeds
}

/**
 * List of named entities.
 */
export type EntityList = {
  [name: string]: AnyEntity
}

export type EntityColumns<DriverTypes extends AnyDriverTypes> = {
  [key: string]: {
    type: keyof DriverTypes["columnTypes"]
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

export type EntityEmbeds<DriverTypes extends AnyDriverTypes> = {
  [key: string]: AnyEntity
}
