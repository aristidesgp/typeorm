import { AnyDataSource } from "../../data-source"
import {
  ActiveRecordMethods,
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityClassInstance,
  EntityPropertiesItem,
  EntityPropsMode,
  EntityPropsWithModel,
  RelationEntity,
} from "../../entity"
import { ForceCastIfExtends } from "../../util"
import { SelectOptions, SelectOptionsForEntitySchema } from "../select-options"

export type FindReturnTypeProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>,
  P, // extends string, // & keyof EntityPropsWithModel<Entity, any>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = P extends string & keyof Entity["columns"] // if property is a column, just return it's type inferred from a driver column types defined in the entity
  ? ColumnCompileType<DataSource, Entity, P>
  : P extends keyof Entity["embeds"] // if selected property is an embed, we just go recursively
  ? EntitySchemaComputedModel<
      DataSource,
      Entity["embeds"][P],
      Selection[string & P] extends object ? Selection[string & P] : {},
      ParentPartiallySelected,
      PropsMode
    >
  : P extends keyof Entity["relations"] // if selected property is relation
  ? Selection[P] extends object // relation selection can be defined two ways: // 1. we can select some properties of the related object
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many"
      ? EntitySchemaComputedModel<
          DataSource,
          RelationEntity<Entity, P>,
          Selection[string & P] extends object ? Selection[string & P] : {},
          false,
          PropsMode
        >[]
      : EntitySchemaComputedModel<
          DataSource,
          RelationEntity<Entity, P>,
          Selection[string & P] extends object ? Selection[string & P] : {},
          false,
          PropsMode
        >
    : Selection[P] extends true // 2. we can select the whole related object (means its columns) by using relation: true
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? EntitySchemaComputedModel<
          DataSource,
          RelationEntity<Entity, P>,
          {},
          false,
          PropsMode
        >[]
      : EntitySchemaComputedModel<
          DataSource,
          RelationEntity<Entity, P>,
          {},
          false,
          PropsMode
        >
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
  : P extends keyof ActiveRecordMethods<DataSource, Entity>
  ? ActiveRecordMethods<DataSource, Entity>[P]
  : never

export type OnlyColumnKeys<Selection, Entity extends AnyEntitySchema> = {
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
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>
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
  | keyof ActiveRecordMethods<DataSource, Entity>

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>
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
  Entity["virtualMethods"] &
  ActiveRecordMethods<DataSource, Entity>)

export type FindType<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends SelectOptions<Entity> | undefined
> = Entity extends AnyEntitySchema
  ? Selection extends SelectOptionsForEntitySchema<Entity>
    ? EntitySchemaComputedModel<DataSource, Entity, Selection, false, "all">
    : EntitySchemaComputedModel<DataSource, Entity, {}, false, "all">
  : Entity extends EntityClassInstance
  ? Entity
  : unknown

export type EntitySchemaComputedModel<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = ParentPartiallySelected extends true // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ? {
      [P in keyof EntityPropsWithModel<
        DataSource,
        Entity,
        PropsMode
      > as P extends EntitySelectionTruthyKeys<DataSource, Entity, Selection>
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
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
        DataSource,
        Entity,
        PropsMode
      > as P extends EntitySelectionAllColumns<DataSource, Entity, Selection>
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
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
        DataSource,
        Entity,
        PropsMode
      > as P extends EntitySelectionTruthyKeys<DataSource, Entity, Selection>
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        P,
        true,
        PropsMode
      >
    }
