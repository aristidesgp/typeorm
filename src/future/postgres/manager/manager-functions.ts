import { AnyDataSource } from "../../core"
import { PostgresManager } from "./manager-type"

export function createPostgresManager(
  dataSource: AnyDataSource,
): PostgresManager<any> {
  return {
    "@type": "Manager",
    repository(entity: any) {
      return {} as any
    },
  }
}
