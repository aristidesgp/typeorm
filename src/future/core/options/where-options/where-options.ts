import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityClassInstance,
  EntitySchemaKeys,
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
      $not: WhereConditions<DataSource, Entity>
    }
  | {
      $and: WhereConditions<DataSource, Entity>[]
    }
  | {
      $or: WhereConditions<DataSource, Entity>[]
    }
  | {
      $xor: WhereConditions<DataSource, Entity>[]
    }

/**
 * Defines conditions used to filter the selected data from the database.
 */
export type WhereConditions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? WhereConditionsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? WhereConditionsForClass<DataSource, Entity>
  : unknown

/**
 * Defines WhereOptions for entity defined in a class (with decorators).
 * "$ex" notation allows to specify set of operators to apply to where query.
 */
export type WhereConditionsForClass<
  DataSource extends AnyDataSource,
  Entity extends EntityClassInstance
> = {
  $ex?: WhereOperator<Entity, undefined>[]
} & {
  [P in keyof Entity]?: Entity[P] extends Array<infer U>
    ? WhereOptions<DataSource, U>
    : Entity[P] extends Object
    ? WhereOptions<DataSource, Entity[P]>
    : Entity[P] | WhereOperator<Entity, Entity[P]>
}

/**
 * Defines WhereOptions for entity defined as entity schemas.
 * "$ex" notation allows to specify set of operators to apply to where query.
 */
export type WhereConditionsForEntitySchema<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = {
  $ex?: WhereOperator<Entity, undefined>[]
} & {
  [P in EntitySchemaKeys<Entity>]?: P extends keyof Entity["columns"]
    ?
        | ColumnCompileType<DataSource, Entity, P>
        | WhereOperator<Entity, ColumnCompileType<DataSource, Entity, P>> // | WhereGroup<DataSource, Entity>
    : P extends keyof Entity["embeds"]
    ? /*object &*/ WhereOptions<DataSource, Entity["embeds"][P]>
    : P extends keyof Entity["relations"]
    ? /*object &*/ WhereOptions<DataSource, RelationEntity<Entity, P>>
    : never
}

/**
 * Operators can be used to provide a complex value to a column during where filtering.
 */
export type WhereOperator<Entity extends AnyEntity, ValueType> = () => {
  /**
   * Unique type identifier.
   */
  "@type": "WhereOperator"

  /**
   * Operator name, e.g. "in", "plus", "minus", etc.
   */
  name: string

  /**
   * Value sent to operator when it was called.
   */
  value: any

  /**
   * Fake property to store type information.
   */
  __entity: Entity

  /**
   * Fake property to store type information.
   */
  __valueType: ValueType
}
