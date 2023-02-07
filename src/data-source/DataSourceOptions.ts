import type { CockroachConnectionOptions } from "../driver/cockroachdb/CockroachConnectionOptions"
import type { MysqlConnectionOptions } from "../driver/mysql/MysqlConnectionOptions"
import type { PostgresConnectionOptions } from "../driver/postgres/PostgresConnectionOptions"
import type { SqliteConnectionOptions } from "../driver/sqlite/SqliteConnectionOptions"
import type { SqlServerConnectionOptions } from "../driver/sqlserver/SqlServerConnectionOptions"
import type { OracleConnectionOptions } from "../driver/oracle/OracleConnectionOptions"
import type { MongoConnectionOptions } from "../driver/mongodb/MongoConnectionOptions"
import type { CordovaConnectionOptions } from "../driver/cordova/CordovaConnectionOptions"
import type { SqljsConnectionOptions } from "../driver/sqljs/SqljsConnectionOptions"
import type { ReactNativeConnectionOptions } from "../driver/react-native/ReactNativeConnectionOptions"
import type { NativescriptConnectionOptions } from "../driver/nativescript/NativescriptConnectionOptions"
import type { ExpoConnectionOptions } from "../driver/expo/ExpoConnectionOptions"
import type { AuroraMysqlConnectionOptions } from "../driver/aurora-mysql/AuroraMysqlConnectionOptions"
import type { SapConnectionOptions } from "../driver/sap/SapConnectionOptions"
import type { AuroraPostgresConnectionOptions } from "../driver/aurora-postgres/AuroraPostgresConnectionOptions"
import type { BetterSqlite3ConnectionOptions } from "../driver/better-sqlite3/BetterSqlite3ConnectionOptions"
import type { CapacitorConnectionOptions } from "../driver/capacitor/CapacitorConnectionOptions"
import type { SpannerConnectionOptions } from "../driver/spanner/SpannerConnectionOptions"

/**
 * DataSourceOptions is an interface with settings and options for specific DataSource.
 */
export type DataSourceOptions =
    | MysqlConnectionOptions
    | PostgresConnectionOptions
    | CockroachConnectionOptions
    | SqliteConnectionOptions
    | SqlServerConnectionOptions
    | SapConnectionOptions
    | OracleConnectionOptions
    | CordovaConnectionOptions
    | NativescriptConnectionOptions
    | ReactNativeConnectionOptions
    | SqljsConnectionOptions
    | MongoConnectionOptions
    | AuroraMysqlConnectionOptions
    | AuroraPostgresConnectionOptions
    | ExpoConnectionOptions
    | BetterSqlite3ConnectionOptions
    | CapacitorConnectionOptions
    | SpannerConnectionOptions
