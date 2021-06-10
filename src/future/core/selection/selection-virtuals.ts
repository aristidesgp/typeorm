import { AnyDataSource } from "../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassDefinition,
  EntityClassInstance,
  RelationEntity,
} from "../entity"
import { NonNever } from "../util"
import { Operator } from "../options"

/**
 *
 */
export type VirtualPropertyReturnType<
  Properties extends VirtualProperties<AnyDataSource, AnyEntity>,
  P extends keyof Properties
> = Properties[P] extends Operator<any, any, infer ReturningType>
  ? ReturningType
  : ReturnType<Properties[P]> extends Promise<infer U>
  ? U
  : ReturnType<Properties[P]>

/**
 */
export type FindOptionVirtuals<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  properties?: VirtualProperties<DataSource, Entity>
  relations?: VirtualRelations<DataSource, Entity>
  embeds?: VirtualEmbeds<DataSource, Entity>
  methods?: VirtualMethods
}

/**
 */
export type EntityVirtuals<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  lazyProperties?: VirtualProperties<DataSource, Entity>
  eagerProperties?: VirtualProperties<DataSource, Entity>
  methods?: VirtualMethods
}

export type VirtualProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Operator<Entity, any, any> | ((manager: DataSource["manager"]) => any)

export type VirtualProperties<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [name: string]: VirtualProperty<DataSource, Entity>
}

export type VirtualMethods = {
  [name: string]: (...args: any) => any
}

export type VirtualRelations<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? VirtualRelationsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? VirtualRelationsAndEmbedsForClass<DataSource, Entity>
  : unknown

export type VirtualEmbeds<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? VirtualEmbedsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? VirtualRelationsAndEmbedsForClass<DataSource, Entity>
  : unknown

/**
 * Defines SelectAndMapOptions for entity defined as entity schemas.
 */
export type VirtualRelationsForEntitySchema<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = {
  [P in keyof Entity["relations"]]?: FindOptionVirtuals<
    DataSource,
    RelationEntity<Entity, P>
  >
}

/**
 * Defines SelectAndMapOptions for entity defined as entity schemas.
 */
export type VirtualEmbedsForEntitySchema<
  DataSource extends AnyDataSource,
  Entity extends AnyEntitySchema
> = {
  [P in keyof Entity["embeds"]]?: FindOptionVirtuals<
    DataSource,
    Entity["embeds"][P]
  >
}

/**
 * Defines SelectAndMapOptions for entity defined in a class (with decorators).
 */
export type VirtualRelationsAndEmbedsForClass<
  DataSource extends AnyDataSource,
  Entity extends EntityClassInstance
> = NonNever<
  {
    [P in keyof Entity]?: Entity[P] extends Array<infer U>
      ? U extends EntityClassDefinition
        ? FindOptionVirtuals<DataSource, InstanceType<U>>
        : never
      : Entity[P] extends EntityClassDefinition
      ? FindOptionVirtuals<DataSource, InstanceType<Entity[P]>>
      : never
  }
>
