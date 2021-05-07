import { AnyDriver } from "../driver"
import { ForceCastIfExtends } from "../util"
import {
  EntityColumnTypeMapByNames,
  EntityPrimaryColumnTypeMap,
} from "./entity-columns"
import { AnyEntityCore } from "./entity-core"
import {
  EntityRelation,
  EntityRelationManyToManyNotOwner,
  EntityRelationManyToManyOwner,
  EntityRelationManyToOne,
  EntityRelationOneToMany,
  EntityRelationOneToOneNotOwner,
  EntityRelationOneToOneOwner,
  EntityRelationReferencedColumn,
  EntityRelationReferencedTable,
} from "./entity-relations"

/**
 * Creates a column map for a given entity relation.
 * E.g. let's say we have a following relation:
 *
 *
 * export const PhotoEntity = entity({
 *   columns: {
 *     id: {
 *       primary: true,
 *       type: "int",
 *     },
 *     filename: {
 *       type: "varchar",
 *       nullable: true,
 *     },
 *   },
 *   relations: {
 *     users: {
 *       type: "many-to-many",
 *       owner: false,
 *       inverse: "photos" as const,
 *       reference: "UserEntity" as const,
 *     },
 *   },
 * })
 *
 * export const UserEntity = entity({
 *   columns: {
 *     id: {
 *       type: "int",
 *       primary: true,
 *       generated: true,
 *     },
 *     name: {
 *       type: "varchar",
 *     },
 *   },
 *   relations: {
 *     photos: {
 *       type: "many-to-many",
 *       owner: true,
 *       reference: "PhotoEntity" as const,
 *       referencedTable: {
 *         ownerColumns: [
 *           { referencedColumn: "id" as const },
 *           { referencedColumn: "name" as const },
 *         ],
 *         inverseColumns: [
 *           { referencedColumn: "id" } as const,
 *           { referencedColumn: "filename" } as const,
 *         ],
 *       },
 *     },
 *   },
 * })
 *
 * When this type will be called for this relation for the PhotoEntity a following type will be produced:
 * { id: number, filename: string }
 * And for the UserEntity a following type will be produced:
 * { id: number, name: string }
 *
 *
 */
export type EntityRelationReferencedColumnTypeMap<
  Driver extends AnyDriver,
  ReferencedEntity extends AnyEntityCore,
  Relation extends EntityRelation<any>
> = Relation extends EntityRelationManyToManyOwner<any>
  ? Relation["referencedTable"] extends EntityRelationReferencedTable
    ? EntityRelationReferencedColumnMixedTypeMap<
        Driver,
        ReferencedEntity,
        ForceCastIfExtends<
          Relation["referencedTable"],
          EntityRelationReferencedTable
        >["inverseColumns"]
      >[]
    : EntityPrimaryColumnTypeMap<Driver, ReferencedEntity>[] | undefined
  : Relation extends EntityRelationManyToManyNotOwner<any>
  ? Relation["inverse"] extends keyof ReferencedEntity["relations"]
    ? ReferencedEntity["relations"][string &
        Relation["inverse"]] extends EntityRelationManyToManyOwner<any>
      ? ForceCastIfExtends<
          ReferencedEntity["relations"][string &
            Relation["inverse"]]["referencedTable"],
          EntityRelationReferencedTable
        >["ownerColumns"] extends
          | EntityRelationReferencedColumn
          | [...EntityRelationReferencedColumn[]]
        ? EntityRelationReferencedColumnMixedTypeMap<
            Driver,
            ReferencedEntity,
            ForceCastIfExtends<
              ReferencedEntity["relations"][string &
                Relation["inverse"]]["referencedTable"],
              EntityRelationReferencedTable
            >["ownerColumns"]
          >[]
        : EntityPrimaryColumnTypeMap<Driver, ReferencedEntity>[]
      : never
    : never
  : Relation extends EntityRelationManyToOne<any>
  ? EntityRelationReferencedColumnMixedTypeMap<
      Driver,
      ReferencedEntity,
      Relation["referencedColumns"]
    >
  : Relation extends EntityRelationOneToMany<any>
  ? EntityPrimaryColumnTypeMap<Driver, ReferencedEntity>[]
  : Relation extends EntityRelationOneToOneOwner<any>
  ? EntityRelationReferencedColumnMixedTypeMap<
      Driver,
      ReferencedEntity,
      Relation["referencedColumns"]
    >
  : Relation extends EntityRelationOneToOneNotOwner<any>
  ? EntityPrimaryColumnTypeMap<Driver, ReferencedEntity>[]
  : never

/**
 * Helper type for EntityRelationReferencedColumnTypeMap.
 */
export type EntityRelationReferencedColumnMixedTypeMap<
  Driver extends AnyDriver,
  ReferencedEntity extends AnyEntityCore,
  ReferencedColumnMixed extends
    | EntityRelationReferencedColumn[]
    | EntityRelationReferencedColumn
    | undefined
> = ReferencedColumnMixed extends EntityRelationReferencedColumn[]
  ? EntityColumnTypeMapByNames<
      Driver,
      ReferencedEntity,
      ForceCastIfExtends<
        ReferencedColumnMixed,
        EntityRelationReferencedColumn[]
      >[number]["referencedColumn"]
    >
  : ReferencedColumnMixed extends EntityRelationReferencedColumn
  ? EntityColumnTypeMapByNames<
      Driver,
      ReferencedEntity,
      ForceCastIfExtends<
        ReferencedColumnMixed,
        EntityRelationReferencedColumn
      >["referencedColumn"]
    >
  : EntityPrimaryColumnTypeMap<Driver, ReferencedEntity>
