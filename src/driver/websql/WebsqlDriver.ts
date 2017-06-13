import {Driver} from "../Driver";
import {ConnectionIsNotSetError} from "../error/ConnectionIsNotSetError";
import {DatabaseConnection} from "../DatabaseConnection";
import {DriverUtils} from "../DriverUtils";
import {QueryRunner} from "../../query-runner/QueryRunner";
import {ObjectLiteral} from "../../common/ObjectLiteral";
import {ColumnMetadata} from "../../metadata/ColumnMetadata";
import {DriverOptionNotSetError} from "../error/DriverOptionNotSetError";
import {DataUtils} from "../../util/DataUtils";
import {WebsqlQueryRunner} from "./WebsqlQueryRunner";
import {Connection} from "../../connection/Connection";
import {SchemaBuilder} from "../../schema-builder/SchemaBuilder";
import {WebSqlConnectionOptions} from "./WebSqlConnectionOptions";
import {MappedColumnTypes} from "../types/MappedColumnTypes";
import {ColumnType} from "../types/ColumnTypes";

/**
 * Declare a global function that is only available in browsers that support WebSQL.
 */
declare function openDatabase(...params: any[]): any;

/**
 * Organizes communication with WebSQL in the browser.
 */
export class WebsqlDriver implements Driver {

    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Gets list of supported column data types by a driver.
     *
     * @see https://www.tutorialspoint.com/sqlite/sqlite_data_types.htm
     * @see https://sqlite.org/datatype3.html
     */
    supportedDataTypes: ColumnType[] = [
        "int",
        "integer",
        "tinyint",
        "smallint",
        "mediumint",
        "bigint",
        "int2",
        "int8",
        "integer",
        "character",
        "varchar",
        "varying character",
        "nchar",
        "native character",
        "nvarchar",
        "text",
        "clob",
        "text",
        "blob",
        "real",
        "double",
        "double precision",
        "float",
        "real",
        "numeric",
        "decimal",
        "boolean",
        "date",
        "datetime",
    ];

    /**
     * Orm has special columns and we need to know what database column types should be for those types.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes = {
        createDate: "datetime",
        updateDate: "datetime",
        version: "number",
        treeLevel: "number",
        migrationName: "varchar",
        migrationTimestamp: "timestamp",
    };

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * Connection options.
     */
    protected options: WebSqlConnectionOptions;

    /**
     * Connection to database.
     */
    protected databaseConnection: DatabaseConnection|undefined;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected connection: Connection) {

        this.options = connection.options as WebSqlConnectionOptions;
        Object.assign(connection.options, DriverUtils.buildDriverOptions(connection.options)); // todo: do it better way

        // validate options to make sure everything is set
        // if (!this.options.host)
        //     throw new DriverOptionNotSetError("host");
        // if (!this.options.username)
        //     throw new DriverOptionNotSetError("username");
        if (!this.options.database)
            throw new DriverOptionNotSetError("database");
        // todo: what about extra options: version, description, size
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
            database: this.options.database,
        }, this.options.extra || {});

        return new Promise<void>((ok, fail) => {
            const connection = openDatabase(
                options.database,
                options.version,
                options.description,
                options.size,
            );
            this.databaseConnection = {
                id: 1,
                connection: connection
            };
            ok();
        });
    }

    /**
     * Closes connection with the database.
     */
    disconnect(): Promise<void> {
        if (!this.databaseConnection)
            throw new ConnectionIsNotSetError("websql");

        return new Promise<void>((ok, fail) => {
            // const handler = (err: any) => err ? fail(err) : ok();
            // todo: find out how to close connection
            ok();
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
        if (!this.databaseConnection)
            return Promise.reject(new ConnectionIsNotSetError("websql"));

        const databaseConnection = await this.retrieveDatabaseConnection();
        return new WebsqlQueryRunner(this.connection, databaseConnection);
    }

    /**
     * Access to the native implementation of the database.
     */
    nativeInterface() {
        return {
            connection: this.databaseConnection ? this.databaseConnection.connection : undefined
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
            return "?";
        }); // todo: make replace only in value statements, otherwise problems
        return [sql, escapedParameters];
    }

    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string {
        return columnName; // "`" + columnName + "`";
    }

    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string {
        return aliasName; // "`" + aliasName + "`";
    }

    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string {
        return tableName; // "`" + tableName + "`";
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, columnMetadata: ColumnMetadata): any {
        if (value === null || value === undefined)
            return value;

        if (columnMetadata.type === Boolean) {
            return value === true ? 1 : 0;

        } else if (columnMetadata.type === "date") {
            return DataUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "time") {
            return DataUtils.mixedDateToTimeString(value);

        } else if (columnMetadata.type === "datetime") {
            return DataUtils.mixedDateToUtcDatetimeString(value);

        } else if (columnMetadata.type === "json") {
            return JSON.stringify(value);

        } else if (columnMetadata.type === "simple-array") {
            return DataUtils.simpleArrayToString(value);
        }

        return value;
    }

    /**
     * Prepares given value to a value to be persisted, based on its column type or metadata.
     */
    prepareHydratedValue(value: any, columnMetadata: ColumnMetadata): any {
        if (columnMetadata.type === Boolean) {
            return value ? true : false;

        } else if (columnMetadata.type === "datetime") {
            return DataUtils.normalizeHydratedDate(value);

        } else if (columnMetadata.type === "date") {
            return DataUtils.mixedDateToDateString(value);

        } else if (columnMetadata.type === "time") {
            return DataUtils.mixedTimeToString(value);

        } else if (columnMetadata.type === "json") {
            return JSON.parse(value);

        } else if (columnMetadata.type === "simple-array") {
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
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);

        throw new ConnectionIsNotSetError("websql");
    }

}