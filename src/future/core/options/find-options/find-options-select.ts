import { DriverTypes } from "../../driver"
import {
  AnyEntity,
  AnyEntityList,
  ColumnCompileType,
  EntityPropsWithModel,
  ReferencedEntity,
} from "../../entity"

/**
 * Schema for Selection, used for user to specify what he is going to "select" from the db.
 * In selection he is able to specify columns, relations and embeds to select.
 * Relations can be "selected completely" by simply specifying "true" to the whole object in the relation, e.g. { relation: true }.
 * Its also worth noting if no columns where specified in the selection, all entity columns will be selected,
 * e.g. for selection of user(id,name,photo,contacts) with selection set to { select: { photo: true } } -
 * returned result will have - "id", "name" columns and "photo" relation selected.
 *
 * Usage example:
 *
 * .find({
 *   select: {
 *     id: true,
 *     name: true,
 *     photo: {
 *       id: true,
 *       filename: true,
 *       album: true
 *     },
 *     profile: {
 *       bio: true
 *     }
 *   }
 * })
 */
export type FindOptionsSelect<
  Entities extends AnyEntityList,
  Entity extends AnyEntity
> = {
  [P in keyof Entity["columns"]]?: boolean
} &
  {
    [P in keyof Entity["relations"]]?:
      | boolean
      | FindOptionsSelect<Entities, ReferencedEntity<Entities, Entity, P>>
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsSelect<
      Entities,
      Entity["embeds"][P]
    >
  }

export type FindReturnTypeProperty<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  Selection, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  P extends keyof EntityPropsWithModel<Entity>,
  Property extends EntityPropsWithModel<Entity>[P]["property"],
  ParentPartiallySelected extends boolean
> = P extends string & keyof Entity["columns"] // if property is a column, just return it's type inferred from a driver column types defined in the entity
  ? ColumnCompileType<
      Entity["driver"]["types"],
      Entities,
      Entity["model"],
      P,
      Entity["columns"][P]
    >
  : P extends keyof Entity["embeds"] // if selected property is an embed, we just go recursively
  ? FindReturnType<
      Types,
      Entities,
      Entity["embeds"][Property],
      Selection[Property],
      ParentPartiallySelected
    >
  : P extends keyof Entity["relations"] // if selected property is relation
  ? Selection[Property] extends object // relation selection can be defined two ways: // 1. we can select some properties of the related object
    ? Entity["relations"][Property]["type"] extends
        | "many-to-many"
        | "one-to-many"
      ? FindReturnType<
          Types,
          Entities,
          ReferencedEntity<Entities, Entity, Property>,
          Selection[Property],
          false
        >[]
      : FindReturnType<
          Types,
          Entities,
          ReferencedEntity<Entities, Entity, Property>,
          Selection[Property],
          false
        >
    : Selection[Property] extends true // 2. we can select the whole related object (means its columns) by using relation: true
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? FindReturnType<
          Types,
          Entities,
          ReferencedEntity<Entities, Entity, Property>,
          {},
          false
        >[]
      : FindReturnType<
          Types,
          Entities,
          ReferencedEntity<Entities, Entity, Property>,
          {},
          false
        >
    : never
  : P extends keyof Entity["model"]["type"]
  ? Entity["model"]["type"][P]
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
export type EntitySelectionTruthyKeys<Entity extends AnyEntity, Selection> =
  | {
      [P in keyof Selection]: Selection[P] extends true
        ? P
        : Selection[P] extends object
        ? P
        : never
    }[keyof Selection]
  | Exclude<
      keyof Entity["model"]["type"],
      keyof (Entity["columns"] & Entity["relations"] & Entity["embeds"])
    >

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Entities, Entity>
> = keyof (Entity["columns"] &
  {
    [P in keyof Entity["relations"] as Selection[P] extends true
      ? P
      : Selection[P] extends object
      ? P
      : never]: true
  } &
  Entity["embeds"] &
  Entity["model"]["type"])

export type FindReturnType<
  Types extends DriverTypes,
  Entities extends AnyEntityList,
  Entity extends AnyEntity,
  Selection, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  ParentPartiallySelected extends boolean
> =
  // this case is possible in embed, when parent selected set of columns,
  // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ParentPartiallySelected extends true
    ? {
        [P in keyof EntityPropsWithModel<Entity> as P extends EntitySelectionTruthyKeys<
          Entity,
          Selection
        >
          ? P
          : never]: FindReturnTypeProperty<
          Types,
          Entities,
          Entity,
          Selection,
          P,
          EntityPropsWithModel<Entity>[P]["property"],
          true
        >
      }
    : // if no columns were specified in selection, it means we need to select every column
    OnlyColumnKeys<Selection, Entity> extends never
    ? {
        [P in keyof EntityPropsWithModel<Entity> as P extends EntitySelectionAllColumns<
          Types,
          Entities,
          Entity,
          Selection
        >
          ? P
          : never]: FindReturnTypeProperty<
          Types,
          Entities,
          Entity,
          Selection,
          P,
          EntityPropsWithModel<Entity>[P]["property"],
          false
        >
      }
    : // otherwise it means only set of columns were selected, and we should only select them
      {
        [P in keyof EntityPropsWithModel<Entity> as P extends EntitySelectionTruthyKeys<
          Entity,
          Selection
        >
          ? P
          : never]: FindReturnTypeProperty<
          Types,
          Entities,
          Entity,
          Selection,
          P,
          EntityPropsWithModel<Entity>[P]["property"],
          true
        >
      }
