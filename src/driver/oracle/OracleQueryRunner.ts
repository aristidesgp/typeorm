import {QueryRunner} from "../../query-runner/QueryRunner";
import {ObjectLiteral} from "../../common/ObjectLiteral";
import {TransactionAlreadyStartedError} from "../../error/TransactionAlreadyStartedError";
import {TransactionNotStartedError} from "../../error/TransactionNotStartedError";
import {TableColumn} from "../../schema-builder/table/TableColumn";
import {Table} from "../../schema-builder/table/Table";
import {TableForeignKey} from "../../schema-builder/table/TableForeignKey";
import {TableIndex} from "../../schema-builder/table/TableIndex";
import {QueryRunnerAlreadyReleasedError} from "../../error/QueryRunnerAlreadyReleasedError";
import {OracleDriver} from "./OracleDriver";
import {ReadStream} from "../../platform/PlatformTools";
import {QueryFailedError} from "../../error/QueryFailedError";
import {TableUnique} from "../../schema-builder/table/TableUnique";
import {Broadcaster} from "../../subscriber/Broadcaster";
import {BaseQueryRunner} from "../../query-runner/BaseQueryRunner";
import {OrmUtils} from "../../util/OrmUtils";
import {TableCheck} from "../../schema-builder/table/TableCheck";
import {PromiseUtils} from "../../index";

/**
 * Runs queries on a single oracle database connection.
 */
export class OracleQueryRunner extends BaseQueryRunner implements QueryRunner {

    // -------------------------------------------------------------------------
    // Public Implemented Properties
    // -------------------------------------------------------------------------

    /**
     * Database driver used by connection.
     */
    driver: OracleDriver;

    // -------------------------------------------------------------------------
    // Protected Properties
    // -------------------------------------------------------------------------

    /**
     * Promise used to obtain a database connection for a first time.
     */
    protected databaseConnectionPromise: Promise<any>;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(driver: OracleDriver, mode: "master"|"slave" = "master") {
        super();
        this.driver = driver;
        this.connection = driver.connection;
        this.broadcaster = new Broadcaster(this);
        this.mode = mode;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates/uses database connection from the connection pool to perform further operations.
     * Returns obtained database connection.
     */
    connect(): Promise<any> {
        if (this.databaseConnection)
            return Promise.resolve(this.databaseConnection);

        if (this.databaseConnectionPromise)
            return this.databaseConnectionPromise;

        if (this.mode === "slave" && this.driver.isReplicated) {
            this.databaseConnectionPromise = this.driver.obtainSlaveConnection().then(connection => {
                this.databaseConnection = connection;
                return this.databaseConnection;
            });

        } else { // master
            this.databaseConnectionPromise = this.driver.obtainMasterConnection().then(connection => {
                this.databaseConnection = connection;
                return this.databaseConnection;
            });
        }

        return this.databaseConnectionPromise;
    }

    /**
     * Releases used database connection.
     * You cannot use query runner methods once its released.
     */
    release(): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.isReleased = true;
            if (this.databaseConnection) {
                this.databaseConnection.close((err: any) => {
                    if (err)
                        return fail(err);

                    ok();
                });
            } else {
                ok();
            }
        });
    }

    /**
     * Starts transaction.
     */
    async startTransaction(): Promise<void> {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError();

        if (this.isTransactionActive)
            throw new TransactionAlreadyStartedError();

        // await this.query("START TRANSACTION");
        this.isTransactionActive = true;
    }

    /**
     * Commits transaction.
     * Error will be thrown if transaction was not started.
     */
    async commitTransaction(): Promise<void> {
        if (!this.isTransactionActive)
            throw new TransactionNotStartedError();

        await this.query("COMMIT");
        this.isTransactionActive = false;
    }

    /**
     * Rollbacks transaction.
     * Error will be thrown if transaction was not started.
     */
    async rollbackTransaction(): Promise<void> {
        if (!this.isTransactionActive)
            throw new TransactionNotStartedError();

        await this.query("ROLLBACK");
        this.isTransactionActive = false;
    }

    /**
     * Executes a given SQL query.
     */
    query(query: string, parameters?: any[]): Promise<any> {
        if (this.isReleased)
            throw new QueryRunnerAlreadyReleasedError();

        return new Promise(async (ok, fail) => {
            try {
                this.driver.connection.logger.logQuery(query, parameters, this);
                const queryStartTime = +new Date();

                const handler = (err: any, result: any) => {

                    // log slow queries if maxQueryExecution time is set
                    const maxQueryExecutionTime = this.driver.connection.options.maxQueryExecutionTime;
                    const queryEndTime = +new Date();
                    const queryExecutionTime = queryEndTime - queryStartTime;
                    if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime)
                        this.driver.connection.logger.logQuerySlow(queryExecutionTime, query, parameters, this);

                    if (err) {
                        this.driver.connection.logger.logQueryError(err, query, parameters, this);
                        return fail(new QueryFailedError(query, parameters, err));
                    }
                    ok(result.rows || result.outBinds);
                };
                const executionOptions = {
                    autoCommit: this.isTransactionActive ? false : true
                };

                const databaseConnection = await this.connect();
                databaseConnection.execute(query, parameters || {}, executionOptions, handler);

            } catch (err) {
                fail(err);
            }
        });
    }

    /**
     * Returns raw data stream.
     */
    stream(query: string, parameters?: any[], onEnd?: Function, onError?: Function): Promise<ReadStream> {
        throw new Error(`Stream is not supported by Oracle driver.`);
    }

    /**
     * Inserts rows into the closure table.
     */
    async insertIntoClosureTable(tableName: string, newEntityId: any, parentId: any, hasLevel: boolean): Promise<number> {
        let sql = "";
        if (hasLevel) {
            sql =   `INSERT INTO "${tableName}"("ancestor", "descendant", "level") ` +
                    `SELECT "ancestor", ${newEntityId}, "level" + 1 FROM "${tableName}" WHERE "descendant" = ${parentId} ` +
                    `UNION ALL SELECT ${newEntityId}, ${newEntityId}, 1`;
        } else {
            sql =   `INSERT INTO "${tableName}" ("ancestor", "descendant") ` +
                    `SELECT "ancestor", ${newEntityId} FROM "${tableName}" WHERE "descendant" = ${parentId} ` +
                    `UNION ALL SELECT ${newEntityId}, ${newEntityId}`;
        }
        await this.query(sql);
        const results: ObjectLiteral[] = await this.query(`SELECT MAX("level") as "level" FROM "${tableName}" WHERE "descendant" = ${parentId}`);
        return results && results[0] && results[0]["level"] ? parseInt(results[0]["level"]) + 1 : 1;
    }

    /**
     * Returns all available database names including system databases.
     */
    async getDatabases(): Promise<string[]> {
        return Promise.resolve([]);
    }

    /**
     * Returns all available schema names including system schemas.
     * If database parameter specified, returns schemas of that database.
     */
    async getSchemas(database?: string): Promise<string[]> {
        return Promise.resolve([]);
    }

    /**
     * Checks if database with the given name exist.
     */
    async hasDatabase(database: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    /**
     * Checks if schema with the given name exist.
     */
    async hasSchema(schema: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    /**
     * Checks if table with the given name exist in the database.
     */
    async hasTable(tableOrName: Table|string): Promise<boolean> {
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const sql = `SELECT "TABLE_NAME" FROM "USER_TABLES" WHERE "TABLE_NAME" = '${tableName}'`;
        const result = await this.query(sql);
        return result.length ? true : false;
    }

    /**
     * Checks if column with the given name exist in the given table.
     */
    async hasColumn(tableOrName: Table|string, columnName: string): Promise<boolean> {
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        const sql = `SELECT "COLUMN_NAME" FROM "USER_TAB_COLS" WHERE "TABLE_NAME" = '${tableName}' AND "COLUMN_NAME" = '${columnName}'`;
        const result = await this.query(sql);
        return result.length ? true : false;
    }

    /**
     * Creates a new database.
     */
    async createDatabase(database: string, ifNotExist?: boolean): Promise<void> {
        await this.query(`CREATE DATABASE IF NOT EXISTS "${database}"`);
    }

    /**
     * Drops database.
     */
    async dropDatabase(database: string, ifExist?: boolean): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Creates a new table schema.
     */
    async createSchema(schemas: string, ifNotExist?: boolean): Promise<void> {
        throw new Error(`Schema create queries are not supported by Oracle driver.`);
    }

    /**
     * Drops table schema.
     */
    async dropSchema(schemaPath: string, ifExist?: boolean): Promise<void> {
        throw new Error(`Schema drop queries are not supported by Oracle driver.`);
    }

    /**
     * Creates a new table.
     */
    async createTable(table: Table, ifNotExist: boolean = false, createForeignKeys: boolean = true, createIndices: boolean = true): Promise<void> {
        if (ifNotExist) {
            const isTableExist = await this.hasTable(table);
            if (isTableExist) return Promise.resolve();
        }
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        upQueries.push(this.createTableSql(table, createForeignKeys));
        downQueries.push(this.dropTableSql(table));

        // if createForeignKeys is true, we must drop created foreign keys in down query.
        // createTable does not need separate method to create foreign keys, because it create fk's in the same query with table creation.
        if (createForeignKeys)
            table.foreignKeys.forEach(foreignKey => downQueries.push(this.dropForeignKeySql(table, foreignKey)));

        if (createIndices) {
            table.indices.forEach(index => {
                const hasPrimaryAndIndexedColumns = table.primaryColumns.every(column => index.columnNames.indexOf(column.name) !== -1);
                if (hasPrimaryAndIndexedColumns)
                    return;

                // new index may be passed without name. In this case we generate index name manually.
                if (!index.name)
                    index.name = this.connection.namingStrategy.indexName(table.name, index.columnNames);
                upQueries.push(this.createIndexSql(table, index));
                downQueries.push(this.dropIndexSql(index));
            });
        }

        await this.executeQueries(upQueries, downQueries);
    }

    /**
     * Drops the table.
     */
    async dropTable(tableOrName: Table|string, ifExist?: boolean, dropForeignKeys: boolean = true, dropIndices: boolean = true): Promise<void> {// It needs because if table does not exist and dropForeignKeys or dropIndices is true, we don't need
        // to perform drop queries for foreign keys and indices.
        if (ifExist) {
            const isTableExist = await this.hasTable(tableOrName);
            if (!isTableExist) return Promise.resolve();
        }

        // if dropTable called with dropForeignKeys = true, we must create foreign keys in down query.
        const createForeignKeys: boolean = dropForeignKeys;
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const upQueries: string[] = [];
        const downQueries: string[] = [];


        if (dropIndices) {
            table.indices.forEach(index => {
                const primaryColumnNames = table.primaryColumns.map(column => column.name).sort();
                if (OrmUtils.isArraysEqual(primaryColumnNames, index.columnNames.sort()))
                    return;

                upQueries.push(this.dropIndexSql(index));
                downQueries.push(this.createIndexSql(table, index));
            });
        }

        // if dropForeignKeys is true, we just drop the table, otherwise we also drop table foreign keys.
        // createTable does not need separate method to create foreign keys, because it create fk's in the same query with table creation.
        if (dropForeignKeys)
            table.foreignKeys.forEach(foreignKey => upQueries.push(this.dropForeignKeySql(table, foreignKey)));

        upQueries.push(this.dropTableSql(table));
        downQueries.push(this.createTableSql(table, createForeignKeys));

        await this.executeQueries(upQueries, downQueries);
    }

    /**
     * Renames the given table.
     */
    async renameTable(oldTableOrName: Table|string, newTableOrName: Table|string): Promise<void> {
        const upQueries: string[] = [];
        const downQueries: string[] = [];
        const oldTable = oldTableOrName instanceof Table ? oldTableOrName : await this.getCachedTable(oldTableOrName);
        let newTable = oldTable.clone();

        if (newTableOrName instanceof Table) {
            newTable = newTableOrName;
        } else {
            newTable.name = newTableOrName;
        }

        // rename table
        upQueries.push(`ALTER TABLE "${oldTable.name}" RENAME TO "${newTable.name}"`);
        downQueries.push(`ALTER TABLE "${newTable.name}" RENAME TO "${oldTable.name}"`);

        // rename primary key constraint
        if (newTable.primaryColumns.length > 0) {
            const columnNames = newTable.primaryColumns.map(column => column.name);

            const oldPkName = this.connection.namingStrategy.primaryKeyName(oldTable, columnNames);
            const newPkName = this.connection.namingStrategy.primaryKeyName(newTable, columnNames);

            // build queries
            upQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${oldPkName}" TO "${newPkName}"`);
            downQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${newPkName}" TO "${oldPkName}"`);
        }

        // rename unique constraints
        newTable.uniques.forEach(unique => {
            // build new constraint name
            const newUniqueName = this.connection.namingStrategy.uniqueConstraintName(newTable, unique.columnNames);

            // build queries
            upQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${unique.name}" TO "${newUniqueName}"`);
            downQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${newUniqueName}" TO "${unique.name}"`);

            // replace constraint name
            unique.name = newUniqueName;
        });

        // rename index constraints
        newTable.indices.forEach(index => {
            // build new constraint name
            const newIndexName = this.connection.namingStrategy.indexName(newTable, index.columnNames);

            // build queries
            upQueries.push(`ALTER INDEX "${index.name}" RENAME TO "${newIndexName}"`);
            downQueries.push(`ALTER INDEX "${newIndexName}" RENAME TO "${index.name}"`);

            // replace constraint name
            index.name = newIndexName;
        });

        // rename foreign key constraints
        newTable.foreignKeys.forEach(foreignKey => {
            // build new constraint name
            const newForeignKeyName = this.connection.namingStrategy.foreignKeyName(newTable, foreignKey.columnNames);

            // build queries
            upQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${foreignKey.name}" TO "${newForeignKeyName}"`);
            downQueries.push(`ALTER TABLE "${newTable.name}" RENAME CONSTRAINT "${newForeignKeyName}" TO "${foreignKey.name}"`);

            // replace constraint name
            foreignKey.name = newForeignKeyName;
        });

        await this.executeQueries(upQueries, downQueries);

        // rename old table and replace it in cached tabled;
        oldTable.name = newTable.name;
        this.replaceCachedTable(oldTable, newTable);
    }

    /**
     * Creates a new column from the column in the table.
     */
    async addColumn(tableOrName: Table|string, column: TableColumn): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const clonedTable = table.clone();
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        upQueries.push(`ALTER TABLE "${table.name}" ADD ${this.buildCreateColumnSql(column)}`);
        downQueries.push(`ALTER TABLE "${table.name}" DROP COLUMN "${column.name}"`);

        // create or update primary key constraint
        if (column.isPrimary) {
            const primaryColumns = clonedTable.primaryColumns;
            // if table already have primary key, me must drop it and recreate again
            if (primaryColumns.length > 0) {
                const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
                const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
                upQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${pkName}"`);
                downQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
            }

            primaryColumns.push(column);
            const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
            const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
            upQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
            downQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${pkName}"`);
        }

        // create column index
        const columnIndex = clonedTable.indices.find(index => index.columnNames.length === 1 && index.columnNames[0] === column.name);
        if (columnIndex) {
            clonedTable.indices.splice(clonedTable.indices.indexOf(columnIndex), 1);
            upQueries.push(this.createIndexSql(table, columnIndex));
            downQueries.push(this.dropIndexSql(columnIndex));
        }

        // create unique constraint
        if (column.isUnique) {
            const uniqueConstraint = new TableUnique({
                name: this.connection.namingStrategy.uniqueConstraintName(table.name, [column.name]),
                columnNames: [column.name]
            });
            clonedTable.uniques.push(uniqueConstraint);
            upQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueConstraint.name}" UNIQUE ("${column.name}")`);
            downQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueConstraint.name}"`);
        }

        await this.executeQueries(upQueries, downQueries);

        clonedTable.addColumn(column);
        this.replaceCachedTable(table, clonedTable);
    }

    /**
     * Creates a new columns from the column in the table.
     */
    async addColumns(tableOrName: Table|string, columns: TableColumn[]): Promise<void> {
        const queries = columns.map(column => this.addColumn(tableOrName, column));
        await Promise.all(queries);
    }

    /**
     * Renames column in the given table.
     */
    async renameColumn(tableOrName: Table|string, oldTableColumnOrName: TableColumn|string, newTableColumnOrName: TableColumn|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const oldColumn = oldTableColumnOrName instanceof TableColumn ? oldTableColumnOrName : table.columns.find(c => c.name === oldTableColumnOrName);
        if (!oldColumn)
            throw new Error(`Column "${oldTableColumnOrName}" was not found in the "${table.name}" table.`);

        let newColumn: TableColumn|undefined = undefined;
        if (newTableColumnOrName instanceof TableColumn) {
            newColumn = newTableColumnOrName;
        } else {
            newColumn = oldColumn.clone();
            newColumn.name = newTableColumnOrName;
        }

        await this.changeColumn(table, oldColumn, newColumn);
    }

    /**
     * Changes a column in the table.
     */
    async changeColumn(tableOrName: Table|string, oldTableColumnOrName: TableColumn|string, newColumn: TableColumn): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        let clonedTable = table.clone();
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        const oldColumn = oldTableColumnOrName instanceof TableColumn
            ? oldTableColumnOrName
            : table.columns.find(column => column.name === oldTableColumnOrName);
        if (!oldColumn)
            throw new Error(`Column "${oldTableColumnOrName}" was not found in the "${table.name}" table.`);

        if ((newColumn.isGenerated !== oldColumn.isGenerated && newColumn.generationStrategy !== "uuid")
            || this.connection.driver.createFullType(oldColumn) !== this.connection.driver.createFullType(newColumn)) {

            // Oracle does not support changing of IDENTITY column, so we must drop column and recreate it again.
            // Also, we recreate column if column type changed
            await this.dropColumn(table, oldColumn);
            await this.addColumn(table, newColumn);

            // update cloned table
            clonedTable = table.clone();

        } else {
            if (newColumn.name !== oldColumn.name) {
                // rename column
                upQueries.push(`ALTER TABLE "${table.name}" RENAME COLUMN "${oldColumn.name}" TO "${newColumn.name}"`);
                downQueries.push(`ALTER TABLE "${table.name}" RENAME COLUMN "${newColumn.name}" TO "${oldColumn.name}"`);

                // rename column primary key constraint
                if (oldColumn.isPrimary === true) {
                    const primaryColumns = clonedTable.primaryColumns;

                    // build old primary constraint name
                    const columnNames = primaryColumns.map(column => column.name);
                    const oldPkName = this.connection.namingStrategy.primaryKeyName(clonedTable, columnNames);

                    // replace old column name with new column name
                    columnNames.splice(columnNames.indexOf(oldColumn.name), 1);
                    columnNames.push(newColumn.name);

                    // build new primary constraint name
                    const newPkName = this.connection.namingStrategy.primaryKeyName(clonedTable, columnNames);

                    upQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${oldPkName}" TO "${newPkName}"`);
                    downQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${newPkName}" TO "${oldPkName}"`);
                }

                // rename unique constraints
                clonedTable.findColumnUniques(oldColumn).forEach(unique => {
                    // build new constraint name
                    unique.columnNames.splice(unique.columnNames.indexOf(oldColumn.name), 1);
                    unique.columnNames.push(newColumn.name);
                    const newUniqueName = this.connection.namingStrategy.uniqueConstraintName(clonedTable, unique.columnNames);

                    // build queries
                    upQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${unique.name}" TO "${newUniqueName}"`);
                    downQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${newUniqueName}" TO "${unique.name}"`);

                    // replace constraint name
                    unique.name = newUniqueName;
                });

                // rename index constraints
                clonedTable.findColumnIndices(oldColumn).forEach(index => {
                    // build new constraint name
                    index.columnNames.splice(index.columnNames.indexOf(oldColumn.name), 1);
                    index.columnNames.push(newColumn.name);
                    const newIndexName = this.connection.namingStrategy.indexName(clonedTable, index.columnNames);

                    // build queries
                    upQueries.push(`ALTER INDEX "${index.name}" RENAME TO "${newIndexName}"`);
                    downQueries.push(`ALTER INDEX "${newIndexName}" RENAME TO "${index.name}"`);

                    // replace constraint name
                    index.name = newIndexName;
                });

                // rename foreign key constraints
                clonedTable.findColumnForeignKeys(oldColumn).forEach(foreignKey => {
                    // build new constraint name
                    foreignKey.columnNames.splice(foreignKey.columnNames.indexOf(oldColumn.name), 1);
                    foreignKey.columnNames.push(newColumn.name);
                    const newForeignKeyName = this.connection.namingStrategy.foreignKeyName(clonedTable, foreignKey.columnNames);

                    // build queries
                    upQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${foreignKey.name}" TO "${newForeignKeyName}"`);
                    downQueries.push(`ALTER TABLE "${table.name}" RENAME CONSTRAINT "${newForeignKeyName}" TO "${foreignKey.name}"`);

                    // replace constraint name
                    foreignKey.name = newForeignKeyName;
                });

                // rename old column in the Table object
                const oldTableColumn = clonedTable.columns.find(column => column.name === oldColumn.name);
                clonedTable.columns[clonedTable.columns.indexOf(oldTableColumn!)].name = newColumn.name;
                oldColumn.name = newColumn.name;
            }

            if (newColumn.default !== oldColumn.default || newColumn.isNullable !== oldColumn.isNullable) {

                let defaultUp: string = "";
                let defaultDown: string = "";
                let nullableUp:  string = "";
                let nullableDown:  string = "";

                // changing column default
                if (newColumn.default !== null && newColumn.default !== undefined) {
                    defaultUp = `DEFAULT ${newColumn.default}`;

                    if (oldColumn.default !== null && oldColumn.default !== undefined) {
                        defaultDown = `DEFAULT ${oldColumn.default}`;
                    } else {
                        defaultDown = "DEFAULT NULL";
                    }

                } else if (oldColumn.default !== null && oldColumn.default !== undefined) {
                    defaultUp = "DEFAULT NULL";
                    defaultDown = `DEFAULT ${oldColumn.default}`;
                }

                // changing column isNullable property
                if (newColumn.isNullable !== oldColumn.isNullable) {
                    if (newColumn.isNullable === true) {
                        nullableUp = "NULL";
                        nullableDown = "NOT NULL";
                    } else {
                        nullableUp = "NOT NULL";
                        nullableDown = "NULL";
                    }
                }

                upQueries.push(`ALTER TABLE "${table.name}" MODIFY "${oldColumn.name}" ${this.connection.driver.createFullType(newColumn)} ${defaultUp} ${nullableUp}`);
                downQueries.push(`ALTER TABLE "${table.name}" MODIFY "${oldColumn.name}" ${this.connection.driver.createFullType(oldColumn)} ${defaultDown} ${nullableDown}`);
            }

            if (newColumn.isPrimary !== oldColumn.isPrimary) {
                const primaryColumns = clonedTable.primaryColumns;

                // if primary column state changed, we must always drop existed constraint.
                if (primaryColumns.length > 0) {
                    const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
                    const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
                    upQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${pkName}"`);
                    downQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
                }

                if (newColumn.isPrimary === true) {
                    primaryColumns.push(newColumn);
                    const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
                    const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
                    upQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
                    downQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${pkName}"`);

                } else {
                    const primaryColumn = primaryColumns.find(c => c.name === newColumn.name);
                    primaryColumns.splice(primaryColumns.indexOf(primaryColumn!), 1);

                    // if we have another primary keys, we must recreate constraint.
                    if (primaryColumns.length > 0) {
                        const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
                        const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
                        upQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
                        downQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${pkName}"`);
                    }
                }
            }

            if (newColumn.isUnique !== oldColumn.isUnique) {
                if (newColumn.isUnique === true) {
                    const uniqueConstraint = new TableUnique({
                        name: this.connection.namingStrategy.uniqueConstraintName(table.name, [newColumn.name]),
                        columnNames: [newColumn.name]
                    });
                    clonedTable.uniques.push(uniqueConstraint);
                    upQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueConstraint.name}" UNIQUE ("${newColumn.name}")`);
                    downQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueConstraint.name}"`);

                } else {
                    const uniqueConstraint = table.uniques.find(unique => {
                        return unique.columnNames.length === 1 && !!unique.columnNames.find(columnName => columnName === newColumn.name);
                    });
                    clonedTable.uniques.splice(clonedTable.uniques.indexOf(uniqueConstraint!), 1);
                    upQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueConstraint!.name}"`);
                    downQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueConstraint!.name}" UNIQUE ("${newColumn.name}")`);
                }
            }

            await this.executeQueries(upQueries, downQueries);
            this.replaceCachedTable(table, clonedTable);
        }
    }

    /**
     * Changes a column in the table.
     */
    async changeColumns(tableOrName: Table|string, changedColumns: { newColumn: TableColumn, oldColumn: TableColumn }[]): Promise<void> {
        await PromiseUtils.runInSequence(changedColumns, changedColumn => {
            return this.changeColumn(tableOrName, changedColumn.oldColumn, changedColumn.newColumn);
        });
    }

    /**
     * Drops column in the table.
     */
    async dropColumn(tableOrName: Table|string, column: TableColumn): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const clonedTable = table.clone();
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        // drop primary key constraint
        const primaryColumns = clonedTable.primaryColumns;
        if (primaryColumns.length > 0 && primaryColumns.find(primaryColumn => primaryColumn.name === column.name)) {
            const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
            const columnNames = primaryColumns.map(primaryColumn => `"${primaryColumn.name}"`).join(", ");
            upQueries.push(`ALTER TABLE "${clonedTable.name}" DROP CONSTRAINT "${pkName}"`);
            downQueries.push(`ALTER TABLE "${clonedTable.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
            primaryColumns.splice(primaryColumns.indexOf(column), 1);

            // if primary key have multiple columns, we must recreate it without dropped column
            if (primaryColumns.length > 0) {
                const pkName = this.connection.namingStrategy.primaryKeyName(clonedTable.name, primaryColumns.map(column => column.name));
                const columnNames = primaryColumns.map(primaryColumn => `"${primaryColumn.name}"`).join(", ");
                upQueries.push(`ALTER TABLE "${clonedTable.name}" ADD CONSTRAINT "${pkName}" PRIMARY KEY (${columnNames})`);
                downQueries.push(`ALTER TABLE "${clonedTable.name}" DROP CONSTRAINT "${pkName}"`);
            }
        }

        // drop column index
        const columnIndex = clonedTable.indices.find(index => index.columnNames.length === 1 && index.columnNames[0] === column.name);
        if (columnIndex) {
            upQueries.push(this.dropIndexSql(columnIndex));
            downQueries.push(this.createIndexSql(table, columnIndex));
        }

        // drop unique constraint
        if (column.isUnique) {
            const uniqueName = this.connection.namingStrategy.uniqueConstraintName(table.name, [column.name]);
            const foundUnique = clonedTable.uniques.find(unique => unique.name === uniqueName);
            if (foundUnique)
                clonedTable.uniques.splice(clonedTable.uniques.indexOf(foundUnique), 1);
            upQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueName}"`);
            downQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueName}" UNIQUE ("${column.name}")`);
        }

        upQueries.push(`ALTER TABLE "${table.name}" DROP COLUMN "${column.name}"`);
        downQueries.push(`ALTER TABLE "${table.name}" ADD ${this.buildCreateColumnSql(column)}`);

        await this.executeQueries(upQueries, downQueries);

        clonedTable.removeColumn(column);
        this.replaceCachedTable(table, clonedTable);
    }

    /**
     * Drops the columns in the table.
     */
    async dropColumns(tableOrName: Table|string, columns: TableColumn[]): Promise<void> {
        const dropPromises = columns.map(column => this.dropColumn(tableOrName, column));
        await Promise.all(dropPromises);
    }

    /**
     * Creates a new primary key.
     */
    async createPrimaryKey(tableOrName: Table|string, columnNames: string[]): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const clonedTable = table.clone();

        const up = this.createPrimaryKeySql(table, columnNames);

        // mark columns as primary, because dropPrimaryKeySql build constraint name from table primary column names.
        clonedTable.columns.forEach(column => {
            if (columnNames.find(columnName => columnName === column.name))
                column.isPrimary = true;
        });
        const down = this.dropPrimaryKeySql(clonedTable);

        await this.executeQueries(up, down);
        this.replaceCachedTable(table, clonedTable);
    }

    /**
     * Drops a primary key.
     */
    async dropPrimaryKey(tableOrName: Table|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const up = this.dropPrimaryKeySql(table);
        const down = this.createPrimaryKeySql(table, table.primaryColumns.map(column => column.name));
        await this.executeQueries(up, down);
        table.primaryColumns.forEach(column => {
            column.isPrimary = false;
        });
    }

    /**
     * Creates a new unique constraint.
     */
    async createUniqueConstraint(tableOrName: Table|string, uniqueConstraint: TableUnique): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);

        // new unique constraint may be passed without name. In this case we generate unique name manually.
        if (!uniqueConstraint.name)
            uniqueConstraint.name = this.connection.namingStrategy.uniqueConstraintName(table.name, uniqueConstraint.columnNames);

        const up = this.createUniqueConstraintSql(table, uniqueConstraint);
        const down = this.dropUniqueConstraintSql(table, uniqueConstraint);
        await this.executeQueries(up, down);
        table.addUniqueConstraint(uniqueConstraint);
    }

    /**
     * Creates a new unique constraints.
     */
    async createUniqueConstraints(tableOrName: Table|string, uniqueConstraints: TableUnique[]): Promise<void> {
        const promises = uniqueConstraints.map(uniqueConstraint => this.createUniqueConstraint(tableOrName, uniqueConstraint));
        await Promise.all(promises);
    }

    /**
     * Drops an unique constraint.
     */
    async dropUniqueConstraint(tableOrName: Table|string, uniqueOrName: TableUnique|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const uniqueConstraint = uniqueOrName instanceof TableUnique ? uniqueOrName : table.uniques.find(u => u.name === uniqueOrName);
        if (!uniqueConstraint)
            throw new Error(`Supplied unique constraint was not found in table ${table.name}`);

        const up = this.dropUniqueConstraintSql(table, uniqueConstraint);
        const down = this.createUniqueConstraintSql(table, uniqueConstraint);
        await this.executeQueries(up, down);
        table.removeUniqueConstraint(uniqueConstraint);
    }

    /**
     * Creates an unique constraints.
     */
    async dropUniqueConstraints(tableOrName: Table|string, uniqueConstraints: TableUnique[]): Promise<void> {
        const promises = uniqueConstraints.map(uniqueConstraint => this.dropUniqueConstraint(tableOrName, uniqueConstraint));
        await Promise.all(promises);
    }

    /**
     * Creates a new foreign key.
     */
    async createForeignKey(tableOrName: Table|string, foreignKey: TableForeignKey): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);

        // new FK may be passed without name. In this case we generate FK name manually.
        if (!foreignKey.name)
            foreignKey.name = this.connection.namingStrategy.foreignKeyName(table.name, foreignKey.columnNames);

        const up = this.createForeignKeySql(table, foreignKey);
        const down = this.dropForeignKeySql(table, foreignKey);
        await this.executeQueries(up, down);
        table.addForeignKey(foreignKey);
    }

    /**
     * Creates a new foreign keys.
     */
    async createForeignKeys(tableOrName: Table|string, foreignKeys: TableForeignKey[]): Promise<void> {
        const promises = foreignKeys.map(foreignKey => this.createForeignKey(tableOrName, foreignKey));
        await Promise.all(promises);
    }

    /**
     * Drops a foreign key from the table.
     */
    async dropForeignKey(tableOrName: Table|string, foreignKeyOrName: TableForeignKey|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const foreignKey = foreignKeyOrName instanceof TableForeignKey ? foreignKeyOrName : table.foreignKeys.find(fk => fk.name === foreignKeyOrName);
        if (!foreignKey)
            throw new Error(`Supplied foreign key was not found in table ${table.name}`);

        const up = this.dropForeignKeySql(table, foreignKey);
        const down = this.createForeignKeySql(table, foreignKey);
        await this.executeQueries(up, down);
        table.removeForeignKey(foreignKey);
    }

    /**
     * Drops a foreign keys from the table.
     */
    async dropForeignKeys(tableOrName: Table|string, foreignKeys: TableForeignKey[]): Promise<void> {
        const promises = foreignKeys.map(foreignKey => this.dropForeignKey(tableOrName, foreignKey));
        await Promise.all(promises);
    }

    /**
     * Creates a new index.
     */
    async createIndex(tableOrName: Table|string, index: TableIndex): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);

        // new index may be passed without name. In this case we generate index name manually.
        if (!index.name)
            index.name = this.connection.namingStrategy.indexName(table.name, index.columnNames);

        const up = this.createIndexSql(table, index);
        const down = this.dropIndexSql(index);
        await this.executeQueries(up, down);
        table.addIndex(index);
    }

    /**
     * Creates a new indices
     */
    async createIndices(tableOrName: Table|string, indices: TableIndex[]): Promise<void> {
        const promises = indices.map(index => this.createIndex(tableOrName, index));
        await Promise.all(promises);
    }

    /**
     * Drops an index from the table.
     */
    async dropIndex(tableOrName: Table|string, indexOrName: TableIndex|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const index = indexOrName instanceof TableIndex ? indexOrName : table.indices.find(i => i.name === indexOrName);
        if (!index)
            throw new Error(`Supplied index was not found in table ${table.name}`);

        const up = this.dropIndexSql(index);
        const down = this.createIndexSql(table, index);
        await this.executeQueries(up, down);
        table.removeIndex(index);
    }

    /**
     * Drops an indices from the table.
     */
    async dropIndices(tableOrName: Table|string, indices: TableIndex[]): Promise<void> {
        const promises = indices.map(index => this.dropIndex(tableOrName, index));
        await Promise.all(promises);
    }

    /**
     * Clears all table contents.
     * Note: this operation uses SQL's TRUNCATE query which cannot be reverted in transactions.
     */
    async clearTable(tableName: string): Promise<void> {
        await this.query(`TRUNCATE TABLE "${tableName}"`);
    }

    /**
     * Removes all tables from the currently connected database.
     */
    async clearDatabase(): Promise<void> {
        await this.startTransaction();
        try {
            const dropTablesQuery = `SELECT 'DROP TABLE "' || TABLE_NAME || '" CASCADE CONSTRAINTS' AS "query" FROM "USER_TABLES"`;
            const dropQueries: ObjectLiteral[] = await this.query(dropTablesQuery);
            await Promise.all(dropQueries.map(query => this.query(query["query"])));
            await this.commitTransaction();

        } catch (error) {
            try { // we throw original error even if rollback thrown an error
                await this.rollbackTransaction();
            } catch (rollbackError) { }
            throw error;
        }

    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Loads all tables (with given names) from the database and creates a Table from them.
     */
    protected async loadTables(tableNames: string[]): Promise<Table[]> {

        // if no tables given then no need to proceed
        if (!tableNames || !tableNames.length)
            return [];

        // load tables, columns, indices and foreign keys
        const tableNamesString = tableNames.map(name => "'" + name + "'").join(", ");
        const tablesSql = `SELECT * FROM "USER_TABLES" WHERE "TABLE_NAME" IN (${tableNamesString})`;
        const columnsSql = `SELECT * FROM "USER_TAB_COLS" WHERE "TABLE_NAME" IN (${tableNamesString})`;

        const indicesSql = `SELECT "IND"."INDEX_NAME", "IND"."TABLE_NAME", "IND"."UNIQUENESS", ` +
            `LISTAGG ("COL"."COLUMN_NAME", ',') WITHIN GROUP (ORDER BY "COL"."COLUMN_NAME") AS "COLUMN_NAMES" ` +
            `FROM "USER_INDEXES" "IND" ` +
            `INNER JOIN "USER_IND_COLUMNS" "COL" ON "COL"."INDEX_NAME" = "IND"."INDEX_NAME" ` +
            `LEFT JOIN "USER_CONSTRAINTS" "CON" ON "CON"."CONSTRAINT_NAME" = "IND"."INDEX_NAME" ` +
            `WHERE "IND"."TABLE_NAME" IN (${tableNamesString}) AND "CON"."CONSTRAINT_NAME" IS NULL ` +
            `GROUP BY "IND"."INDEX_NAME", "IND"."TABLE_NAME", "IND"."UNIQUENESS"`;

        const foreignKeysSql = `SELECT "C"."CONSTRAINT_NAME", "C"."TABLE_NAME", "COL"."COLUMN_NAME", "REF_COL"."TABLE_NAME" AS "REFERENCED_TABLE_NAME", ` +
            `"REF_COL"."COLUMN_NAME" AS "REFERENCED_COLUMN_NAME", "C"."DELETE_RULE" AS "ON_DELETE" ` +
            `FROM "USER_CONSTRAINTS" "C" ` +
            `INNER JOIN "USER_CONS_COLUMNS" "COL" ON "COL"."OWNER" = "C"."OWNER" AND "COL"."CONSTRAINT_NAME" = "C"."CONSTRAINT_NAME" ` +
            `INNER JOIN "USER_CONS_COLUMNS" "REF_COL" ON "REF_COL"."OWNER" = "C"."R_OWNER" AND "REF_COL"."CONSTRAINT_NAME" = "C"."R_CONSTRAINT_NAME" AND "REF_COL"."POSITION" = "COL"."POSITION" ` +
            `WHERE "C"."TABLE_NAME" IN (${tableNamesString}) AND "C"."CONSTRAINT_TYPE" = 'R'`;

        const constraintsSql = `SELECT "C"."CONSTRAINT_NAME", "C"."CONSTRAINT_TYPE", "C"."TABLE_NAME", "COL"."COLUMN_NAME" ` +
            `FROM "USER_CONSTRAINTS" "C" ` +
            `INNER JOIN "USER_CONS_COLUMNS" "COL" ON "COL"."OWNER" = "C"."OWNER" AND "COL"."CONSTRAINT_NAME" = "C"."CONSTRAINT_NAME" ` +
            `WHERE "C"."TABLE_NAME" IN (${tableNamesString}) AND "C"."CONSTRAINT_TYPE" IN ('C', 'U', 'P') AND "C"."GENERATED" = 'USER NAME'`;

        const [dbTables, dbColumns, dbIndices, dbForeignKeys, dbConstraints]: ObjectLiteral[][] = await Promise.all([
            this.query(tablesSql),
            this.query(columnsSql),
            this.query(indicesSql),
            this.query(foreignKeysSql),
            this.query(constraintsSql),
        ]);

        // if tables were not found in the db, no need to proceed
        if (!dbTables.length)
            return [];

        // create tables for loaded tables
        return dbTables.map(dbTable => {
            const table = new Table();
            table.name = dbTable["TABLE_NAME"];

            // create columns from the loaded columns
            table.columns = dbColumns
                .filter(dbColumn => dbColumn["TABLE_NAME"] === table.name)
                .map(dbColumn => {
                    const columnConstraints = dbConstraints.filter(dbConstraint => dbConstraint["TABLE_NAME"] === table.name && dbConstraint["COLUMN_NAME"] === dbColumn["COLUMN_NAME"]);

                    const uniqueConstraint = columnConstraints.find(constraint => constraint["CONSTRAINT_TYPE"] === "U");
                    const isConstraintComposite = uniqueConstraint
                        ? !!dbConstraints.find(dbConstraint => dbConstraint["CONSTRAINT_TYPE"] === "U"
                            && dbConstraint["CONSTRAINT_NAME"] === uniqueConstraint["CONSTRAINT_NAME"]
                            && dbConstraint["COLUMN_NAME"] !== dbColumn["COLUMN_NAME"])
                        : false;
                    const isUnique = !!uniqueConstraint && !isConstraintComposite;

                    const isPrimary = !!columnConstraints.find(constraint =>  constraint["CONSTRAINT_TYPE"] === "P");

                    const tableColumn = new TableColumn();
                    tableColumn.name = dbColumn["COLUMN_NAME"];
                    tableColumn.type = dbColumn["DATA_TYPE"].toLowerCase();
                    if (tableColumn.type.indexOf("(") !== -1)
                        tableColumn.type = tableColumn.type.replace(/\([0-9]*\)/, "");

                    tableColumn.length = dbColumn["CHAR_COL_DECL_LENGTH"] ? dbColumn["CHAR_COL_DECL_LENGTH"].toString() : "";
                    if (tableColumn.type === "raw") {
                        tableColumn.length = dbColumn["DATA_LENGTH"].toString();
                    } else if (tableColumn.type === "clob" || tableColumn.type === "nclob") {
                        tableColumn.length = "";
                    }

                    if (tableColumn.type === "number"
                        || tableColumn.type === "numeric"
                        || tableColumn.type === "dec"
                        || tableColumn.type === "decimal"
                        || tableColumn.type === "float") {
                        if (dbColumn["DATA_PRECISION"] !== null)
                            tableColumn.precision = dbColumn["DATA_PRECISION"];
                        if (dbColumn["DATA_SCALE"] !== null)
                            tableColumn.scale = dbColumn["DATA_SCALE"];

                    } else if ((tableColumn.type === "timestamp"
                        || tableColumn.type === "timestamp with time zone"
                        || tableColumn.type === "timestamp with local time zone") && dbColumn["DATA_SCALE"] !== null) {
                        tableColumn.precision = dbColumn["DATA_SCALE"];
                    }

                    tableColumn.default = dbColumn["DATA_DEFAULT"] !== null
                        && dbColumn["DATA_DEFAULT"] !== undefined
                        && dbColumn["DATA_DEFAULT"].trim() !== "NULL" ? tableColumn.default = dbColumn["DATA_DEFAULT"].trim() : undefined;

                    tableColumn.isNullable = dbColumn["NULLABLE"] === "Y";
                    tableColumn.isUnique = isUnique;
                    tableColumn.isPrimary = isPrimary;
                    tableColumn.isGenerated = dbColumn["IDENTITY_COLUMN"] === "YES";
                    if (tableColumn.isGenerated) {
                        tableColumn.generationStrategy = "increment";
                        tableColumn.default = undefined;
                    }
                    tableColumn.comment = ""; // todo
                    return tableColumn;
                });

            // find unique constraints of table, group them by constraint name and build TableUnique.
            const tableUniqueConstraints = OrmUtils.uniq(dbConstraints.filter(dbConstraint => {
                return dbConstraint["TABLE_NAME"] === table.name && dbConstraint["CONSTRAINT_TYPE"] === "U";
            }), dbConstraint => dbConstraint["CONSTRAINT_NAME"]);

            table.uniques = tableUniqueConstraints.map(constraint => {
                const uniques = dbConstraints.filter(dbC => dbC["CONSTRAINT_NAME"] === constraint["CONSTRAINT_NAME"]);
                return new TableUnique({
                    name: constraint["CONSTRAINT_NAME"],
                    columnNames: uniques.map(u => u["COLUMN_NAME"])
                });
            });

            // find check constraints of table, group them by constraint name and build TableCheck.
            const tableCheckConstraints = OrmUtils.uniq(dbConstraints.filter(dbConstraint => {
                return dbConstraint["TABLE_NAME"] === table.name && dbConstraint["CONSTRAINT_TYPE"] === "C";
            }), dbConstraint => dbConstraint["CONSTRAINT_NAME"]);

            table.checks = tableCheckConstraints.map(constraint => {
                const checks = dbConstraints.filter(dbC => dbC["CONSTRAINT_NAME"] === constraint["CONSTRAINT_NAME"]);
                return new TableCheck({
                    name: constraint["CONSTRAINT_NAME"],
                    columnNames: checks.map(c => c["COLUMN_NAME"])
                });
            });

            // find foreign key constraints of table, group them by constraint name and build TableForeignKey.
            const tableForeignKeyConstraints = OrmUtils.uniq(dbForeignKeys.filter(dbForeignKey => {
                return dbForeignKey["TABLE_NAME"] === table.name;
            }), dbForeignKey => dbForeignKey["CONSTRAINT_NAME"]);

            table.foreignKeys = tableForeignKeyConstraints.map(dbForeignKey => {
                const foreignKeys = dbForeignKeys.filter(dbFk => dbFk["CONSTRAINT_NAME"] === dbForeignKey["CONSTRAINT_NAME"]);
                return new TableForeignKey({
                    name: dbForeignKey["CONSTRAINT_NAME"],
                    columnNames: foreignKeys.map(dbFk => dbFk["COLUMN_NAME"]),
                    referencedTableName: dbForeignKey["REFERENCED_TABLE_NAME"],
                    referencedColumnNames: foreignKeys.map(dbFk => dbFk["REFERENCED_COLUMN_NAME"]),
                    onDelete: dbForeignKey["ON_DELETE"] === "NO ACTION" ? undefined : dbForeignKey["ON_DELETE"]
                });
            });

            // create TableIndex objects from the loaded indices
            table.indices = dbIndices
                .filter(dbIndex => dbIndex["TABLE_NAME"] === table.name )
                .map(dbIndex => {
                    return new TableIndex({
                        name: dbIndex["INDEX_NAME"],
                        columnNames: dbIndex["COLUMN_NAMES"].split(","),
                        isUnique: dbIndex["UNIQUENESS"] === "UNIQUE"
                    });
                });

            return table;
        });
    }

    /**
     * Builds and returns SQL for create table.
     */
    protected createTableSql(table: Table, createForeignKeys?: boolean): string {
        const columnDefinitions = table.columns.map(column => this.buildCreateColumnSql(column)).join(", ");
        let sql = `CREATE TABLE "${table.name}" (${columnDefinitions}`;

        table.columns
            .filter(column => column.isUnique)
            .forEach(column => {
                const isUniqueExist = table.uniques.some(unique => unique.columnNames.length === 1 && unique.columnNames[0] === column.name);
                if (!isUniqueExist)
                    table.uniques.push(new TableUnique({
                        name: this.connection.namingStrategy.uniqueConstraintName(table.name, [column.name]),
                        columnNames: [column.name]
                    }));
            });

        if (table.uniques.length > 0) {
            const uniquesSql = table.uniques.map(unique => {
                const uniqueName = unique.name ? unique.name : this.connection.namingStrategy.uniqueConstraintName(table.name, unique.columnNames);
                const columnNames = unique.columnNames.map(columnName => `"${columnName}"`).join(", ");
                return `CONSTRAINT "${uniqueName}" UNIQUE (${columnNames})`;
            }).join(", ");

            sql += `, ${uniquesSql}`;
        }

        if (table.foreignKeys.length > 0 && createForeignKeys) {
            const foreignKeysSql = table.foreignKeys.map(fk => {
                const columnNames = fk.columnNames.map(columnName => `"${columnName}"`).join(", ");
                if (!fk.name)
                    fk.name = this.connection.namingStrategy.foreignKeyName(table.name, fk.columnNames);
                const referencedColumnNames = fk.referencedColumnNames.map(columnName => `"${columnName}"`).join(", ");
                let constraint = `CONSTRAINT "${fk.name}" FOREIGN KEY (${columnNames}) REFERENCES "${fk.referencedTableName}" (${referencedColumnNames})`;
                if (fk.onDelete)
                    constraint += ` ON DELETE ${fk.onDelete}`;

                return constraint;
            }).join(", ");

            sql += `, ${foreignKeysSql}`;
        }

        const primaryColumns = table.columns.filter(column => column.isPrimary);
        if (primaryColumns.length > 0) {
            const primaryKeyName = this.connection.namingStrategy.primaryKeyName(table.name, primaryColumns.map(column => column.name));
            const columnNames = primaryColumns.map(column => `"${column.name}"`).join(", ");
            sql += `, CONSTRAINT "${primaryKeyName}" PRIMARY KEY (${columnNames})`;
        }

        sql += `)`;

        return sql;
    }

    /**
     * Builds drop table sql.
     */
    protected dropTableSql(tableOrName: Table|string, ifExist?: boolean): string {
        const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;
        return ifExist ? `DROP TABLE IF EXISTS "${tableName}"` : `DROP TABLE "${tableName}"`;
    }

    /**
     * Builds create index sql.
     */
    protected createIndexSql(table: Table, index: TableIndex): string {
        const columns = index.columnNames.map(columnName => `"${columnName}"`).join(", ");
        return `CREATE ${index.isUnique ? "UNIQUE " : ""}INDEX "${index.name}" ON "${table.name}"(${columns})`;
    }

    /**
     * Builds drop index sql.
     */
    protected dropIndexSql(indexOrName: TableIndex|string): string {
        let indexName = indexOrName instanceof TableIndex ? indexOrName.name : indexOrName;
        return `DROP INDEX "${indexName}"`;
    }

    /**
     * Builds create primary key sql.
     */
    protected createPrimaryKeySql(table: Table, columnNames: string[]): string {
        const primaryKeyName = this.connection.namingStrategy.primaryKeyName(table.name, columnNames);
        const columnNamesString = columnNames.map(columnName => `"${columnName}"`).join(", ");
        return `ALTER TABLE "${table.name}" ADD CONSTRAINT "${primaryKeyName}" PRIMARY KEY (${columnNamesString})`;
    }

    /**
     * Builds drop primary key sql.
     */
    protected dropPrimaryKeySql(table: Table): string {
        const columnNames = table.primaryColumns.map(column => column.name);
        const primaryKeyName = this.connection.namingStrategy.primaryKeyName(table.name, columnNames);
        return `ALTER TABLE "${table.name}" DROP CONSTRAINT "${primaryKeyName}"`;
    }

    /**
     * Builds create unique constraint sql.
     */
    protected createUniqueConstraintSql(table: Table, uniqueConstraint: TableUnique): string {
        const columnNames = uniqueConstraint.columnNames.map(column => `"` + column + `"`).join(", ");
        return `ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueConstraint.name}" UNIQUE (${columnNames})`;
    }

    /**
     * Builds drop unique constraint sql.
     */
    protected dropUniqueConstraintSql(table: Table, uniqueOrName: TableUnique|string): string {
        const uniqueName = uniqueOrName instanceof TableUnique ? uniqueOrName.name : uniqueOrName;
        return `ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueName}"`;
    }

    /**
     * Builds create foreign key sql.
     */
    protected createForeignKeySql(table: Table, foreignKey: TableForeignKey): string {
        const columnNames = foreignKey.columnNames.map(column => `"` + column + `"`).join(", ");
        const referencedColumnNames = foreignKey.referencedColumnNames.map(column => `"` + column + `"`).join(",");
        let sql = `ALTER TABLE "${table.name}" ADD CONSTRAINT "${foreignKey.name}" FOREIGN KEY (${columnNames}) ` +
            `REFERENCES "${foreignKey.referencedTableName}" (${referencedColumnNames})`;
        if (foreignKey.onDelete)
            sql += ` ON DELETE ${foreignKey.onDelete}`;

        return sql;
    }

    /**
     * Builds drop foreign key sql.
     */
    protected dropForeignKeySql(table: Table, foreignKeyOrName: TableForeignKey|string): string {
        const foreignKeyName = foreignKeyOrName instanceof TableForeignKey ? foreignKeyOrName.name : foreignKeyOrName;
        return `ALTER TABLE "${table.name}" DROP CONSTRAINT "${foreignKeyName}"`;
    }

    /**
     * Builds a query for create column.
     */
    protected buildCreateColumnSql(column: TableColumn) {
        let c = `"${column.name}" ` + this.connection.driver.createFullType(column);
        if (column.charset)
            c += " CHARACTER SET " + column.charset;
        if (column.collation)
            c += " COLLATE " + column.collation;
        if (column.default !== undefined && column.default !== null) // DEFAULT must be placed before NOT NULL
            c += " DEFAULT " + column.default;
        if (column.isNullable !== true && !column.isGenerated) // NOT NULL is not supported with GENERATED
            c += " NOT NULL";
        if (column.isGenerated === true && column.generationStrategy === "increment")
            c += " GENERATED ALWAYS AS IDENTITY";

        return c;
    }


}