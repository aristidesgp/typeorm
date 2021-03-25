import { DriverTypes } from "../core"

export type PostgresTypes = DriverTypes<{
  int: { type: number }
  varchar: { type: string }
  boolean: { type: boolean }
}>
