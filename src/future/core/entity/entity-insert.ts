import { AnyDriver } from "../driver"
import { FindReturnType } from "../options"
import { FlatTypeHint, UndefinedToOptional } from "../util"
import { ColumnCompileType, EntityColumn } from "./entity-columns"
import { AnyEntity, ReferencedEntity } from "./entity-core"
import { EntityRelationReferencedColumnTypeMap } from "./entity-referenced-columns"

/**
 * Prepare a given column compile type for insertion.
 * For example, its not necessary to specify columns with "default" on insertion.
 * Or "generated" columns also optional because db can generate a value for consumer.
 * Or nullable columns can be omitted because database will insert NULL for them.
 */
export type ColumnCompileTypeForInsert<
  Column extends EntityColumn<AnyDriver>,
  CompileType
> = Column["default"] extends string | number | boolean
  ? CompileType | undefined
  : Column["generated"] extends true
  ? CompileType | undefined
  : Column["nullable"] extends true
  ? CompileType | undefined
  : CompileType

/**
 * Entity blueprint that can be used in "insert" operation.
 *
 * Implementation notes:
 *  - UndefinedToOptional is used because built object contains values marked as type | undefined,
 *    but they still aren't optional in the object. To make their undefined-s really useful we need to mark
 *    them as optional in the built object.
 *  - FlatTypeHint is used to improve type hinting when this type is directly used
 */
export type EntityModelForInsert<Entity extends AnyEntity> = FlatTypeHint<
  UndefinedToOptional<
    {
      [P in keyof Entity["columnsEmbedsRelations"]]: P extends string &
        keyof Entity["columns"]
        ? ColumnCompileTypeForInsert<
            Entity["columns"][P],
            ColumnCompileType<Entity, P>
          >
        : P extends keyof Entity["embeds"]
        ? EntityModelForInsert<Entity["embeds"][P]>
        : P extends keyof Entity["relations"]
        ?
            | EntityRelationReferencedColumnTypeMap<
                ReferencedEntity<Entity, P>,
                Entity["relations"][P]
              >
            | undefined
        : never
    }
  >
>

/**
 * Merges generated columns, default columns into given partial entity model.
 * This type is used after "insert" operation is performed.
 * The reason why this type exists - because when user uses "insert" method he might not
 * provide all entity data and some data can be generated by database for him.
 * In such cases database returns those values to "insert" method and "insert" method returns them back to user.
 */
export type EntityModelAfterInsert<Entity extends AnyEntity, Model> = Model &
  FindReturnType<
    Entity,
    /*SelectAll<
      Entity,
      EntityGeneratedColumnTypeMap<Types, Entity> &
        EntityDefaultColumnTypeMap<Types, Entity>
    >*/
    {}, // todo: fix SelectAll please
    false,
    "all"
  >
