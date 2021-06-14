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
 * Extracts return type out of a given VirtualProperty in a given VirtualProperties list.
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
 * Virtuals defined in FindOptions.
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
 * Virtuals defined in entity schema.
 */
export type EntityVirtuals<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  lazyProperties?: VirtualProperties<DataSource, Entity>
  eagerProperties?: VirtualProperties<DataSource, Entity>
  methods?: VirtualMethods
}

/**
 * Virtual property can be operator or a function returning value.
 */
export type VirtualProperty<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Operator<Entity, any, any> | ((manager: DataSource["manager"]) => any)

/**
 * List of VirtualProperty objects.
 */
export type VirtualProperties<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  [name: string]: VirtualProperty<DataSource, Entity>
}

/**
 * Methods can be defined in the virtual list - those methods will be part of the entity.
 */
export type VirtualMethods = {
  [name: string]: (...args: any) => any
}

/**
 * Virtuals to be defined in the relations.
 */
export type VirtualRelations<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? VirtualRelationsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? VirtualRelationsAndEmbedsForClass<DataSource, Entity>
  : unknown

/**
 * Virtuals to be defined in the embeds.
 */
export type VirtualEmbeds<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? VirtualEmbedsForEntitySchema<DataSource, Entity>
  : Entity extends EntityClassInstance
  ? VirtualRelationsAndEmbedsForClass<DataSource, Entity>
  : unknown

/**
 * Virtuals to be defined in the relations (for entity schemas).
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
 * Virtuals to be defined in the embeds (for entity schemas).
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
 * Virtuals to be defined in the relations and embeds (for entity classes).
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
