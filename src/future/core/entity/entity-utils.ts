import {
  FindOptions,
  FindOptionsMany,
  FindOptionsSelect,
  FindReturnType,
} from "../options"
import { FindOptionsCount } from "../options/find-options/find-options-count"
import { ForceCastIfUndefined } from "../util"
import { AnyEntity, EntityReference, ReferencedEntity } from "./entity-core"
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

export type ArrayRelations<Entity extends AnyEntity> = {
  [P in keyof Entity["relations"] as Entity["relations"][P] extends EntityRelationManyToManyOwner<EntityReference>
    ? P
    : Entity["relations"][P] extends EntityRelationManyToManyNotOwner<EntityReference>
    ? P
    : Entity["relations"][P] extends EntityRelationOneToMany<EntityReference>
    ? P
    : never]: Entity["relations"][P]
}

export type NonArrayRelations<Entity extends AnyEntity> = {
  [P in keyof Entity["relations"] as Entity["relations"][P] extends EntityRelationOneToOneOwner<EntityReference>
    ? P
    : Entity["relations"][P] extends EntityRelationOneToOneNotOwner<EntityReference>
    ? P
    : Entity["relations"][P] extends EntityRelationManyToOne<EntityReference>
    ? P
    : never]: Entity["relations"][P]
}

export type ActiveRecordMethods<
  Entity extends AnyEntity
> = Entity["type"] extends "active-record"
  ? {
      save(): Promise<void>
      remove(): Promise<void>
      archive(): Promise<void>
      unarchive(): Promise<void>
      reload(): Promise<void>
    } & {
      [P in keyof ArrayRelations<Entity> as `load${Capitalize<string & P>}`]: <
        Options extends FindOptionsMany<Entity>
      >(
        options?: Options,
      ) => Promise<
        FindReturnType<
          ReferencedEntity<
            Entity,
            P extends keyof Entity["relations"] ? P : never
          >,
          ForceCastIfUndefined<Options["select"], {}>,
          false,
          "all"
        >[]
      >
    } &
      {
        [P in keyof NonArrayRelations<Entity> as `load${Capitalize<
          string & P
        >}`]: <Options extends FindOptions<Entity>>(
          options?: Options,
        ) => Promise<
          FindReturnType<
            ReferencedEntity<
              Entity,
              P extends keyof Entity["relations"] ? P : never
            >,
            ForceCastIfUndefined<Options["select"], {}>,
            false,
            "all"
          >
        >
      } &
      {
        [P in keyof ArrayRelations<Entity> as `count${Capitalize<
          string & P
        >}`]: <Options extends FindOptionsCount<Entity>>(
          options?: Options,
        ) => Promise<number>
      } &
      {
        [P in keyof ArrayRelations<Entity> as `has${Capitalize<string & P>}`]: (
          entities: P extends keyof Entity["relations"]
            ? EntityRelationReferencedColumnTypeMap<
                ReferencedEntity<Entity, P>,
                Entity["relations"][P]
              >
            : never,
        ) => Promise<boolean>
      } &
      {
        [P in keyof ArrayRelations<Entity> as `add${Capitalize<string & P>}`]: (
          entities: P extends keyof Entity["relations"]
            ? EntityRelationReferencedColumnTypeMap<
                ReferencedEntity<Entity, P>,
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
                ReferencedEntity<Entity, P>,
                Entity["relations"][P]
              >
            : never,
        ) => Promise<void>
      }
  : {}

export type EntityPropsWithModel<
  Entity extends AnyEntity,
  PropsMode extends EntityPropsMode
> = PropsMode extends "all"
  ? EntityProps<Entity> &
      {
        [P in keyof Entity["model"]["type"]]: {
          type: "model"
          property: P
        }
      } &
      {
        [P in keyof Entity["virtualMethods"]]: {
          type: "virtualMethods"
          property: P
        }
      } &
      {
        [P in keyof Entity["virtualLazyProperties"]]: {
          type: "virtualLazyProperties"
          property: P
        }
      } &
      {
        [P in keyof Entity["virtualEagerProperties"]]: {
          type: "virtualEagerProperties"
          property: P
        }
      } &
      ActiveRecordMethods<Entity>
  : PropsMode extends "virtuals"
  ? {
      [P in keyof Entity["virtualMethods"]]: {
        type: "virtualMethods"
        property: P
      }
    }
  : EntityProps<Entity> &
      {
        [P in keyof Entity["model"]["type"]]: {
          type: "model"
          property: P
        }
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
