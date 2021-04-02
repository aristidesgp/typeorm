export interface PostgresColumnTypes {
  int: { type: number }
  varchar: { type: string }
  boolean: { type: boolean }
}
export type PostgresOrderTypes =
  | "asc"
  | "desc"
  | {
      direction?: "asc" | "desc"
      nulls?: "first" | "last"
    }

export type PostgresIsolationLevels =
  | "READ UNCOMMITTED"
  | "READ COMMITTED"
  | "REPEATABLE READ"
  | "SERIALIZABLE"

export type PostgresDriverTypes = {
  columnTypes: PostgresColumnTypes
  orderTypes: PostgresOrderTypes
  lockTypes: ""
  insertResult: any
  updateResult: any
  deleteResult: any
  queryResult: any
  isolationLevels: PostgresIsolationLevels
}
