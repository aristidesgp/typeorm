import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityPropsForOptions,
  RelationEntity,
} from "../../entity"

/**
 * Conditions for executed queries, used to specify what will be selected from the database.
 */
export type WhereOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = WhereGroup<DataSource, Entity> | WhereConditions<DataSource, Entity>

/**
 * WhereGroup allows to group WhereConditions in a different expressions, like "not", "and", "or", "xor".
 */
export type WhereGroup<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> =
  | {
      $not: WhereOptions<DataSource, Entity>[]
    }
  | {
      $and: WhereOptions<DataSource, Entity>[]
    }
  | {
      $or: WhereOptions<DataSource, Entity>[]
    }
  | {
      $xor: WhereOptions<DataSource, Entity>[]
    }

/**
 * Defines conditions used to filter the selected data from the database.
 */
export type WhereConditions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [P in keyof EntityPropsForOptions<Entity>]?: Entity extends AnyEntitySchema
    ? P extends string & keyof Entity["columns"]
      ?
          | ColumnCompileType<DataSource, Entity, P>
          | WhereOperator<Entity, ColumnCompileType<DataSource, Entity, P>>
          | WhereGroup<DataSource, Entity>
      : P extends keyof Entity["embeds"]
      ? /*object &*/ WhereOptions<DataSource, Entity["embeds"][P]>
      : P extends keyof Entity["relations"]
      ? /*object &*/ WhereOptions<DataSource, RelationEntity<Entity, P>>
      : never
    : P extends keyof Entity
    ?
        | Entity[P]
        | WhereOperator<Entity, Entity[P]>
        | WhereGroup<DataSource, Entity>
    : unknown
}

/**
 * Operators can be used to provide a complex value to a column during where selection.
 */
export type WhereOperator<Entity extends AnyEntity, ValueType> = () => {
  "@type": "WhereOperator"
  name: string
  value: any
  entity: Entity
  valueType: ValueType
}
