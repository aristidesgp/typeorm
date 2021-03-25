import { Driver } from "../core"
import { PostgresDriver } from "./driver"

export * from "./driver"
export * from "./entity"
export * from "./types"

export function postgres(): Driver {
  return PostgresDriver
}
