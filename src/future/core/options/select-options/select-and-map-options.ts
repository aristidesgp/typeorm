import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassDefinition,
  EntityClassInstance,
  RelationEntity,
} from "../../entity"
import { NonNever } from "../../util"
import { Operator } from "../operator"

/**
 * Defines a properties which can be "selected" and "mapped" into a named property.
 */
export type SelectAndMapOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [name: string]: Operator<DataSource, Entity>[]
} & (Entity extends AnyEntitySchema
  ? SelectAndMapOptionsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? SelectAndMapOptionsForClass<DataSource, Entity>
  : {})

/**
 * Defines SelectAndMapOptions for entity defined in a class (with decorators).
 */
export type SelectAndMapOptionsForClass<
  DataSource extends AnyDataSource,
  Entity extends EntityClassInstance
> = NonNever<
  {
    [P in keyof Entity]?: Entity[P] extends Array<infer U>
      ? U extends EntityClassDefinition
        ? SelectAndMapOptions<DataSource, InstanceType<U>>
        : never
      : Entity[P] extends EntityClassDefinition
      ? SelectAndMapOptions<DataSource, InstanceType<Entity[P]>>
      : never
  }
>

/**
 * Defines SelectAndMapOptions for entity defined as entity schemas.
 */
export type SelectAndMapOptionsForEntitySchema<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = {
  [P in keyof Entity["relations"]]?: SelectAndMapOptions<
    DataSource,
    RelationEntity<Entity, P>
  >
} &
  {
    [P in keyof Entity["embeds"]]?: SelectAndMapOptions<
      DataSource,
      Entity["embeds"][P]
    >
  }
