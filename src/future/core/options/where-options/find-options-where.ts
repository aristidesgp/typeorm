import { AnyDataSource } from "../../data-source"
import { AnyEntity, ColumnCompileType, ReferencedEntity } from "../../entity"
import { EntityProps } from "../find-options/find-options-select"

export type FindExpression<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = {
  "@type": "FindExpression"
  kind: "not" | "or" | "and" | "xor"
  driver: Source
  entity: Entity
  options: FindOptionsWhere<Source, Entity>[]
}

export type FindOperator<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
> = {
  "@type": "FindOperator"
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
  driver: Source
  entity: Entity
  valueType: ValueType
  value: any
}

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type FindOptionsWhere<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = FindExpression<Source, Entity> | FindOperatorWhereOptions<Source, Entity>

export type FindOperatorWhereOptionsProperty<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends keyof Entity["columns"]
  ?
      | ColumnCompileType<Entity, P>
      | FindOperator<Source, Entity, ColumnCompileType<Entity, P>>
      | FindExpression<Source, Entity>
  : P extends keyof Entity["embeds"]
  ? FindOptionsWhere<Source, Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? FindOptionsWhere<Source, ReferencedEntity<Source, Entity, P>>
  : never

export type FindOperatorWhereOptions<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: FindOperatorWhereOptionsProperty<
    Source,
    Entity,
    P
  >
}
