import { PostgresQueryRunner } from "./query-runner-types"

export function createPostgresQueryRunner(): PostgresQueryRunner {
  return {
    "@type": "QueryRunner",
  }
}
