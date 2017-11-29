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
     * Insert a new row with given values into the given table.
     * Returns value of the generated column if given and generate column exist in the table.
     *
     * todo: reimplement, use QueryBuilder

    async insert(tableName: string, keyValues: ObjectLiteral): Promise<any> {
        // todo: fix generated columns
        let generatedColumn: ColumnMetadata|undefined;
        const keys = Object.keys(keyValues);
        const columns = keys.map(key => `"${key}"`).join(", ");
        const values = keys.map(key => ":" + key).join(", ");
        const parameters = keys.map(key => keyValues[key]);
        const generatedColumns = this.connection.hasMetadata(tableName) ? this.connection.getMetadata(tableName).generatedColumns : [];
        if (generatedColumns.length > 0)
            generatedColumn = generatedColumns.find(column => column.isPrimary && column.isGenerated);

        const insertSql = columns.length > 0
            ? `INSERT INTO "${tableName}" (${columns}) VALUES (${values})`
            : `INSERT INTO "${tableName}" DEFAULT VALUES`;
        if (generatedColumn) {
            const sql2 = `declare lastId number; begin ${insertSql} returning "${generatedColumn.databaseName}" into lastId; dbms_output.enable; dbms_output.put_line(lastId); dbms_output.get_line(:ln, :st); end;`;
            const saveResult = await this.query(sql2, parameters.concat([
                { dir: this.driver.oracle.BIND_OUT, type: this.driver.oracle.STRING, maxSize: 32767 },
                { dir: this.driver.oracle.BIND_OUT, type: this.driver.oracle.NUMBER }
            ]));
            return parseInt(saveResult[0]);
        } else {
            return this.query(insertSql, parameters);
        }
    } */

    /**
     * Updates rows that match given conditions in the given table.
     *
     * todo: reimplement, use QueryBuilder

    async update(tableName: string, valuesMap: ObjectLiteral, conditions: ObjectLiteral): Promise<any> {
        const updateValues = this.parametrize(valuesMap).join(", ");
        const conditionString = this.parametrize(conditions).join(" AND ");
        const sql = `UPDATE "${tableName}" SET ${updateValues} ${conditionString ? (" WHERE " + conditionString) : ""}`;
        const conditionParams = Object.keys(conditions).map(key => conditions[key]);
        const updateParams = Object.keys(valuesMap).map(key => valuesMap[key]);
        const allParameters = updateParams.concat(conditionParams);
        await this.query(sql, allParameters);
    }*/

    /**
     * Deletes from the given table by a given conditions.
     *
     * todo: reimplement, use QueryBuilder

    async delete(tableName: string, conditions: ObjectLiteral|ObjectLiteral[]|string, maybeParameters?: any[]): Promise<any> {
        const conditionString = typeof conditions === "string" ? conditions : this.parametrize(conditions).join(" AND ");
        const parameters = conditions instanceof Object ? Object.keys(conditions).map(key => (conditions as ObjectLiteral)[key]) : maybeParameters;

        const sql = `DELETE FROM "${tableName}" WHERE ${conditionString}`;
        await this.query(sql, parameters);
    }*/

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
    async dropTable(tableOrName: Table|string, ifExist?: boolean, dropForeignKeys: boolean = true, dropIndices: boolean = true): Promise<void> {
        // if dropTable called with dropForeignKeys = true, we must create foreign keys in down query.
        const createForeignKeys: boolean = dropForeignKeys;
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        // It needs because if table does not exist and dropForeignKeys or dropIndices is true, we don't need
        // to perform drop queries for foreign keys and indices.
        if (ifExist) {
            const isTableExist = await this.hasTable(table);
            if (!isTableExist) return Promise.resolve();
        }

        if (dropIndices) {
            table.indices.forEach(index => {
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

        upQueries.push(`ALTER TABLE "${oldTable.name}" RENAME TO "${newTable.name}"`);
        downQueries.push(`ALTER TABLE "${newTable.name}" RENAME TO "${oldTable.name}"`);

        // rename primary key constraint
        if (newTable.primaryColumns.length > 0) {
            const columnNames = newTable.primaryColumns.map(column => column.name);

            const oldPkName = this.connection.namingStrategy.primaryKeyName(oldTable, columnNames);
            const newPkName = this.connection.namingStrategy.primaryKeyName(newTable, columnNames);

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
        const queries = columns.map(column => this.addColumn(tableOrName as any, column));
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
        const clonedTable = table.clone();
        const upQueries: string[] = [];
        const downQueries: string[] = [];

        const oldColumn = oldTableColumnOrName instanceof TableColumn
            ? oldTableColumnOrName
            : table.columns.find(column => column.name === oldTableColumnOrName);
        if (!oldColumn)
            throw new Error(`Column "${oldTableColumnOrName}" was not found in the "${table.name}" table.`);

        if (newColumn.isGenerated !== oldColumn.isGenerated) {
            throw new Error(`Changing column's "isGenerated" property is not supported in Oracle driver. Drop column and recreate it with a new "isGenerated" property instead.`);
        }

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

        if (this.connection.driver.createFullType(oldColumn) !== this.connection.driver.createFullType(newColumn)
            || newColumn.default !== oldColumn.default
            || newColumn.isNullable !== oldColumn.isNullable) {

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

            } else if (newColumn.isPrimary === false) {
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

            } else if (newColumn.isUnique === false) {
                const uniqueConstraint = table.uniques.find(unique => {
                    return unique.columnNames.length === 1 && !!unique.columnNames.find(columnName => columnName === newColumn.name);
                });
                clonedTable.uniques.splice(clonedTable.uniques.indexOf(uniqueConstraint!), 1);
                upQueries.push(`ALTER TABLE "${table.name}" DROP CONSTRAINT "${uniqueConstraint!.name}"`);
                downQueries.push(`ALTER TABLE "${table.name}" ADD CONSTRAINT "${uniqueConstraint!.name}" UNIQUE ("${newColumn.name}")`);
            }
        }

        /*if (newColumn.isNullable !== oldColumn.isNullable) {
            const sql = `ALTER TABLE "${table.name}" MODIFY "${newColumn.name}" ${this.connection.driver.createFullType(newColumn)} ${newColumn.isNullable ? "NULL" : "NOT NULL"}`;
            await this.query(sql);

        } else if (this.connection.driver.createFullType(newColumn) !== this.connection.driver.createFullType(oldColumn)) { // elseif is used because
            const sql = `ALTER TABLE "${table.name}" MODIFY "${newColumn.name}" ${this.connection.driver.createFullType(newColumn)}`;
            await this.query(sql);
        }*/

        await this.executeQueries(upQueries, downQueries);
        this.replaceCachedTable(table, clonedTable);
    }

    /**
     * Changes a column in the table.
     */
    async changeColumns(tableOrName: Table|string, changedColumns: { newColumn: TableColumn, oldColumn: TableColumn }[]): Promise<void> {
        const updatePromises = changedColumns.map(async changedColumn => {
            return this.changeColumn(tableOrName, changedColumn.oldColumn, changedColumn.newColumn);
        });
        await Promise.all(updatePromises);
    }

    /**
     * Drops column in the table.
     */
    async dropColumn(tableOrName: Table|string, column: TableColumn): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const clonedTable = table.clone();
        const upQueries: string[] = [];
        const downQueries: string[] = [];

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

        table.removeColumn(column);
        this.replaceCachedTable(table, clonedTable);
    }

    /**
     * Drops the columns in the table.
     */
    async dropColumns(tableOrName: Table|string, columns: TableColumn[]): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getTable(tableOrName);
        const dropPromises = columns.map(column => this.dropColumn(table!, column));
        await Promise.all(dropPromises);
    }

    /**
     * Updates table's primary keys.
     * TODO: fix or remove
     */
    async updatePrimaryKeys(dbTable: Table): Promise<void> {
        /*if (!dbTable.primaryKey)
            return Promise.resolve();

        await this.query(`ALTER TABLE "${dbTable.name}" DROP CONSTRAINT "${dbTable.primaryKey.name}"`);
        const primaryColumnNames = dbTable.primaryKey.columnNames.map(columnName => "\"" + columnName + "\"");
        if (primaryColumnNames.length > 0)
            await this.query(`ALTER TABLE "${dbTable.name}" ADD PRIMARY KEY (${primaryColumnNames.join(", ")})`);*/
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
     * Drops an unique constraint.
     */
    async dropUniqueConstraint(tableOrName: Table|string, uniqueOrName: TableUnique|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const uniqueConstraint = uniqueOrName instanceof TableUnique ? uniqueOrName : table.uniques.find(u => u.name === uniqueOrName);
        if (!uniqueConstraint)
            throw new Error(`Supplied unique constraint does not found in table ${table.name}`);

        const up = this.dropUniqueConstraintSql(table, uniqueConstraint);
        const down = this.createUniqueConstraintSql(table, uniqueConstraint);
        await this.executeQueries(up, down);
        table.removeUniqueConstraint(uniqueConstraint);
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
        const promises = foreignKeys.map(foreignKey => this.createForeignKey(tableOrName as any, foreignKey));
        await Promise.all(promises);
    }

    /**
     * Drops a foreign key from the table.
     */
    async dropForeignKey(tableOrName: Table|string, foreignKeyOrName: TableForeignKey|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const foreignKey = foreignKeyOrName instanceof TableForeignKey ? foreignKeyOrName : table.foreignKeys.find(fk => fk.name === foreignKeyOrName);
        if (!foreignKey)
            throw new Error(`Supplied foreign key does not found in table ${table.name}`);

        const up = this.dropForeignKeySql(table, foreignKey);
        const down = this.createForeignKeySql(table, foreignKey);
        await this.executeQueries(up, down);
        table.removeForeignKey(foreignKey);
    }

    /**
     * Drops a foreign keys from the table.
     */
    async dropForeignKeys(tableOrName: Table|string, foreignKeys: TableForeignKey[]): Promise<void> {
        const promises = foreignKeys.map(foreignKey => this.dropForeignKey(tableOrName as any, foreignKey));
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
     * Drops an index from the table.
     */
    async dropIndex(tableOrName: Table|string, indexOrName: TableIndex|string): Promise<void> {
        const table = tableOrName instanceof Table ? tableOrName : await this.getCachedTable(tableOrName);
        const index = indexOrName instanceof TableIndex ? indexOrName : table.indices.find(i => i.name === indexOrName);
        if (!index)
            throw new Error(`Supplied index does not found in table ${table.name}`);

        const up = this.dropIndexSql(index);
        const down = this.createIndexSql(table, index);
        await this.executeQueries(up, down);
        table.removeIndex(index);
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
                    tableColumn.length = dbColumn["CHAR_COL_DECL_LENGTH"] ? dbColumn["CHAR_COL_DECL_LENGTH"].toString() : "";

                    if (tableColumn.type === "number" || tableColumn.type === "numeric" || tableColumn.type === "dec" || tableColumn.type === "decimal") {
                        tableColumn.precision = dbColumn["DATA_PRECISION"];
                        tableColumn.scale = dbColumn["DATA_SCALE"];
                    }

                    // TODO fix datatypes

                    tableColumn.default = dbColumn["DATA_DEFAULT"] !== null
                        && dbColumn["DATA_DEFAULT"] !== undefined
                        && dbColumn["DATA_DEFAULT"].trim() !== "NULL" ? tableColumn.default = dbColumn["DATA_DEFAULT"] : undefined;

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
                const isUniqueExist = !!table.uniques.find(unique => {
                    return !!(unique.columnNames.length === 1 && unique.columnNames.find(columnName => columnName === column.name));
                });
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