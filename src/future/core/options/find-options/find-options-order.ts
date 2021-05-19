import { AnyDataSource } from "../../data-source"
import {
  AnyEntity,
  AnyEntitySchema,
  EntityClassDefinition,
  RelationEntity,
} from "../../entity"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = Entity extends AnyEntitySchema
  ? {
      [P in keyof Entity["columns"]]?: DataSource["types"]["orderTypes"]
    } &
      {
        [P in keyof Entity["relations"]]?: FindOptionsOrder<
          DataSource,
          RelationEntity<Entity, P>
        >
      } &
      {
        [P in keyof Entity["embeds"]]?: FindOptionsOrder<
          DataSource,
          Entity["embeds"][P]
        >
      }
  : {
      [P in keyof Entity]?: Entity[P] extends Array<infer U>
        ? U extends EntityClassDefinition
          ? FindOptionsOrder<DataSource, InstanceType<U>>
          : DataSource["types"]["orderTypes"]
        : Entity[P] extends EntityClassDefinition
        ? FindOptionsOrder<DataSource, InstanceType<Entity[P]>>
        : DataSource["types"]["orderTypes"]
    }
