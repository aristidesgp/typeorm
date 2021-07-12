import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassDefinition,
  EntityClassInstance,
  RelationEntity,
} from "../../entity"

/**
 * Entity ordering options in find options.
 */
export type OrderOptions<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? OrderOptionsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? OrderOptionsForClass<DataSource, Entity>
  : unknown

/**
 * Defines OrderOptions for entity defined in a class (with decorators).
 */
export type OrderOptionsForClass<
  DataSource extends AnyDataSource,
  Entity extends EntityClassInstance
> = {
  [P in keyof Entity]?: Entity[P] extends Array<infer U>
    ? U extends EntityClassDefinition
      ? OrderOptions<DataSource, InstanceType<U>>
      : DataSource["@types"]["orderTypes"]
    : Entity[P] extends EntityClassDefinition
    ? OrderOptions<DataSource, InstanceType<Entity[P]>>
    : DataSource["@types"]["orderTypes"]
}

/**
 * Defines OrderOptions for entity defined as entity schemas.
 */
export type OrderOptionsForEntitySchema<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = {
  [P in keyof Entity["columns"]]?: DataSource["@types"]["orderTypes"]
} &
  {
    [P in keyof Entity["relations"]]?: OrderOptions<
      DataSource,
      RelationEntity<Entity, P>
    >
  } &
  {
    [P in keyof Entity["embeds"]]?: OrderOptions<
      DataSource,
      Entity["embeds"][P]
    >
  }
