import {
  AnyEntity,
  ColumnCompileType,
  EntityPropertiesItem,
  EntityPropsMode,
  EntityPropsWithModel,
  ReferencedEntity,
} from "../../entity"
import { ForceCastIfExtends } from "../../util"

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
export type FindOptionsSelect<Entity extends AnyEntity> = {
  [P in keyof Entity["columns"]]?: true | false
} &
  {
    [P in keyof Entity["virtualLazyProperties"]]?: true | false
  } &
  {
    [P in keyof Entity["relations"]]?:
      | true
      | false
      | (object & FindOptionsSelect<ReferencedEntity<Entity, P>>)
  } &
  {
    [P in keyof Entity["embeds"]]?: object &
      FindOptionsSelect<Entity["embeds"][P]>
  }

export type FindReturnTypeProperty<
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Entity>,
  P, // extends string, // & keyof EntityPropsWithModel<Entity, any>,
  // Property extends EntityPropsWithModel<Entity, any>[P]["property"],
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = P extends string & keyof Entity["columns"] // if property is a column, just return it's type inferred from a driver column types defined in the entity
  ? ColumnCompileType<Entity, P>
  : P extends keyof Entity["embeds"] // if selected property is an embed, we just go recursively
  ? FindReturnType<
      Entity["embeds"][P],
      Selection[string & P] extends object ? Selection[string & P] : {},
      ParentPartiallySelected,
      PropsMode
    >
  : P extends keyof Entity["relations"] // if selected property is relation
  ? Selection[P] extends object // relation selection can be defined two ways: // 1. we can select some properties of the related object
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many"
      ? FindReturnType<
          ReferencedEntity<Entity, P>,
          Selection[string & P] extends object ? Selection[string & P] : {},
          false,
          PropsMode
        >[]
      : FindReturnType<
          ReferencedEntity<Entity, P>,
          Selection[string & P] extends object ? Selection[string & P] : {},
          false,
          PropsMode
        >
    : Selection[P] extends true // 2. we can select the whole related object (means its columns) by using relation: true
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? FindReturnType<ReferencedEntity<Entity, P>, {}, false, PropsMode>[]
      : FindReturnType<ReferencedEntity<Entity, P>, {}, false, PropsMode>
    : never
  : P extends keyof Entity["model"]["type"]
  ? Entity["model"]["type"][P]
  : P extends keyof Entity["virtualMethods"]
  ? Entity["virtualMethods"][P]
  : P extends keyof Entity["virtualLazyProperties"]
  ? ReturnType<
      ForceCastIfExtends<
        Entity["virtualLazyProperties"][P],
        EntityPropertiesItem<any>
      >
    > extends Promise<infer U>
    ? U
    : ReturnType<
        ForceCastIfExtends<
          Entity["virtualLazyProperties"][P],
          EntityPropertiesItem<any>
        >
      >
  : P extends keyof Entity["virtualEagerProperties"]
  ? ReturnType<
      ForceCastIfExtends<
        Entity["virtualEagerProperties"][P],
        EntityPropertiesItem<any>
      >
    > extends Promise<infer U>
    ? U
    : ReturnType<
        ForceCastIfExtends<
          Entity["virtualEagerProperties"][P],
          EntityPropertiesItem<any>
        >
      >
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
export type EntitySelectionTruthyKeys<
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Entity>
> =
  | {
      [P in keyof Selection]: Selection[P] extends true
        ? P
        : Selection[P] extends object
        ? P
        : never
    }[keyof Selection]
  | keyof Entity["virtualEagerProperties"]
  | keyof Entity["virtualMethods"]

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Entity>
> = keyof (Entity["columns"] &
  {
    [P in keyof Entity["relations"] as Selection[P] extends true
      ? P
      : Selection[P] extends object
      ? P
      : never]: true
  } &
  Entity["embeds"] &
  Entity["virtualEagerProperties"] &
  Entity["virtualMethods"])

export type FindReturnType<
  Entity extends AnyEntity,
  Selection extends FindOptionsSelect<Entity>, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> =
  // this case is possible in embed, when parent selected set of columns,
  // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ParentPartiallySelected extends true
    ? {
        [P in keyof EntityPropsWithModel<
          Entity,
          PropsMode
        > as P extends EntitySelectionTruthyKeys<Entity, Selection>
          ? P
          : never]: FindReturnTypeProperty<
          Entity,
          Selection,
          P,
          true,
          PropsMode
        >
      }
    : // if no columns were specified in selection, it means we need to select every column
    OnlyColumnKeys<Selection, Entity> extends never
    ? {
        [P in keyof EntityPropsWithModel<
          Entity,
          PropsMode
        > as P extends EntitySelectionAllColumns<Entity, Selection>
          ? P
          : never]: FindReturnTypeProperty<
          Entity,
          Selection,
          P,
          false,
          PropsMode
        >
      }
    : // otherwise it means only set of columns were selected, and we should only select them
      {
        [P in keyof EntityPropsWithModel<
          Entity,
          PropsMode
        > as P extends EntitySelectionTruthyKeys<Entity, Selection>
          ? P
          : never]: FindReturnTypeProperty<
          Entity,
          Selection,
          P,
          true,
          PropsMode
        >
      }
