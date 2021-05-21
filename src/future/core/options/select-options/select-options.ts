import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassDefinition,
  EntityClassInstance,
  RelationEntity,
} from "../../entity"

/**
 * Schema for Selection, used for user to specify what he is going to "select" from the db.
 * In selection he is able to specify columns, relations and embeds to select.
 * Relations can be "selected completely" by simply specifying "true" to the whole object in the relation, e.g. { relation: true }.
 * Its also worth noting if no columns where specified in the selection, all entity columns will be selected,
 * e.g. for selection of user(id,name,photo,contacts) with selection set to { select: { photo: true } } -
 * returned result will have - "id", "name" columns and "photo" relation selected.
 *
 * Usage example:
 *
 * .find({
 *   select: {
 *     id: true,
 *     name: true,
 *     photo: {
 *       id: true,
 *       filename: true,
 *       album: true
 *     },
 *     profile: {
 *       bio: true
 *     }
 *   }
 * })
 */
export type SelectOptions<
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? SelectOptionsForEntitySchema<Entity>
  : Entity extends EntityClassInstance
  ? SelectOptionsForClass<Entity>
  : unknown

/**
 * Defines SelectOptions for entity defined in a class (with decorators).
 */
export type SelectOptionsForClass<Entity extends EntityClassInstance> = {
  [P in keyof Entity]?: Entity[P] extends Array<infer U>
    ? U extends EntityClassDefinition
      ? true | false | SelectOptions<InstanceType<U>>
      : true | false
    : Entity[P] extends EntityClassDefinition
    ? true | false | SelectOptions<InstanceType<Entity[P]>>
    : true | false
}

/**
 * Defines SelectOptions for entity defined as entity schemas.
 */
export type SelectOptionsForEntitySchema<Entity extends AnyEntitySchema> = {
  [P in keyof Entity["columns"]]?: true | false
} &
  {
    [P in keyof Entity["virtualLazyProperties"]]?: true | false
  } &
  {
    [P in keyof Entity["relations"]]?:
      | true
      | false
      | SelectOptions<RelationEntity<Entity, P>>
  } &
  {
    [P in keyof Entity["embeds"]]?: SelectOptions<Entity["embeds"][P]>
  }
