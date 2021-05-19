import { AnyDataSource } from "../data-source"
import {
  SqlQueryBuilder,
  SQLTemplateStringParameterTypes,
} from "./sql-query-builder-types"

export function createSQLQueryBuilder<
  DataSource extends AnyDataSource
>(): SqlQueryBuilder<DataSource> {
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
export function sql<DataSource extends AnyDataSource>(
  strings: TemplateStringsArray,
  ...parameters: SQLTemplateStringParameterTypes[]
): SqlQueryBuilder<DataSource> {
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
export function sqlFragment<DataSource extends AnyDataSource>(
  strings: TemplateStringsArray,
  ...parameters: SQLTemplateStringParameterTypes[]
): SqlQueryBuilder<DataSource> {
  const qb = createSQLQueryBuilder()
  qb.templates.push({
    type: "sqlFragment",
    strings,
    parameters,
  })
  return qb
}
