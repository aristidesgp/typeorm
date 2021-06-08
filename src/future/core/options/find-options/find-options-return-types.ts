import { AnyDataSource } from "../../data-source"
import {
  ActiveRecordMethods,
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityClassInstance,
  EntityPropertiesItem,
  EntityPropsForOptions,
  EntityPropsMode,
  EntityPropsWithModel,
  RelationEntity,
} from "../../entity"
import { ForceCastIfExtends } from "../../util"
import { Operator } from "../operator"
import {
  SelectAndMapOptions,
  SelectOptions,
  SelectOptionsForEntitySchema,
} from "../select-options"

export type EntitySchemaComputedModelWrapper<
  DataSource extends AnyDataSource,
  Selection extends SelectOptionsForEntitySchema<any>,
  SelectAndMap extends SelectAndMapOptions<any, any>,
  Entity extends AnyEntitySchema,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode,
  P
> = EntitySchemaComputedModel<
  DataSource,
  Entity,
  Selection[string & P] extends object ? Selection[string & P] : {}, // todo: if this won't work - send as a parameter to this type
  P extends keyof SelectAndMap["relations"]
    ? SelectAndMap["relations"][P] extends SelectAndMapOptions<
        DataSource,
        Entity
      > // todo: remove this if?
      ? SelectAndMap["relations"][P]
      : {}
    : {},
  ParentPartiallySelected,
  PropsMode
>

export type FindReturnTypeProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity>,
  P, // extends string, // & keyof EntityPropsWithModel<Entity, any>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = P extends string & keyof Entity["columns"] // if property is a column, just return it's type inferred from a driver column types defined in the entity
  ? ColumnCompileType<DataSource, Entity, P>
  : P extends keyof Entity["embeds"] // if selected property is an embed, we just go recursively
  ? EntitySchemaComputedModelWrapper<
      DataSource,
      Selection,
      SelectAndMap,
      Entity["embeds"][P],
      ParentPartiallySelected,
      PropsMode,
      P
    >
  : P extends keyof Entity["relations"] // if selected property is relation
  ? Selection[P] extends object // relation selection can be defined two ways: // 1. we can select some properties of the related object
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many"
      ? EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          SelectAndMap,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          SelectAndMap,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >
    : Selection[P] extends true // 2. we can select the whole related object (means its columns) by using relation: true
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? EntitySchemaComputedModelWrapper<
          DataSource,
          {}, // because Selection[P] is boolean "true"
          SelectAndMap,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          SelectAndMap,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >
    : P extends keyof SelectAndMap["relations"] // 3. relation can be not selected at all, however select&mapped properties can be defined
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? EntitySchemaComputedModelWrapper<
          DataSource,
          {}, // because we have no selection at all here
          SelectAndMap,
          RelationEntity<Entity, P>,
          true, // because we don't have selection at all - this will prevent selecting any properties
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          {}, // because we have no selection at all here
          SelectAndMap,
          RelationEntity<Entity, P>,
          true, // because we don't have selection at all - this will prevent selecting any properties
          PropsMode,
          P
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
  : P extends keyof SelectAndMap["properties"]
  ? SelectAndMap["properties"][P] extends Operator<
      any,
      any,
      infer ReturningType
    >
    ? ReturningType
    : unknown
  : P extends keyof SelectAndMap["methods"]
  ? SelectAndMap["methods"][string & P]
  : /*: P extends keyof SelectAndMap["relations"]
    ? P extends keyof Entity["relations"]
      ? EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          SelectAndMap,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >
      : unknown*/
    never

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
  Selection extends SelectOptionsForEntitySchema<Entity>,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity>
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
  | keyof SelectAndMap["properties"]
  | keyof SelectAndMap["methods"]
  | keyof SelectAndMap["relations"]
  | keyof ActiveRecordMethods<DataSource, Entity>

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity>
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
  SelectAndMap["properties"] &
  SelectAndMap["methods"] &
  SelectAndMap["relations"] &
  ActiveRecordMethods<DataSource, Entity>)

export type FindType<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends SelectOptions<Entity> | undefined,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity> | undefined
> = Entity extends AnyEntitySchema
  ? SelectAndMap extends SelectAndMapOptions<DataSource, Entity>
    ? Selection extends SelectOptionsForEntitySchema<Entity>
      ? EntitySchemaComputedModel<
          DataSource,
          Entity,
          Selection,
          SelectAndMap,
          false,
          "all"
        > /*& FindSelectAndMapType<DataSource, Entity, SelectAndMap>*/
      : EntitySchemaComputedModel<
          DataSource,
          Entity,
          {},
          SelectAndMap,
          false,
          "all"
        > /*& FindSelectAndMapType<DataSource, Entity, SelectAndMap>*/
    : Selection extends SelectOptionsForEntitySchema<Entity>
    ? EntitySchemaComputedModel<DataSource, Entity, Selection, {}, false, "all">
    : EntitySchemaComputedModel<DataSource, Entity, {}, {}, false, "all">
  : Entity extends EntityClassInstance
  ? Entity
  : unknown

export type FindSelectAndMapType<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity>
> = {
  [P in keyof SelectAndMap["properties"]]: SelectAndMap["properties"][P] extends Operator<
    any,
    any,
    infer ReturnType
  >
    ? ReturnType
    : unknown
} /*&
  {
    [P in keyof SelectAndMap["relations"]]: FindSelectAndMapType<DataSource, any, SelectAndMap["relations"][P]>
  }*/

export type EntitySchemaComputedModel<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  SelectAndMap extends SelectAndMapOptions<DataSource, Entity>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = ParentPartiallySelected extends true // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ? {
      [P in keyof EntityPropsWithModel<
        DataSource,
        Entity,
        PropsMode,
        SelectAndMap
      > as P extends EntitySelectionTruthyKeys<
        DataSource,
        Entity,
        Selection,
        SelectAndMap
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        SelectAndMap,
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
        PropsMode,
        SelectAndMap
      > as P extends EntitySelectionAllColumns<
        DataSource,
        Entity,
        Selection,
        SelectAndMap
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        SelectAndMap,
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
        PropsMode,
        SelectAndMap
      > as P extends EntitySelectionTruthyKeys<
        DataSource,
        Entity,
        Selection,
        SelectAndMap
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        SelectAndMap,
        P,
        true,
        PropsMode
      >
    }
