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

export type PostgresDriverTypes = {
  columnTypes: PostgresColumnTypes
  orderTypes: PostgresOrderTypes
  lockTypes: ""
}
