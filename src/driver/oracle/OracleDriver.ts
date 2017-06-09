import {Driver} from "../Driver";
import {ConnectionIsNotSetError} from "../error/ConnectionIsNotSetError";
import {DatabaseConnection} from "../DatabaseConnection";
import {DriverPackageNotInstalledError} from "../error/DriverPackageNotInstalledError";
import {QueryRunner} from "../../query-runner/QueryRunner";
import {OracleQueryRunner} from "./OracleQueryRunner";
import {ColumnTypes} from "../../metadata/types/ColumnTypes";
import {ObjectLiteral} from "../../common/ObjectLiteral";
import {ColumnMetadata} from "../../metadata/ColumnMetadata";
import {DriverOptionNotSetError} from "../error/DriverOptionNotSetError";
import {DataUtils} from "../../util/DataUtils";
import {PlatformTools} from "../../platform/PlatformTools";
import {Connection} from "../../connection/Connection";
import {SchemaBuilder} from "../../schema-builder/SchemaBuilder";
import {OracleConnectionOptions} from "./OracleConnectionOptions";

/**
 * Organizes communication with Oracle RDBMS.
 *
 * todo: this driver is not 100% finished yet, need to fix all issues that are left
 */
export class OracleDriver implements Driver {

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    protected options: OracleConnectionOptions;

    /**
     * Underlying oracle library.
     */
    protected oracle: any;

    /**
     * Database connection pool created by underlying driver.
     */
    protected pool: any;

    /**
     * Pool of database connections.
     */
    protected databaseConnectionPool: DatabaseConnection[] = [];

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected connection: Connection) {

        // Object.assign(connection.options, DriverUtils.buildDriverOptions(connection.options)); // todo: do it better way

        this.options = connection.options as OracleConnectionOptions;

        // validate options to make sure everything is set
        if (!this.options.host)
            throw new DriverOptionNotSetError("host");
        if (!this.options.username)
            throw new DriverOptionNotSetError("username");
        if (!this.options.sid)
            throw new DriverOptionNotSetError("sid");

        // load oracle package
        this.loadDependencies();

        // extra oracle setup
        this.oracle.outFormat = this.oracle.OBJECT;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Performs connection to the database.
     * Based on pooling options, it can either create connection immediately,
     * either create a pool and create connection when needed.
     */
    connect(): Promise<void> {

        // build connection options for the driver
        const options = Object.assign({}, {
            user: this.options.username,
            password: this.options.password,
            connectString: this.options.host + ":" + this.options.port + "/" + this.options.sid,
        }, this.options.extra || {});

        // pooling is enabled either when its set explicitly to true,
        // either when its not defined at all (e.g. enabled by default)
        return new Promise<void>((ok, fail) => {
            this.oracle.createPool(options, (err: any, pool: any) => {
                if (err)
                    return fail(err);

                this.pool = pool;
                ok();
            });
        });
    }

    /**
     * Closes connection with the database.
     */
    disconnect(): Promise<void> {
        if (!this.pool)
            throw new ConnectionIsNotSetError("oracle");

        return new Promise<void>((ok, fail) => {
            const handler = (err: any) => err ? fail(err) : ok();

            // if pooling is used, then disconnect from it
            this.pool.close(handler);
            this.pool = undefined;
            this.databaseConnectionPool = [];
        });
    }

    /**
     * Synchronizes database schema (creates tables, indices, etc).
     */
    syncSchema(): Promise<void> {
        const schemaBuilder = new SchemaBuilder(this.connection);
        return schemaBuilder.build();
    }

    /**
     * Creates a query runner used for common queries.
     */
    async createQueryRunner(): Promise<QueryRunner> {
        if (!this.pool)
            return Promise.reject(new ConnectionIsNotSetError("oracle"));

        const databaseConnection = await this.retrieveDatabaseConnection();
        return new OracleQueryRunner(this.connection, databaseConnection);
    }

    /**
     * Access to the native implementation of the database.
     */
    nativeInterface() {
        return {
            driver: this.oracle,
            pool: this.pool
        };
    }

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]] {
        if (!parameters || !Object.keys(parameters).length)
            return [sql, []];
        const escapedParameters: any[] = [];
        const keys = Object.keys(parameters).map(parameter => "(:" + parameter + "\\b)").join("|");
        sql = sql.replace(new RegExp(keys, "g"), (key: string) => {
            escapedParameters.push(parameters[key.substr(1)]);
            return key;
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, escapedParameters];
    }

    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string {
        return `"${columnName}"`;
    }

    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string {
        return `"${aliasName}"`;
    }

    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string {
        return `"${tableName}"`;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
        if (value === null || value === undefined)
            return null;

        switch (columnMetadata.type) {
            case ColumnTypes.BOOLEAN:
                return value === true ? 1 : 0;

            case ColumnTypes.DATE:
                return DataUtils.mixedDateToDateString(value);

            case ColumnTypes.TIME:
                return DataUtils.mixedDateToTimeString(value);

            case ColumnTypes.DATETIME:
                if (columnMetadata.localTimezone) {
                    return DataUtils.mixedDateToDatetimeString(value);
                } else {
                    return DataUtils.mixedDateToUtcDatetimeString(value);
                }

            case ColumnTypes.JSON:
                return JSON.stringify(value);

            case ColumnTypes.SIMPLE_ARRAY:
                return DataUtils.simpleArrayToString(value);
        }

        return value;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
        switch (columnMetadata.type) {
            case ColumnTypes.BOOLEAN:
                return value ? true : false;

            case ColumnTypes.DATETIME:
                return DataUtils.normalizeHydratedDate(value, columnMetadata.localTimezone === true);

            case ColumnTypes.DATE:
                return DataUtils.mixedDateToDateString(value);

            case ColumnTypes.TIME:
                return DataUtils.mixedTimeToString(value);

            case ColumnTypes.JSON:
                return JSON.parse(value);

            case ColumnTypes.SIMPLE_ARRAY:
                return DataUtils.stringToSimpleArray(value);
        }

        return value;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Retrieves a new database connection.
     * If pooling is enabled then connection from the pool will be retrieved.
     * Otherwise active connection will be returned.
     */
    protected retrieveDatabaseConnection(): Promise<DatabaseConnection> {
        return new Promise((ok, fail) => {
            this.pool.getConnection((err: any, connection: any) => {
                if (err)
                    return fail(err);

                let dbConnection = this.databaseConnectionPool.find(dbConnection => dbConnection.connection === connection);
                if (!dbConnection) {
                    dbConnection = {
                        id: this.databaseConnectionPool.length,
                        connection: connection,
                        isTransactionActive: false
                    };
                    dbConnection.releaseCallback = () => {
                        return new Promise<void>((ok, fail) => {
                            connection.close((err: any) => {
                                if (err)
                                    return fail(err);

                                if (this.pool && dbConnection) {
                                    this.databaseConnectionPool.splice(this.databaseConnectionPool.indexOf(dbConnection), 1);
                                }
                                ok();
                            });
                        });
                    };
                    this.databaseConnectionPool.push(dbConnection);
                }
                ok(dbConnection);
            });
        });
    }

    /**
     * Loads all driver dependencies.
     */
    protected loadDependencies(): void {
        try {
            this.oracle = PlatformTools.load("oracledb");

        } catch (e) {
            throw new DriverPackageNotInstalledError("Oracle", "oracledb");
        }
    }

}