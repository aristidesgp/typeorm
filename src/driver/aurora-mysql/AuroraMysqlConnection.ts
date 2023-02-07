import type { AuroraMysqlQueryRunner } from "./AuroraMysqlQueryRunner"
import { DataSource } from "../../data-source/DataSource"
import type { ReplicationMode } from "../types/ReplicationMode"
import type { DataSourceOptions } from "../../data-source"
import type { QueryRunner } from "../../query-runner/QueryRunner"

/**
 * Organizes communication with MySQL DBMS.
 */
export class AuroraMysqlConnection extends DataSource {
    queryRunner: AuroraMysqlQueryRunner

    constructor(
        options: DataSourceOptions,
        queryRunner: AuroraMysqlQueryRunner,
    ) {
        super(options)
        this.queryRunner = queryRunner
    }

    public createQueryRunner(mode: ReplicationMode): QueryRunner {
        return this.queryRunner
    }
}
