import { AnyDataSource } from "../../data-source"
import {
  ActiveRecordMethods,
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityClassInstance,
  EntityPropsMode,
  EntityPropsWithModel,
  RelationEntity,
} from "../../entity"
import { ForceCastIfUndefined } from "../../util"
import { Operator } from "../operator"
import {
  FindOptionVirtuals,
  SelectOptions,
  SelectOptionsForEntitySchema,
  VirtualPropertyReturnType,
} from "../select-options"

export type EntitySchemaComputedModelWrapper<
  DataSource extends AnyDataSource,
  Selection extends SelectOptionsForEntitySchema<any>,
  Virtuals extends FindOptionVirtuals<any, any>,
  Entity extends AnyEntitySchema,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode,
  P
> = EntitySchemaComputedModel<
  DataSource,
  Entity,
  Selection[string & P] extends object ? Selection[string & P] : {}, // todo: if this won't work - send as a parameter to this type
  P extends keyof Virtuals["relations"]
    ? Virtuals["relations"][P] extends FindOptionVirtuals<DataSource, Entity> // todo: remove this if?
      ? Virtuals["relations"][P]
      : {}
    : {},
  ParentPartiallySelected,
  PropsMode
>

export type FindReturnTypeProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>,
  Virtuals extends FindOptionVirtuals<DataSource, Entity>,
  P, // extends string, // & keyof EntityPropsWithModel<Entity, any>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = P extends string & keyof Entity["columns"] // if property is a column, just return it's type inferred from a driver column types defined in the entity
  ? ColumnCompileType<DataSource, Entity, P>
  : P extends keyof Entity["embeds"] // if selected property is an embed, we just go recursively
  ? EntitySchemaComputedModelWrapper<
      DataSource,
      Selection,
      Virtuals,
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
          Virtuals,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          Virtuals,
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
          Virtuals,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          Selection,
          Virtuals,
          RelationEntity<Entity, P>,
          false,
          PropsMode,
          P
        >
    : P extends keyof Virtuals["relations"] // 3. relation can be not selected at all, however select&mapped properties can be defined
    ? Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" // Entity["model"]["type"][P] extends Array<infer U> ?
      ? EntitySchemaComputedModelWrapper<
          DataSource,
          {}, // because we have no selection at all here
          Virtuals,
          RelationEntity<Entity, P>,
          true, // because we don't have selection at all - this will prevent selecting any properties
          PropsMode,
          P
        >[]
      : EntitySchemaComputedModelWrapper<
          DataSource,
          {}, // because we have no selection at all here
          Virtuals,
          RelationEntity<Entity, P>,
          true, // because we don't have selection at all - this will prevent selecting any properties
          PropsMode,
          P
        >
    : never
  : P extends keyof Entity["model"]["type"]
  ? Entity["model"]["type"][P]
  : P extends keyof Entity["virtuals"]["methods"]
  ? Entity["virtuals"]["methods"][P]
  : P extends keyof Entity["virtuals"]["lazyProperties"]
  ? VirtualPropertyReturnType<
      ForceCastIfUndefined<Entity["virtuals"]["lazyProperties"], {}>,
      P
    >
  : P extends keyof Entity["virtuals"]["lazyProperties"]
  ? VirtualPropertyReturnType<
      ForceCastIfUndefined<Entity["virtuals"]["eagerProperties"], {}>,
      P
    >
  : P extends keyof ActiveRecordMethods<DataSource, Entity>
  ? ActiveRecordMethods<DataSource, Entity>[P]
  : P extends keyof Virtuals["properties"]
  ? VirtualPropertyReturnType<
      ForceCastIfUndefined<Virtuals["properties"], {}>,
      P
    >
  : P extends keyof Virtuals["methods"]
  ? Virtuals["methods"][string & P]
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
  Virtuals extends FindOptionVirtuals<DataSource, Entity>
> =
  | {
      [P in keyof Selection]: Selection[P] extends true
        ? P
        : Selection[P] extends object
        ? P
        : never
    }[keyof Selection]
  | keyof Entity["virtuals"]["eagerProperties"]
  | keyof Entity["virtuals"]["methods"]
  | keyof Virtuals["properties"]
  | keyof Virtuals["methods"]
  | keyof Virtuals["relations"]
  | keyof ActiveRecordMethods<DataSource, Entity>

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>,
  Virtuals extends FindOptionVirtuals<DataSource, Entity>
> = keyof (Entity["columns"] &
  {
    [P in keyof Entity["relations"] as Selection[P] extends true
      ? P
      : Selection[P] extends object
      ? P
      : never]: true
  } &
  Entity["embeds"] &
  Entity["virtuals"]["eagerProperties"] &
  Entity["virtuals"]["methods"] &
  Virtuals["properties"] &
  Virtuals["methods"] &
  Virtuals["relations"] &
  ActiveRecordMethods<DataSource, Entity>)

export type FindType<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  Selection extends SelectOptions<Entity> | undefined,
  Virtuals extends FindOptionVirtuals<DataSource, Entity> | undefined
> = Entity extends AnyEntitySchema
  ? Virtuals extends FindOptionVirtuals<DataSource, Entity>
    ? Selection extends SelectOptionsForEntitySchema<Entity>
      ? EntitySchemaComputedModel<
          DataSource,
          Entity,
          Selection,
          Virtuals,
          false,
          "all"
        >
      : EntitySchemaComputedModel<
          DataSource,
          Entity,
          {},
          Virtuals,
          false,
          "all"
        >
    : Selection extends SelectOptionsForEntitySchema<Entity>
    ? EntitySchemaComputedModel<DataSource, Entity, Selection, {}, false, "all">
    : EntitySchemaComputedModel<DataSource, Entity, {}, {}, false, "all">
  : Entity extends EntityClassInstance
  ? Entity
  : unknown

export type EntitySchemaComputedModel<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema,
  Selection extends SelectOptionsForEntitySchema<Entity>, // if something went wrong use it: extends FindOptionsSelect<Source, Entity>,
  Virtuals extends FindOptionVirtuals<DataSource, Entity>,
  ParentPartiallySelected extends boolean,
  PropsMode extends EntityPropsMode
> = ParentPartiallySelected extends true // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
  ? {
      [P in keyof EntityPropsWithModel<
        DataSource,
        Entity,
        PropsMode,
        Virtuals
      > as P extends EntitySelectionTruthyKeys<
        DataSource,
        Entity,
        Selection,
        Virtuals
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        Virtuals,
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
        Virtuals
      > as P extends EntitySelectionAllColumns<
        DataSource,
        Entity,
        Selection,
        Virtuals
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        Virtuals,
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
        Virtuals
      > as P extends EntitySelectionTruthyKeys<
        DataSource,
        Entity,
        Selection,
        Virtuals
      >
        ? P
        : never]: FindReturnTypeProperty<
        DataSource,
        Entity,
        Selection,
        Virtuals,
        P,
        true,
        PropsMode
      >
    }
