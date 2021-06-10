import { AnyDataSource } from "../data-source"
import {
  FindOptions,
  FindOptionsMany,
  EntitySchemaComputedModel,
  FindOptionVirtuals,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { SelectOptionsForEntitySchema } from "../options/select-options"
import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassInstance,
  EntityReference,
  RelationEntity,
} from "./entity-core"
import { EntityRelationReferencedColumnTypeMap } from "./entity-referenced-columns"
import {
  EntityRelationManyToManyNotOwner,
  EntityRelationManyToManyOwner,
  EntityRelationManyToOne,
  EntityRelationOneToMany,
  EntityRelationOneToOneNotOwner,
  EntityRelationOneToOneOwner,
} from "./entity-relations"

export type EntityPropsMode = "all" | "create" | "virtuals"

export type ArrayRelations<
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? {
      [P in keyof Entity["relations"] as Entity["relations"][P] extends EntityRelationManyToManyOwner<EntityReference>
        ? P
        : Entity["relations"][P] extends EntityRelationManyToManyNotOwner<EntityReference>
        ? P
        : Entity["relations"][P] extends EntityRelationOneToMany<EntityReference>
        ? P
        : never]: Entity["relations"][P]
    }
  : {
      [P in keyof Entity as Entity[P] extends Array<any> ? P : never]: Entity[P]
    }

export type NonArrayRelations<
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? {
      [P in keyof Entity["relations"] as Entity["relations"][P] extends EntityRelationOneToOneOwner<EntityReference>
        ? P
        : Entity["relations"][P] extends EntityRelationOneToOneNotOwner<EntityReference>
        ? P
        : Entity["relations"][P] extends EntityRelationManyToOne<EntityReference>
        ? P
        : never]: Entity["relations"][P]
    }
  : {
      [P in keyof Entity as Entity[P] extends Array<any> ? never : P]: Entity[P]
    }

export type ActiveRecordMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = Entity["type"] extends "advanced"
  ? {
      save(): Promise<void>
      remove(): Promise<void>
      archive(): Promise<void>
      unarchive(): Promise<void>
      reload(): Promise<void>
    } & {
      [P in keyof ArrayRelations<Entity> as `load${Capitalize<string & P>}`]: <
        Options extends FindOptionsMany<DataSource, Entity>
      >(
        options?: Options,
      ) => Promise<
        EntitySchemaComputedModel<
          DataSource,
          RelationEntity<
            Entity,
            P extends keyof Entity["relations"] ? P : never
          >,
          Options["select"] extends SelectOptionsForEntitySchema<Entity>
            ? Options["select"]
            : {},
          {}, // todo
          false,
          "all"
        >[]
      >
    } &
      {
        [P in keyof NonArrayRelations<Entity> as `load${Capitalize<
          string & P
        >}`]: <Options extends FindOptions<DataSource, Entity>>(
          options?: Options,
        ) => Promise<
          EntitySchemaComputedModel<
            DataSource,
            RelationEntity<
              Entity,
              P extends keyof Entity["relations"] ? P : never
            >,
            Options["select"] extends SelectOptionsForEntitySchema<Entity>
              ? Options["select"]
              : {},
            {}, // todo
            false,
            "all"
          >
        >
      } &
      {
        [P in keyof ArrayRelations<Entity> as `count${Capitalize<
          string & P
        >}`]: <Options extends FindOptionsCount<DataSource, Entity>>(
          options?: Options,
        ) => Promise<number>
      } &
      {
        [P in keyof ArrayRelations<Entity> as `has${Capitalize<string & P>}`]: (
          entities: P extends keyof Entity["relations"]
            ? EntityRelationReferencedColumnTypeMap<
                DataSource,
                RelationEntity<Entity, P>,
                Entity["relations"][P]
              >
            : never,
        ) => Promise<boolean>
      } &
      {
        [P in keyof ArrayRelations<Entity> as `add${Capitalize<string & P>}`]: (
          entities: P extends keyof Entity["relations"]
            ? EntityRelationReferencedColumnTypeMap<
                DataSource,
                RelationEntity<Entity, P>,
                Entity["relations"][P]
              >
            : never,
        ) => Promise<void>
      } &
      {
        [P in keyof ArrayRelations<Entity> as `remove${Capitalize<
          string & P
        >}`]: (
          entities: P extends keyof Entity["relations"]
            ? EntityRelationReferencedColumnTypeMap<
                DataSource,
                RelationEntity<Entity, P>,
                Entity["relations"][P]
              >
            : never,
        ) => Promise<void>
      }
  : {}

export type EntityPropsWithModel<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  PropsMode extends EntityPropsMode,
  Virtuals extends FindOptionVirtuals<DataSource, Entity>
> = Entity extends AnyEntitySchema
  ? PropsMode extends "all"
    ? EntityPropsForOptions<Entity> &
        {
          [P in keyof Entity["model"]["type"]]: {
            type: "model"
            property: P
          }
        } &
        {
          [P in keyof Entity["virtuals"]["methods"]]: {
            type: "virtualMethods"
            property: P
          }
        } &
        {
          [P in keyof Entity["virtuals"]["lazyProperties"]]: {
            type: "virtualLazyProperties"
            property: P
          }
        } &
        {
          [P in keyof Entity["virtuals"]["eagerProperties"]]: {
            type: "virtualEagerProperties"
            property: P
          }
        } &
        {
          [P in keyof Virtuals["properties"]]: {
            type: "virtualProperties"
            property: P
          }
        } &
        {
          [P in keyof Virtuals["methods"]]: {
            type: "virtualMethods"
            property: P
          }
        } &
        {
          [P in keyof Virtuals["relations"]]: {
            type: "virtualRelations"
            property: P
          }
        } &
        ActiveRecordMethods<DataSource, Entity>
    : PropsMode extends "virtuals" // todo: rename to virtual-methods? or list all virtuals in properties?
    ? {
        [P in keyof Entity["virtuals"]["methods"]]: {
          type: "virtualMethods"
          property: P
        }
      }
    : EntityPropsForOptions<Entity> &
        {
          [P in keyof Entity["model"]["type"]]: {
            type: "model"
            property: P
          }
        }
  : {
      [P in keyof Entity]: {
        type: "class-property"
        property: P
      }
    }

/**
 * Extracts entity properties to be used in options.
 */
export type EntityPropsForOptions<
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? {
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
  : Entity extends EntityClassInstance
  ? {
      [P in keyof Entity]: Entity[P] extends Function
        ? never
        : {
            type: "class-property"
            property: P
          }
    }
  : unknown

/**
 * Extract all entity main properties: columns, relations and embeds.
 */
export type EntitySchemaKeys<Entity extends AnyEntitySchema> = string &
  keyof (Entity["columns"] & Entity["relations"] & Entity["embeds"])
