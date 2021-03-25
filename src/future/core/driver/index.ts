import { QueryRunner } from "../../../query-runner/QueryRunner"
import { AnyEntity } from "../entity"
import { Manager } from "../manager"
import { Repository } from "../repository"

/**
 * List of supported driver types.
 */
export type DriverType =
  | "postgres"
  | "cockroachdb"
  | "mysql"
  | "mariadb"
  | "mssql"
  | "sap"
  | "oracle"
  | "sqlite"
  | "better-sqlite3"
  | "cordova"
  | "nativescript"
  | "react-native"
  | "sqljs"
  | "expo"
  | "aurora-data-api"
  | "aurora-data-api-pg"
  | "mongodb"

export type AnyDriverTypes = DriverTypes<any>

export type DriverTypes<ColumnTypes extends DriverColumnTypes> = {
  columnTypes: ColumnTypes
}

export type DriverColumnTypes = {
  [databaseTypeName: string]: DriverColumnTypeOptions<any>
}

export type DriverColumnTypeOptions<Type> = {
  type: Type
}

export type AnyDriver = Driver<any>

/**
 *
 */
export type Driver<Type extends DriverType> = {
  builder: {
    manager(): Manager<any>
    repository(entityName: string, entity: AnyEntity): Repository<any, any>
    queryRunner(): QueryRunner
  }
}
