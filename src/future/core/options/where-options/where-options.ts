import { AnyDataSource } from "../../data-source"
import { ColumnCompileType } from "../../entity/entity-columns"
import { AnyEntity, ReferencedEntity } from "../../entity/entity-core"
import { EntityProps } from "../../entity/entity-utils"

export type WhereExpression<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = {
  "@type": "WhereExpression"
  kind: "not" | "or" | "and" | "xor"
  driver: Source
  entity: Entity
  options: WhereOptions<Source, Entity>[]
}

export type WhereOperator<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  ValueType
> = {
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
  driver: Source
  entity: Entity
  valueType: ValueType
  value: any
}

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type WhereOptions<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = WhereExpression<Source, Entity> | WhereOperatorOptions<Source, Entity>

export type WhereOptionsOperatorProperty<
  Source extends AnyDataSource,
  Entity extends AnyEntity,
  P extends keyof EntityProps<Entity>
  // Property extends EntityProps<Entity>[P]["property"],
> = P extends string & keyof Entity["columns"]
  ?
      | ColumnCompileType<
          Entity["driver"],
          Entity["model"],
          P,
          Entity["columns"][P]
        >
      | WhereOperator<
          Source,
          Entity,
          ColumnCompileType<
            Entity["driver"],
            Entity["model"],
            P,
            Entity["columns"][P]
          >
        >
      | WhereExpression<Source, Entity>
  : P extends keyof Entity["embeds"]
  ? WhereOptions<Source, Entity["embeds"][P]>
  : P extends keyof Entity["relations"]
  ? WhereOptions<Source, ReferencedEntity<Source, Entity, P>>
  : never

export type WhereOperatorOptions<
  Source extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [P in keyof EntityProps<Entity>]?: WhereOptionsOperatorProperty<
    Source,
    Entity,
    P
  >
}
