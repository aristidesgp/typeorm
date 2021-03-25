import { QueryRunner } from "../../query-runner/QueryRunner"
import { Driver, Manager, Repository } from "../core"

export const PostgresDriver: Driver<"postgres"> = {
  builder: {
    manager(): Manager<any> {
      return null as any
    },
    repository(): Repository<any, any> {
      return null as any
    },
    queryRunner(): QueryRunner {
      return null as any
    },
  },
}
