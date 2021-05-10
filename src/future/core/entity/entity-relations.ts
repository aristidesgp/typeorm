import { EntityReference } from "./entity-core"

/**
 * List of entity relations.
 */
export type EntityRelationList = {
  [key: string]: EntityRelation<any>
}

/**
 * Represents all entity relation types.
 * There are 4 types of relations:
 *  - one-to-one
 *  - many-to-one
 *  - one-to-many
 *  - many-to-many
 *
 * one-to-one and many-to-many also divided by "owner" and "not-owner".
 * Relationship owner "holds" a main side of the relationship.
 * It might be hard to determine who is the "owner" of the relationship,
 * just think who "owns" the data more than another.
 * Technically there is almost no difference.
 *
 * Difference can variate across different database implementations, but in case of RDBMS for example
 * main difference is that for one-to-one relationship "owner" contains a foreign key,
 * and for many-to-many table name prefix is generated started from "owner"'s table name.
 */
export type EntityRelation<Reference extends EntityReference> =
  | EntityRelationOneToMany<Reference>
  | EntityRelationManyToManyOwner<Reference>
  | EntityRelationManyToManyNotOwner<Reference>
  | EntityRelationOneToOneOwner<Reference>
  | EntityRelationOneToOneNotOwner<Reference>
  | EntityRelationManyToOne<Reference>

/**
 * one-to-many relation options.
 */
export type EntityRelationOneToMany<Reference extends EntityReference> = {
  type: "one-to-many"
  inverse: string
  reference: Reference
}

/**
 * many-to-many "owner" relation options.
 */
export type EntityRelationManyToManyOwner<Reference extends EntityReference> = {
  type: "many-to-many"
  owner: true
  inverse?: string
  reference: Reference
  referencedTable?: EntityRelationReferencedTable
}

/**
 * many-to-many "not owner" relation options.
 */
export type EntityRelationManyToManyNotOwner<
  Reference extends EntityReference
> = {
  type: "many-to-many"
  owner: false
  inverse: string
  reference: Reference
}

/**
 * one-to-one "owner" relation options.
 */
export type EntityRelationOneToOneOwner<Reference extends EntityReference> = {
  type: "one-to-one"
  owner: true
  reference: Reference
  inverse?: string
  nullable?: boolean
  referencedColumns?:
    | EntityRelationReferencedColumn
    | [...EntityRelationReferencedColumn[]]
}

/**
 * one-to-one "not owner" relation options.
 */
export type EntityRelationOneToOneNotOwner<
  Reference extends EntityReference
> = {
  type: "one-to-one"
  owner: false
  reference: Reference
  inverse: string
}

/**
 * many-to-one relation options.
 */
export type EntityRelationManyToOne<Reference extends EntityReference> = {
  type: "many-to-one"
  reference: Reference
  inverse?: string
  nullable?: boolean
  referencedColumns?:
    | EntityRelationReferencedColumn
    | [...EntityRelationReferencedColumn[]]
}

/**
 * Referenced table (in entity relation) options.
 * Used in many-to-many relations.
 */
export type EntityRelationReferencedTable = {
  name?: string
  ownerColumns?:
    | EntityRelationReferencedColumn
    | [...EntityRelationReferencedColumn[]]
  inverseColumns?:
    | EntityRelationReferencedColumn
    | [...EntityRelationReferencedColumn[]]
}

/**
 * Referenced column (in entity relation) options.
 */
export type EntityRelationReferencedColumn = {
  name?: string
  referencedColumn: string
}
