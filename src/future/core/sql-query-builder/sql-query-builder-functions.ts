import { AnyDriver } from "../driver"
import {
  SqlQueryBuilder,
  SQLTemplateStringParameterTypes,
} from "./sql-query-builder-types"

export function createSQLQueryBuilder<
  Driver extends AnyDriver
>(): SqlQueryBuilder<Driver> {
  return {
    templates: [],
    append(sql) {
      return this
    },
    mapTo(sql) {
      return this
    },
    options(options) {
      return this
    },
    async execute() {
      return null as any
    },
    stream() {
      return null as any
    },
    getSql(): string {
      return ""
    },
  }
}

/**
 * Template string to build SQL query.
 */
export function sql<Driver extends AnyDriver>(
  strings: TemplateStringsArray,
  ...parameters: SQLTemplateStringParameterTypes[]
): SqlQueryBuilder<Driver> {
  const qb = createSQLQueryBuilder()
  qb.templates.push({
    type: "sql",
    strings,
    parameters,
  })
  return qb
}

/**
 * Template string to build SQL query fragment.
 */
export function sqlFragment<Driver extends AnyDriver>(
  strings: TemplateStringsArray,
  ...parameters: SQLTemplateStringParameterTypes[]
): SqlQueryBuilder<Driver> {
  const qb = createSQLQueryBuilder()
  qb.templates.push({
    type: "sqlFragment",
    strings,
    parameters,
  })
  return qb
}
