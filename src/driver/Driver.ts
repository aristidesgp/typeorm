import {QueryRunner} from "../query-runner/QueryRunner";
import {ColumnMetadata} from "../metadata/ColumnMetadata";
import {ObjectLiteral} from "../common/ObjectLiteral";
import {ColumnType} from "./types/ColumnTypes";
import {MappedColumnTypes} from "./types/MappedColumnTypes";
import {SchemaBuilder} from "../schema-builder/SchemaBuilder";

/**
 * Driver organizes TypeORM communication with specific database management system.
 */
export interface Driver {

    /**
     * Gets list of supported column data types by a driver.
     */
    supportedDataTypes: ColumnType[];

    /**
     * Orm has special columns and we need to know what database column types should be for those types.
     * Column types are driver dependant.
     */
    mappedDataTypes: MappedColumnTypes;

    /**
     * Performs connection to the database.
     * Depend on driver type it may create a connection pool.
     */
    connect(): Promise<void>;

    /**
     * Closes connection with database and releases all resourc.
     */
    disconnect(): Promise<void>;

    /**
     * Synchronizes database schema (creates tables, indices, etc).
     */
    createSchemaBuilder(): SchemaBuilder;

    /**
     * Creates a query runner used for common queries.
     */
    createQueryRunner(): QueryRunner;

    /**
     * Replaces parameters in the given sql with special escaping character
     * and an array of parameter names to be passed to a query.
     */
    escapeQueryWithParameters(sql: string, parameters: ObjectLiteral): [string, any[]];

    /**
     * Escapes a column name.
     */
    escapeColumnName(columnName: string): string;

    /**
     * Escapes an alias.
     */
    escapeAliasName(aliasName: string): string;

    /**
     * Escapes a table name.
     */
    escapeTableName(tableName: string): string;

    /**
     * Prepares given value to a value to be persisted, based on its column type and metadata.
     */
    preparePersistentValue(value: any, column: ColumnMetadata): any;

    /**
     * Prepares given value to a value to be persisted, based on its column type.
     */
    prepareHydratedValue(value: any, column: ColumnMetadata): any;

    /**
     * Converts a column type of the metadata to the database column's type.
     */
    normalizeType(column: ColumnMetadata): string;

}