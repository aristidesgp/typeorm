import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type FindOptionsSelect<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = /*{ "*"?: boolean } &*/ {
  [P in keyof Entity["columns"]]?: boolean // P extends keyof Entity["columns"] ? boolean : never
} &
  {
    [P in keyof Entity["relations"]]?:
      | boolean
      | FindOptionsSelect<
          Source,
          Source["driver"]["options"]["entities"][Entity["relations"][P]["reference"]]
        >
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsSelect<
      Source,
      Entity["embeds"][P]
    >
  }

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

/**
 * todo: also need to consider transformers
 */
export type ColumnCompileType<
  Entity extends AnyEntity,
  Property extends keyof Entity["columns"]
> = Entity["columns"][Property]["nullable"] extends true
  ?
      | Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]
      | null
  : Entity["driver"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]

export type FindReturnTypeProperty<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Source, Entity>, // | undefined,
  P extends keyof EntityProps<Entity>,
  Property extends EntityProps<Entity>[P]["property"],
  ParentPartiallySelected extends boolean
> =
  // if property is a column, just return it's type inferred from a driver column types defined in the entity
  P extends keyof Entity["columns"]
    ? ColumnCompileType<Entity, P>
    : // if selected property is an embed, we just go recursively
    P extends keyof Entity["embeds"]
    ? FindReturnType<
        Source,
        Entity["embeds"][Property],
        Selection[Property],
        ParentPartiallySelected
      >
    : // if selected property is relation
    P extends keyof Entity["relations"]
    ? // relation selection can be defined two ways:
      // 1. we can select some properties of the related object
      Selection[Property] extends object
      ? Entity["relations"][Property]["type"] extends
          | "many-to-many"
          | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
        ? FindReturnType<
            Source,
            Source["driver"]["options"]["entities"][Entity["relations"][Property]["reference"]],
            Selection[Property],
            false
          >[]
        : FindReturnType<
            Source,
            Source["driver"]["options"]["entities"][Entity["relations"][Property]["reference"]],
            Selection[Property],
            false
          >
      : // 2. we can select the whole related object (means its columns) by using relation: true
      Selection[Property] extends true
      ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
        ? FindReturnType<
            Source,
            Source["driver"]["options"]["entities"][Entity["relations"][Property]["reference"]],
            {},
            false
          >[]
        : FindReturnType<
            Source,
            Source["driver"]["options"]["entities"][Entity["relations"][Property]["reference"]],
            {},
            false
          >
      : never
    : never

export type OnlyColumnKeys<Selection, Entity extends AnyEntity> = {
  [P in keyof Selection]: Selection[P] extends true
    ? P extends keyof Entity["columns"]
      ? P
      : never
    : Selection[P] extends object
    ? P extends keyof Entity["embeds"]
      ? OnlyColumnKeys<Selection[P], Entity["embeds"][P]> extends never
        ? never
        : P
      : never
    : never
}[keyof Selection]

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionTruthyKeys<Selection> = {
  [P in keyof Selection]: Selection[P] extends true
    ? P
    : Selection[P] extends object
    ? P
    : never
}[keyof Selection]

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Source, Entity>
> = keyof (Entity["columns"] &
  {
    [P in keyof Entity["relations"] as Selection[P] extends true
      ? P
      : Selection[P] extends object
      ? P
      : never]: true
  } &
  Entity["embeds"])

export type FindReturnType<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Source, Entity>, // | undefined,
  ParentPartiallySelected extends boolean
> =
  // this case is possible in embed, when parent selected set of columns,
  // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ParentPartiallySelected extends true
    ? {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionTruthyKeys<Selection>
          ? P
          : never]: FindReturnTypeProperty<
          Source,
          Entity,
          Selection,
          P,
          EntityProps<Entity>[P]["property"],
          true
        >
      }
    : // if no columns were specified in selection, it means we need to select every column
    OnlyColumnKeys<Selection, Entity> extends never
    ? {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionAllColumns<
          Source,
          Entity,
          Selection
        >
          ? P
          : never]: FindReturnTypeProperty<
          Source,
          Entity,
          Selection,
          P,
          EntityProps<Entity>[P]["property"],
          false
        >
      }
    : // otherwise it means only set of columns were selected, and we should only select them
      {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionTruthyKeys<Selection>
          ? P
          : never]: FindReturnTypeProperty<
          Source,
          Entity,
          Selection,
          P,
          EntityProps<Entity>[P]["property"],
          true
        >
      }
