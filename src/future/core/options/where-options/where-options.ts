import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  ColumnCompileType,
  EntityProps,
  RelationEntity,
} from "../../entity"

export type WhereExpression<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  // driver: Source
  entity: Entity
  options: WhereOptions<DataSource, Entity>[]
}

export type WhereOperator<Entity extends AnyEntity, ValueType> = {
  "@type": "WhereOperator"
  kind:
    | "any"
    | "between"
    | "equal"
    | "ilike"
    | "like"
    | "in"
    | "lessThan"
    | "lessThanOrEqual"
    | "moreThan"
    | "moreThanOrEqual"
    | "raw"
    // | "and"
    // | "or"
    // | "not"
    | "escaped"
    | "column"
  // driver: Source
  entity: Entity
  valueType: ValueType
  value: any
}

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type WhereOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> =
  | WhereExpression<DataSource, Entity>
  | WhereOperatorOptions<DataSource, Entity>

export type WhereOptionsOperatorProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
> = Entity extends AnyEntitySchema
  ? P extends string & keyof Entity["columns"]
    ?
        | ColumnCompileType<DataSource, Entity, P>
        | WhereOperator<Entity, ColumnCompileType<DataSource, Entity, P>>
        | WhereExpression<DataSource, Entity>
    : P extends keyof Entity["embeds"]
    ? object & WhereOptions<DataSource, Entity["embeds"][P]>
    : P extends keyof Entity["relations"]
    ? object & WhereOptions<DataSource, RelationEntity<Entity, P>>
    : never
  : P extends keyof Entity
  ?
      | Entity[P]
      | WhereOperator<Entity, Entity[P]>
      | WhereExpression<DataSource, Entity>
  : unknown

export type WhereOperatorOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<
    DataSource,
    Entity,
    P
  >
}
