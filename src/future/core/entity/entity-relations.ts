/**
 * List of entity relations.
 */
export type EntityRelationList = {
  [key: string]: EntityRelation
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
export type EntityRelation =
  | EntityRelationOneToMany
  | EntityRelationManyToManyOwner
  | EntityRelationManyToManyNotOwner
  | EntityRelationOneToOneOwner
  | EntityRelationOneToOneNotOwner
  | EntityRelationManyToOne

/**
 * one-to-many relation options.
 */
export type EntityRelationOneToMany = {
  type: "one-to-many"
  inverse: string
  reference: string
}

/**
 * many-to-many "owner" relation options.
 */
export type EntityRelationManyToManyOwner = {
  type: "many-to-many"
  owner: true
  inverse?: string
  reference: string
  referencedTable?: EntityRelationReferencedTable
}

/**
 * many-to-many "not owner" relation options.
 */
export type EntityRelationManyToManyNotOwner = {
  type: "many-to-many"
  owner: false
  inverse: string
  reference: string
}

/**
 * one-to-one "owner" relation options.
 */
export type EntityRelationOneToOneOwner = {
  type: "one-to-one"
  owner: true
  reference: string
  inverse?: string
  nullable?: boolean
  referencedColumns?:
    | EntityRelationReferencedColumn
    | [...EntityRelationReferencedColumn[]]
}

/**
 * one-to-one "not owner" relation options.
 */
export type EntityRelationOneToOneNotOwner = {
  type: "one-to-one"
  owner: false
  reference: string
  inverse: string
}

/**
 * many-to-one relation options.
 */
export type EntityRelationManyToOne = {
  type: "many-to-one"
  reference: string
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
