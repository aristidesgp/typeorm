import {Selection} from "./alias/Selection";
import {SelectionMap} from "./alias/SelectionMap";
import {RawSqlResultsToEntityTransformer} from "./transformer/RawSqlResultsToEntityTransformer";
import {EntityMetadata} from "../metadata/EntityMetadata";
import {ObjectLiteral} from "../common/ObjectLiteral";
import {QueryRunner} from "../query-runner/QueryRunner";
import {SqlServerDriver} from "../driver/sqlserver/SqlServerDriver";
import {OrderByCondition} from "../find-options/OrderByCondition";
import {Connection} from "../connection/Connection";
import {JoinOptions} from "./JoinOptions";
import {QueryRunnerProvider} from "../query-runner/QueryRunnerProvider";
import {PessimisticLockTransactionRequiredError} from "./error/PessimisticLockTransactionRequiredError";
import {NoVersionOrUpdateDateColumnError} from "./error/NoVersionOrUpdateDateColumnError";
import {OptimisticLockVersionMismatchError} from "./error/OptimisticLockVersionMismatchError";
import {OptimisticLockCanNotBeUsedError} from "./error/OptimisticLockCanNotBeUsedError";
import {PostgresDriver} from "../driver/postgres/PostgresDriver";
import {MysqlDriver} from "../driver/mysql/MysqlDriver";
import {LockNotSupportedOnGivenDriverError} from "./error/LockNotSupportedOnGivenDriverError";
import {ColumnMetadata} from "../metadata/ColumnMetadata";
import {JoinAttribute} from "./JoinAttribute";
import {JoinRelationAttribute} from "./JoinRelationAttribute";
import {RelationCountAttribute} from "./RelationCountAttribute";
import {QueryBuilderUtils} from "./QueryBuilderUtils";


// todo: fix problem with long aliases eg getMaxIdentifierLength
// todo: fix replacing in .select("COUNT(post.id) AS cnt") statement
// todo: implement joinAlways in relations and relationId
// todo: implement @Where decorator
// todo: add quoting functions
// todo: .addCount and .addCountSelect()
// todo: add selectAndMap

// todo: tests for:
// todo: entityOrProperty can be a table name. implement if its a table
// todo: entityOrProperty can be target name. implement proper behaviour if it is.
// todo: think about subselect in joins syntax

/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
export class QueryBuilder<Entity> {

    // -------------------------------------------------------------------------
    // Protected properties
    // -------------------------------------------------------------------------

    // protected mainAlias: string;
    // protected aliases: string[];

    protected selectionMap: SelectionMap;
    protected type: "select"|"update"|"delete" = "select";
    protected selects: string[] = [];
    protected fromEntity: { alias: Selection };
    protected fromTableName: string;
    protected fromTableAlias: string;
    protected updateQuerySet: Object;
    protected joinAttributes: JoinAttribute[] = [];
    protected joinRelationIds: JoinRelationAttribute[] = [];
    protected relationCountMetas: RelationCountAttribute[] = [];
    protected groupBys: string[] = [];
    protected wheres: { type: "simple"|"and"|"or", condition: string }[] = [];
    protected havings: { type: "simple"|"and"|"or", condition: string }[] = [];
    protected orderBys: OrderByCondition = {};
    protected parameters: ObjectLiteral = {};
    protected limit: number;
    protected offset: number;
    protected lockMode: "optimistic"|"pessimistic_read"|"pessimistic_write";
    protected lockVersion?: number|Date;
    protected skipNumber: number;
    protected takeNumber: number;
    protected enableQuoting: boolean = true;
    protected ignoreParentTablesJoins: boolean = false;

    /**
     * Indicates if virtual columns should be included in entity result.
     */
    protected enableRelationIdValues: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(protected connection: Connection,
                protected queryRunnerProvider?: QueryRunnerProvider) {
        this.selectionMap = new SelectionMap(connection);
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Gets the main alias string used in this query builder.
     */
    get alias(): string {
        return this.selectionMap.mainSelection.alias;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Disable escaping.
     */
    disableQuoting(): this {
        this.enableQuoting = false;
        return this;
    }

    /**
     * Creates DELETE query.
     */
    delete(): this {
        this.type = "delete";
        return this;
    }

    /**
     * Creates UPDATE query and applies given update values.
     */
    update(updateSet: ObjectLiteral): this;

    /**
     * Creates UPDATE query for the given entity and applies given update values.
     */
    update(entity: Function, updateSet: ObjectLiteral): this;

    /**
     * Creates UPDATE query for the given table name and applies given update values.
     */
    update(tableName: string, updateSet: ObjectLiteral): this;

    /**
     * Creates UPDATE query and applies given update values.
     */
    update(tableNameOrEntityOrUpdateSet?: string|Function|ObjectLiteral, maybeUpdateSet?: ObjectLiteral): this {
        const updateSet = maybeUpdateSet ? maybeUpdateSet : <ObjectLiteral> tableNameOrEntityOrUpdateSet;

        if (tableNameOrEntityOrUpdateSet instanceof Function) {
            const aliasName = (<any> tableNameOrEntityOrUpdateSet).name;
            const aliasObj = new Selection(aliasName);
            aliasObj.metadata = this.connection.getMetadata(tableNameOrEntityOrUpdateSet);
            this.selectionMap.addMainSelection(aliasObj);
            this.fromEntity = { alias: aliasObj };

        } else if (typeof tableNameOrEntityOrUpdateSet === "string") {
            this.fromTableName = <string> tableNameOrEntityOrUpdateSet;
        }

        this.type = "update";
        this.updateQuerySet = updateSet;
        return this;
    }

    /**
     * Creates SELECT query.
     * Replaces all old selections if they exist.
     */
    select(): this;

    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection: string): this;

    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection: string[]): this;

    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(...selection: string[]): this;

    /**
     * Creates SELECT query and selects given data.
     * Replaces all old selections if they exist.
     */
    select(selection?: string|string[]): this {
        this.type = "select";
        if (selection) {
            if (selection instanceof Array) {
                this.selects = selection;
            } else {
                this.selects = [selection];
            }
        }
        return this;
    }

    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string): this;

    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string[]): this;

    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(...selection: string[]): this;

    /**
     * Adds new selection to the SELECT query.
     */
    addSelect(selection: string|string[]): this {
        if (selection instanceof Array)
            this.selects = this.selects.concat(selection);
        else
            this.selects.push(selection);

        return this;
    }

    /**
     * Sets locking mode.
     */
    setLock(lockMode: "optimistic", lockVersion: number): this;

    /**
     * Sets locking mode.
     */
    setLock(lockMode: "optimistic", lockVersion: Date): this;

    /**
     * Sets locking mode.
     */
    setLock(lockMode: "pessimistic_read"|"pessimistic_write"): this;

    /**
     * Sets locking mode.
     */
    setLock(lockMode: "optimistic"|"pessimistic_read"|"pessimistic_write", lockVersion?: number|Date): this {
        this.lockMode = lockMode;
        this.lockVersion = lockVersion;
        return this;
    }

    /**
     * Specifies FROM which entity's table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entityTarget: Function|string, alias: string): this {
        const aliasObj = new Selection(alias);
        aliasObj.metadata = this.connection.getMetadata(entityTarget);
        this.selectionMap.addMainSelection(aliasObj);
        this.fromEntity = {alias: aliasObj};
        return this;
    }

    /**
     * Specifies FROM which table select/update/delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    fromTable(tableName: string, alias: string) {
        this.fromTableName = <string> tableName;
        this.fromTableAlias = alias;
        return this;
    }

    /**
     * INNER JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs (without selection) given entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoin(entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.join("INNER", entityOrProperty, alias, condition, options);
        return this;
    }

    /**
     * LEFT JOINs (without selection) entity's property.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs (without selection) entity's table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs (without selection) given table.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs (without selection).
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoin(entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.join("LEFT", entityOrProperty, alias, condition, options);
        return this;
    }

    /**
     * INNER JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndSelect(entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.innerJoin(entityOrProperty, alias, condition, options);
        return this;
    }

    /**
     * LEFT JOINs entity's property and adds all selection properties to SELECT.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs entity and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs table and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs and adds all selection properties to SELECT.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndSelect(entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.leftJoin(entityOrProperty, alias, condition, options);
        return this;
    }

    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapMany(mapToProperty: string, entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.join("INNER", entityOrProperty, alias, condition, options, mapToProperty, true);
        return this;
    }

    /**
     * INNER JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * INNER JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinAndMapOne(mapToProperty: string, entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.join("INNER", entityOrProperty, alias, condition, options, mapToProperty, false);
        return this;
    }

    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there are multiple rows of selecting data, and mapped result will be an array.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapMany(mapToProperty: string, entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.join("LEFT", entityOrProperty, alias, condition, options, mapToProperty, true);
        return this;
    }

    /**
     * LEFT JOINs entity's property, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * Given entity property should be a relation.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, property: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs entity's table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, entity: Function|string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs table, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, tableName: string, alias: string, condition?: string, options?: JoinOptions): this;

    /**
     * LEFT JOINs, SELECTs the data returned by a join and MAPs all that data to some entity's property.
     * This is extremely useful when you want to select some data and map it to some virtual property.
     * It will assume that there is a single row of selecting data, and mapped result will be a single selected value.
     * You also need to specify an alias of the joined data.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinAndMapOne(mapToProperty: string, entityOrProperty: Function|string, alias: string, condition: string = "", options?: JoinOptions): this {
        this.addSelect(alias);
        this.join("LEFT", entityOrProperty, alias, condition, options, mapToProperty, false);
        return this;
    }

    /**
     * LEFT JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    leftJoinRelationIdAndMap(mapToProperty: string, property: string): this;
    leftJoinRelationIdAndMap(mapToProperty: string, property: string, alias: string, condition: string): this;
    leftJoinRelationIdAndMap(mapToProperty: string, property: string, alias?: string, condition?: string): this {
       return this.joinRelationId("LEFT", mapToProperty, property, alias, condition);
    }

    /**
     * INNER JOINs relation id and maps it into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    innerJoinRelationIdAndMap(mapToProperty: string, property: string): this;
    innerJoinRelationIdAndMap(mapToProperty: string, property: string, alias: string, condition: string): this;
    innerJoinRelationIdAndMap(mapToProperty: string, property: string, alias?: string, condition?: string): this {
        return this.joinRelationId("INNER", mapToProperty, property, alias, condition);
    }

    /**
     * Counts number of entities of entity's relation.
     * Optionally, you can add condition and parameters used in condition.
     */
    countRelation(relationName: string, condition?: string): this {
        this.countRelationX(undefined, relationName, condition);
        return this;
    }

    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    countRelationAndMap(mapToProperty: string, relationName: string, condition?: string): this {
        this.countRelationX(mapToProperty, relationName, condition);
        return this;
    }

    /**
     * Counts number of entities of entity's relation and maps the value into some entity's property.
     * Optionally, you can add condition and parameters used in condition.
     */
    protected countRelationX(mapToProperty: string|undefined, relationName: string, condition?: string): void {
        // todo: add support of entity targets and custom table names

        if (!QueryBuilderUtils.isAliasProperty(relationName))
            throw new Error("Only entity relations are allowed in the countRelation operation"); // todo: also check if that relation really has entityId

        const [parentAlias, relationProperty] = relationName.split(".");
        const relationAlias = parentAlias + "_" + relationProperty + "_relation_count";

        const relationOwnerSelection = this.selectionMap.findSelectionByAlias(parentAlias);

        const selection = new Selection(relationAlias);
        this.selectionMap.addSelection(selection);

        const relationCountMeta: RelationCountAttribute = {
            relationOwnerSelection: relationOwnerSelection,
            relationPropertyName: relationProperty,
            condition: condition,
            selection: selection,
            mapToProperty: mapToProperty,
            entities: []
        };
        this.relationCountMetas.push(relationCountMeta);
    }

    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where: string, parameters?: ObjectLiteral): this {
        this.wheres.push({ type: "simple", condition: where });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where: string, parameters?: ObjectLiteral): this {
        this.wheres.push({ type: "and", condition: where });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Adds new AND WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     */
    andWhereInIds(ids: any[]): this {
        const [whereExpression, parameters] = this.createWhereIdsExpression(ids);
        this.andWhere(whereExpression, parameters);
        return this;
    }

    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where: string, parameters?: ObjectLiteral): this {
        this.wheres.push({ type: "or", condition: where });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Adds new OR WHERE with conditions for the given ids.
     *
     * @experimental Maybe this method should be moved to repository?
     */
    orWhereInIds(ids: any[]): this {
        const [whereExpression, parameters] = this.createWhereIdsExpression(ids);
        this.orWhere(whereExpression, parameters);
        return this;
    }

    /**
     * Sets HAVING condition in the query builder.
     * If you had previously HAVING expression defined,
     * calling this function will override previously set HAVING conditions.
     * Additionally you can add parameters used in where expression.
     */
    having(having: string, parameters?: ObjectLiteral): this {
        this.havings.push({ type: "simple", condition: having });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Adds new AND HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andHaving(having: string, parameters?: ObjectLiteral): this {
        this.havings.push({ type: "and", condition: having });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Adds new OR HAVING condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orHaving(having: string, parameters?: ObjectLiteral): this {
        this.havings.push({ type: "or", condition: having });
        if (parameters) this.setParameters(parameters);
        return this;
    }

    /**
     * Sets GROUP BY condition in the query builder.
     * If you had previously GROUP BY expression defined,
     * calling this function will override previously set GROUP BY conditions.
     */
    groupBy(groupBy: string): this {
        this.groupBys = [groupBy];
        return this;
    }

    /**
     * Adds GROUP BY condition in the query builder.
     */
    addGroupBy(groupBy: string): this {
        this.groupBys.push(groupBy);
        return this;
    }

    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort: string, order: "ASC"|"DESC" = "ASC"): this {
        this.orderBys = { [sort]: order };
        return this;
    }

    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort: string, order: "ASC"|"DESC" = "ASC"): this {
        this.orderBys[sort] = order;
        return this;
    }

    /**
     * Set's LIMIT - maximum number of rows to be selected.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setMaxResults instead.
     */
    setLimit(limit: number): this {
        this.limit = limit;
        return this;
    }

    /**
     * Set's OFFSET - selection offset.
     * NOTE that it may not work as you expect if you are using joins.
     * If you want to implement pagination, and you are having join in your query,
     * then use instead setFirstResult instead.
     */
    setOffset(offset: number): this {
        this.offset = offset;
        return this;
    }

    /**
     * Sets maximal number of entities to take.
     */
    take(take: number): this {
        this.takeNumber = take;
        return this;
    }

    /**
     * Sets number of entities to skip
     */
    skip(skip: number): this {
        this.skipNumber = skip;
        return this;
    }

    /**
     * Sets given parameter's value.
     */
    setParameter(key: string, value: any): this {
        this.parameters[key] = value;
        return this;
    }

    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     */
    setParameters(parameters: ObjectLiteral): this {
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = parameters[key];
        });
        return this;
    }

    /**
     * Adds all parameters from the given object.
     * Unlike setParameters method it does not clear all previously set parameters.
     *
     * @deprecated use setParameters instead
     */
    addParameters(parameters: ObjectLiteral): this {
        Object.keys(parameters).forEach(key => {
            this.parameters[key] = parameters[key];
        });
        return this;
    }

    /**
     * Gets all parameters.
     */
    getParameters(): ObjectLiteral {
        const parameters: ObjectLiteral = Object.assign({}, this.parameters);

        // add discriminator column parameter if it exist
        if (!this.fromTableName) {
            const mainMetadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);
            if (mainMetadata.hasDiscriminatorColumn)
                parameters["discriminatorColumnValue"] = mainMetadata.discriminatorValue;
        }

        return parameters;
    }

    /**
     * Gets generated sql that will be executed.
     * Parameters in the query are escaped for the currently used driver.
     */
    getSql(): string {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        [sql] = this.connection.driver.escapeQueryWithParameters(sql, this.parameters);
        return sql.trim();
    }

    /**
     * Gets generated sql without parameters being replaced.
     *
     * @experimental
     */
    getGeneratedQuery(): string {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        return sql.trim();
    }

    /**
     * Gets sql to be executed with all parameters used in it.
     *
     * @experimental
     */
    getSqlWithParameters(options?: { skipOrderBy?: boolean }): [string, any[]] {
        let sql = this.createSelectExpression();
        sql += this.createJoinExpression();
        sql += this.createJoinRelationIdsExpression();
        sql += this.createWhereExpression();
        sql += this.createGroupByExpression();
        sql += this.createHavingExpression();
        if (!options || !options.skipOrderBy)
            sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        sql += this.createOffsetExpression();
        sql += this.createLockExpression();
        return this.connection.driver.escapeQueryWithParameters(sql, this.getParameters());
    }

    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    async execute(): Promise<any> {
        const queryRunner = await this.getQueryRunner();

        const [sql, parameters] = this.getSqlWithParameters();
        try {
            return await queryRunner.query(sql, parameters);  // await is needed here because we are using finally

        } finally {
            if (this.hasOwnQueryRunner()) // means we created our own query runner
                await queryRunner.release();
        }
    }

    /**
     * Executes sql generated by query builder and returns object with raw results and entities created from them.
     */
    async getEntitiesAndRawResults(): Promise<{ entities: Entity[], rawResults: any[] }> {
        const queryRunner = await this.getQueryRunner();

        try {
            if (!this.selectionMap.hasMainSelection)
                throw new Error(`Alias is not set. Looks like nothing is selected. Use select*, delete, update method to set an alias.`);

            if ((this.lockMode === "pessimistic_read" || this.lockMode === "pessimistic_write") && !queryRunner.isTransactionActive())
                throw new PessimisticLockTransactionRequiredError();

            if (this.lockMode === "optimistic") {
                const metadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);
                if (!metadata.hasVersionColumn && !metadata.hasUpdateDateColumn)
                    throw new NoVersionOrUpdateDateColumnError(metadata.name);
            }

            const mainAliasName = this.fromTableName ? this.fromTableName : this.selectionMap.mainSelection.alias;
            let rawResults: any[];
            if (this.skipNumber || this.takeNumber) {
                // we are skipping order by here because its not working in subqueries anyway
                // to make order by working we need to apply it on a distinct query
                const [sql, parameters] = this.getSqlWithParameters({ skipOrderBy: true });
                const [selects, orderBys] = this.createOrderByCombinedWithSelectExpression("distinctAlias");

                const distinctAlias = this.escapeTable("distinctAlias");
                const metadata = this.connection.getMetadata(this.fromEntity.alias.target);
                let idsQuery = `SELECT `;
                idsQuery += metadata.primaryColumns.map((primaryColumn, index) => {
                    const propertyName = this.escapeAlias(mainAliasName + "_" + primaryColumn.fullName);
                    if (index === 0) {
                        return `DISTINCT(${distinctAlias}.${propertyName}) as ids_${primaryColumn.fullName}`;
                    } else {
                        return `${distinctAlias}.${propertyName}) as ids_${primaryColumn.fullName}`;
                    }
                }).join(", ");
                if (selects.length > 0)
                    idsQuery += ", " + selects;

                idsQuery += ` FROM (${sql}) ${distinctAlias}`; // TODO: WHAT TO DO WITH PARAMETERS HERE? DO THEY WORK?

                if (orderBys.length > 0) {
                    idsQuery += " ORDER BY " + orderBys;
                } else {
                    idsQuery += ` ORDER BY "ids_${metadata.firstPrimaryColumn.fullName}"`; // this is required for mssql driver if firstResult is used. Other drivers don't care about it
                }

                if (this.connection.driver instanceof SqlServerDriver) { // todo: temporary. need to refactor and make a proper abstraction

                    if (this.skipNumber || this.takeNumber) {
                        idsQuery += ` OFFSET ${this.skipNumber || 0} ROWS`;
                        if (this.takeNumber)
                            idsQuery += " FETCH NEXT " + this.takeNumber + " ROWS ONLY";
                    }
                } else {

                    if (this.takeNumber)
                        idsQuery += " LIMIT " + this.takeNumber;
                    if (this.skipNumber)
                        idsQuery += " OFFSET " + this.skipNumber;
                }

                return await queryRunner.query(idsQuery, parameters)
                    .then((results: any[]) => {
                        rawResults = results;
                        if (results.length === 0)
                            return [];

                        let condition = "";
                        const parameters: ObjectLiteral = {};
                        if (metadata.hasMultiplePrimaryKeys) {
                            condition = results.map(result => {
                                return metadata.primaryColumns.map(primaryColumn => {
                                    parameters["ids_" + primaryColumn.propertyName] = result["ids_" + primaryColumn.propertyName];
                                    return mainAliasName + "." + primaryColumn.propertyName + "=:ids_" + primaryColumn.propertyName;
                                }).join(" AND ");
                            }).join(" OR ");
                        } else {
                            const ids = results.map(result => result["ids_" + metadata.firstPrimaryColumn.propertyName]);
                            const areAllNumbers = ids.map((id: any) => typeof id === "number");
                            if (areAllNumbers) {
                                // fixes #190. if all numbers then its safe to perform query without parameter
                                condition = `${mainAliasName}.${metadata.firstPrimaryColumn.propertyName} IN (${ids.join(", ")})`;
                            } else {
                                parameters["ids"] = ids;
                                condition = mainAliasName + "." + metadata.firstPrimaryColumn.propertyName + " IN (:ids)";
                            }
                        }
                        const [queryWithIdsSql, queryWithIdsParameters] = this.clone({queryRunnerProvider: this.queryRunnerProvider})
                            .andWhere(condition, parameters)
                            .getSqlWithParameters();
                        return (queryRunner as QueryRunner).query(queryWithIdsSql, queryWithIdsParameters);
                    })
                    .then(results => {
                        return this.rawResultsToEntities(results);
                    })
                    .then(results => {

                        return this.loadRelationCounts(queryRunner as QueryRunner, results)
                            .then(counts => {
                                return results;
                            });
                    })
                    .then(results => {
                        if (!this.fromTableName)
                            return this.connection.broadcaster.broadcastLoadEventsForAll(this.selectionMap.mainSelection.target, results).then(() => results);

                        return results;
                    })
                    .then(results => {
                        return {
                            entities: results,
                            rawResults: rawResults
                        };
                    });

            } else {

                const [sql, parameters] = this.getSqlWithParameters();

                return await queryRunner.query(sql, parameters)
                    .then(results => {
                        rawResults = results;
                        return this.rawResultsToEntities(results);
                    })
                    .then(results => {

                        return this.loadRelationCounts(queryRunner as QueryRunner, results)
                            .then(counts => {
                                return results;
                            });
                    })
                    .then(results => {
                        if (!this.fromTableName) {
                            return this.connection.broadcaster
                                .broadcastLoadEventsForAll(this.selectionMap.mainSelection.target, results)
                                .then(() => results);
                        }
                        return results;
                    })
                    .then(results => {
                        return {
                            entities: results,
                            rawResults: rawResults
                        };
                    });
            }

        } finally {
            if (this.hasOwnQueryRunner()) // means we created our own query runner
                await queryRunner.release();
        }
    }

    /**
     * Gets count - number of entities selected by sql generated by this query builder.
     * Count excludes all limitations set by setFirstResult and setMaxResults methods call.
     */
    async getCount(): Promise<number> {
        if (this.lockMode === "optimistic")
            throw new OptimisticLockCanNotBeUsedError();

        const queryRunner = await this.getQueryRunner();

        const mainAlias = this.fromTableName ? this.fromTableName : this.selectionMap.mainSelection.alias; // todo: will this work with "fromTableName"?
        const metadata = this.connection.getMetadata(this.fromEntity.alias.target);

        const distinctAlias = this.escapeAlias(mainAlias);
        let countSql = `COUNT(` + metadata.primaryColumnsWithParentIdColumns.map((primaryColumn, index) => {
                const propertyName = this.escapeColumn(primaryColumn.fullName);
                if (index === 0) {
                    return `DISTINCT(${distinctAlias}.${propertyName})`;
                } else {
                    return `${distinctAlias}.${propertyName})`;
                }
            }).join(", ") + ") as cnt";

        const countQuery = this
            .clone({
                queryRunnerProvider: this.queryRunnerProvider,
                skipOrderBys: true,
                ignoreParentTablesJoins: true,
                skipLimit: true,
                skipOffset: true
            })
            .select(countSql);

        const [countQuerySql, countQueryParameters] = countQuery.getSqlWithParameters();

        try {
            const results = await queryRunner.query(countQuerySql, countQueryParameters);
            if (!results || !results[0] || !results[0]["cnt"])
                return 0;

            return parseInt(results[0]["cnt"]);

        } finally {
            if (this.hasOwnQueryRunner()) // means we created our own query runner
                await queryRunner.release();
        }
    }

    /**
     * Gets all raw results returned by execution of generated query builder sql.
     */
    async getRawMany(): Promise<any[]> {
        if (this.lockMode === "optimistic")
            throw new OptimisticLockCanNotBeUsedError();

        return this.execute();
    }

    /**
     * Gets first raw result returned by execution of generated query builder sql.
     */
    async getRawOne(): Promise<any> {
        if (this.lockMode === "optimistic")
            throw new OptimisticLockCanNotBeUsedError();

        const results = await this.execute();
        return results[0];

    }

    /**
     * Gets entities and count returned by execution of generated query builder sql.
     */
    async getManyAndCount(): Promise<[Entity[], number]> {
        if (this.lockMode === "optimistic")
            throw new OptimisticLockCanNotBeUsedError();

        // todo: share database connection and counter
        return Promise.all([
            this.getMany(),
            this.getCount()
        ]);
    }

    /**
     * Gets entities returned by execution of generated query builder sql.
     */
    async getMany(): Promise<Entity[]> {
        if (this.lockMode === "optimistic")
            throw new OptimisticLockCanNotBeUsedError();

        const results = await this.getEntitiesAndRawResults();
        return results.entities;
    }

    /**
     * Gets single entity returned by execution of generated query builder sql.
     */
    async getOne(): Promise<Entity|undefined> {
        const results = await this.getEntitiesAndRawResults();
        const result = results.entities[0] as any;

        if (result && this.lockMode === "optimistic" && this.lockVersion) {
            const metadata = this.connection.getMetadata(this.fromEntity.alias.target);

            if (this.lockVersion instanceof Date) {
                const actualVersion = result[metadata.updateDateColumn.propertyName];
                this.lockVersion.setMilliseconds(0);
                if (actualVersion.getTime() !== this.lockVersion.getTime())
                    throw new OptimisticLockVersionMismatchError(metadata.name, this.lockVersion, actualVersion);

            } else {
                const actualVersion = result[metadata.versionColumn.propertyName];
                if (actualVersion !== this.lockVersion)
                    throw new OptimisticLockVersionMismatchError(metadata.name, this.lockVersion, actualVersion);
            }
        }

        return result;
    }

    /**
     * Clones query builder as it is.
     */
    clone(options?: { queryRunnerProvider?: QueryRunnerProvider, skipOrderBys?: boolean, skipLimit?: boolean, skipOffset?: boolean, ignoreParentTablesJoins?: boolean }): QueryBuilder<Entity> {
        const qb = new QueryBuilder(this.connection, options ? options.queryRunnerProvider : undefined);
        if (options && options.ignoreParentTablesJoins)
            qb.ignoreParentTablesJoins = options.ignoreParentTablesJoins;

        switch (this.type) {
            case "select":
                qb.select(this.selects);
                break;
            case "update":
                qb.update(this.updateQuerySet);
                break;
            case "delete":
                qb.delete();
                break;
        }

        if (this.fromEntity && this.fromEntity.alias && this.fromEntity.alias.target) {
            qb.from(this.fromEntity.alias.target, this.fromEntity.alias.alias);

        } else if (this.fromTableName) {
            qb.fromTable(this.fromTableName, this.fromTableAlias);
        }

        this.joinAttributes.forEach(join => {
            qb.join(join.type, join.entityOrProperty, join.alias, join.condition, undefined, join.mapToProperty, join.isMappingMany);
        });

        this.groupBys.forEach(groupBy => qb.addGroupBy(groupBy));

        this.wheres.forEach(where => {
            switch (where.type) {
                case "simple":
                    qb.where(where.condition);
                    break;
                case "and":
                    qb.andWhere(where.condition);
                    break;
                case "or":
                    qb.orWhere(where.condition);
                    break;
            }
        });

        this.havings.forEach(having => {
            switch (having.type) {
                case "simple":
                    qb.having(having.condition);
                    break;
                case "and":
                    qb.andHaving(having.condition);
                    break;
                case "or":
                    qb.orHaving(having.condition);
                    break;
            }
        });

        if (!options || !options.skipOrderBys)
            Object.keys(this.orderBys).forEach(columnName => qb.addOrderBy(columnName, this.orderBys[columnName]));

        Object.keys(this.parameters).forEach(key => qb.setParameter(key, this.parameters[key]));

        if (!options || !options.skipLimit)
            qb.setLimit(this.limit);

        if (!options || !options.skipOffset)
            qb.setOffset(this.offset);

        qb.skip(this.skipNumber)
            .take(this.takeNumber);

        return qb;
    }

    escapeAlias(name: string) {
        if (!this.enableQuoting)
            return name;
        return this.connection.driver.escapeAliasName(name);
    }

    escapeColumn(name: string) {
        if (!this.enableQuoting)
            return name;
        return this.connection.driver.escapeColumnName(name);
    }

    escapeTable(name: string) {
        if (!this.enableQuoting)
            return name;
        return this.connection.driver.escapeTableName(name);
    }

    /**
     * Enables special query builder options.
     */
    enableOption(option: "RELATION_ID_VALUES"): this {
        switch (option) {
            case "RELATION_ID_VALUES":
                this.enableRelationIdValues = true;
        }

        return this;
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    protected loadRelationCounts(queryRunner: QueryRunner, results: Entity[]): Promise<{}> {

        const promises = this.relationCountMetas.map(relationCountMeta => {
            const foundAlias = relationCountMeta.relationOwnerSelection;
            const parentMetadata = foundAlias.metadata;
            const relation = parentMetadata.findRelationWithPropertyName(relationCountMeta.relationPropertyName);

            const queryBuilder = new QueryBuilder(this.connection, this.queryRunnerProvider);
            let condition = "";

            const metadata = foundAlias.metadata;
            let joinTableName: string = metadata.table.name;

            const junctionMetadata = relation.junctionEntityMetadata;
            const appendedCondition = relationCountMeta.condition ? " AND " + this.replacePropertyNames(relationCountMeta.condition) : "";

            /*if (relation.isManyToMany) {
             const junctionTable = junctionMetadata.table.name;
             const junctionAlias = relationCountMeta.alias.parentAliasName + "_" + relationCountMeta.alias.name;
             const joinAlias = relationCountMeta.alias.name;
             const joinTable = relation.isOwning ? relation.joinTable : relation.inverseRelation.joinTable; // not sure if this is correct
             const joinTableColumn = joinTable.referencedColumn.name; // not sure if this is correct
             const inverseJoinColumnName = joinTable.inverseReferencedColumn.name; // not sure if this is correct

             let condition1 = "", condition2 = "";
             if (relation.isOwning) {
             condition1 = junctionAlias + "." + junctionMetadata.columns[0].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[1].name;
             } else {
             condition1 = junctionAlias + "." + junctionMetadata.columns[1].name + "=" + parentAlias + "." + joinTableColumn;
             condition2 = joinAlias + "." + inverseJoinColumnName + "=" + junctionAlias + "." + junctionMetadata.columns[0].name;
             }

             condition = " LEFT JOIN " + junctionTable + " " + junctionAlias + " " + relationCountMeta.conditionType + " " + condition1 +
             " LEFT JOIN " + joinTableName + " " + joinAlias + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
             const joinTableColumn = relation.joinColumn.referencedColumn.name;
             const condition2 = relationCountMeta.alias.name + "." + joinTableColumn + "=" + parentAlias + "." + relation.name;
             condition = " LEFT JOIN " + joinTableName + " " + relationCountMeta.alias.name + " " + relationCountMeta.conditionType + " " + condition2 + appendedCondition;

             } else {
             throw new Error(`Relation count can be applied only `); // this should be done on entity build
             }*/

            // if (relationCountMeta.condition)
            //     condition += relationCountMeta.condition;
            // relationCountMeta.alias.target;
            // todo: FIX primaryColumn usages

            const ids = relationCountMeta.entities
                .map(entityWithMetadata => entityWithMetadata.metadata.getEntityIdMap(entityWithMetadata.entity))
                .filter(idMap => idMap !== undefined)
                .map(idMap => idMap![parentMetadata.primaryColumn.propertyName]);
            if (!ids || !ids.length)
                return Promise.resolve(); // todo: need to set zero to relationCount column in this case?

            return queryBuilder
                .select(`${parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName} AS id`)
                .addSelect(`COUNT(${ this.escapeAlias(relation.propertyName) + "." + this.escapeColumn(relation.inverseEntityMetadata.primaryColumn.fullName) }) as cnt`)
                .from(parentMetadata.target, parentMetadata.name)
                .leftJoin(parentMetadata.name + "." + relation.propertyName, relation.propertyName, relationCountMeta.condition)
                .setParameters(this.parameters)
                .where(`${parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName} IN (:relationCountIds)`, {relationCountIds: ids})
                .groupBy(parentMetadata.name + "." + parentMetadata.primaryColumn.propertyName)
                .getRawMany()
                .then((results: { id: any, cnt: any }[]) => {
                    relationCountMeta.entities.forEach(entityWithMetadata => {
                        const entityId = entityWithMetadata.entity[entityWithMetadata.metadata.primaryColumn.propertyName];
                        const entityResult = results.find(result => {
                            return entityId === this.connection.driver.prepareHydratedValue(result.id, entityWithMetadata.metadata.primaryColumn);
                        });
                        if (entityResult) {

                            if (relationCountMeta.mapToProperty) {
                                const [parentName, propertyName] = (relationCountMeta.mapToProperty as string).split(".");
                                // todo: right now mapping is working only on the currently countRelation class, but
                                // different properties are working. make different classes to work too
                                entityWithMetadata.entity[propertyName] = parseInt(entityResult.cnt);

                            } else if (relation.countField) {
                                entityWithMetadata.entity[relation.countField] = parseInt(entityResult.cnt);
                            }
                        }
                    });
                });
        });

        return Promise.all(promises);
    }

    protected rawResultsToEntities(results: any[]) {
        const transformer = new RawSqlResultsToEntityTransformer(
            this.connection.driver,
            this.selectionMap,
            this.joinAttributes,
            this.joinRelationIds,
            this.relationCountMetas,
            this.enableRelationIdValues
        );
        return transformer.transform(results);
    }

    protected buildEscapedEntityColumnSelects(alias: string, metadata: EntityMetadata): string[] {
        const hasMainAlias = this.selects.some(select => select === alias);

        const columns: ColumnMetadata[] = hasMainAlias ? metadata.columns : metadata.columns.filter(column => {
            return this.selects.some(select => select === alias + "." + column.propertyName);
        });

        return columns.map(column => {
            return this.escapeAlias(alias) + "." + this.escapeColumn(column.fullName) +
                " AS " + this.escapeAlias(alias + "_" + column.fullName);
        });
    };

    protected findEntityColumnSelects(alias: string, metadata: EntityMetadata): string[] {
        const mainSelect = this.selects.find(select => select === alias);
        if (mainSelect)
            return [mainSelect];

        return this.selects.filter(select => {
            return metadata.columns.some(column => select === alias + "." + column.propertyName);
        });
    };

    protected createSelectExpression() {
        // todo throw exception if selects or from is missing

        let alias: string = "", tableName: string;
        const allSelects: string[] = [];
        const excludedSelects: string[] = [];

        if (this.fromTableName) {
            tableName = this.fromTableName;
            alias = this.fromTableAlias;

        } else if (this.fromEntity) {
            tableName = this.fromEntity.alias.metadata.table.name;
            alias = this.fromEntity.alias.alias;

            allSelects.push(...this.buildEscapedEntityColumnSelects(alias, this.fromEntity.alias.metadata));
            excludedSelects.push(...this.findEntityColumnSelects(alias, this.fromEntity.alias.metadata));
        } else {
            throw new Error("No from given");
        }

        // add selects from joins
        this.joinAttributes.forEach(join => {
            if (join.metadata) {
                allSelects.push(...this.buildEscapedEntityColumnSelects(join.alias, join.metadata));
                excludedSelects.push(...this.findEntityColumnSelects(join.alias, join.metadata));
            } else {
                const hasMainAlias = this.selects.some(select => select === join.alias);
                if (hasMainAlias) {
                    allSelects.push(this.escapeAlias(join.alias) + ".*");
                    excludedSelects.push(join.alias);
                }
            }
        });

        if (!this.ignoreParentTablesJoins && !this.fromTableName) {
            if (this.selectionMap.mainSelection.metadata.parentEntityMetadata && this.selectionMap.mainSelection.metadata.parentIdColumns) {
                const alias = "parentIdColumn_" + this.escapeAlias(this.selectionMap.mainSelection.metadata.parentEntityMetadata.table.name);
                this.selectionMap.mainSelection.metadata.parentEntityMetadata.columns.forEach(column => {
                    // TODO implement partial select
                    allSelects.push(alias + "." + this.escapeColumn(column.fullName) + " AS " + alias + "_" + this.escapeAlias(column.fullName));
                });
            }
        }

        // add selects from relation id joins
        this.joinRelationIds.forEach(joinRelationId => {
            const junctionMetadata = joinRelationId.relation.junctionEntityMetadata;
            junctionMetadata.columnsWithoutEmbeddeds.forEach(column => {
                allSelects.push(this.escapeAlias(joinRelationId.junctionSelection.alias) + "." + this.escapeColumn(column.fullName) + " AS " + this.escapeAlias(joinRelationId.junctionSelection.alias + "_" + column.fullName));
            });
        });

        /*if (this.enableRelationIdValues) {
            const parentMetadata = this.aliasMap.getEntityMetadataByAlias(this.aliasMap.mainAlias);
            if (!parentMetadata)
                throw new Error("Cannot get entity metadata for the given alias " + this.aliasMap.mainAlias.name);

            const metadata = this.connection.entityMetadatas.findByTarget(this.aliasMap.mainAlias.target);
            metadata.manyToManyRelations.forEach(relation => {

                const junctionMetadata = relation.junctionEntityMetadata;
                junctionMetadata.columns.forEach(column => {
                    const select = this.escapeAlias(this.aliasMap.mainAlias.name + "_" + junctionMetadata.table.name + "_ids") + "." +
                        this.escapeColumn(column.name) + " AS " +
                        this.escapeAlias(this.aliasMap.mainAlias.name + "_" + relation.name + "_ids_" + column.name);
                    allSelects.push(select);
                });
            });
        }*/

        // add all other selects
        this.selects.filter(select => excludedSelects.indexOf(select) === -1)
            .forEach(select => allSelects.push(this.replacePropertyNames(select)));

        // if still selection is empty, then simply set it to all (*)
        if (allSelects.length === 0)
            allSelects.push("*");

        let lock: string = "";
        if (this.connection.driver instanceof SqlServerDriver) {
            switch (this.lockMode) {
                case "pessimistic_read":
                    lock = " WITH (HOLDLOCK, ROWLOCK)";
                    break;
                case "pessimistic_write":
                    lock = " WITH (UPDLOCK, ROWLOCK)";
                    break;
            }
        }

        // create a selection query
        switch (this.type) {
            case "select":
                return "SELECT " + allSelects.join(", ") + " FROM " + this.escapeTable(tableName) + " " + this.escapeAlias(alias) + lock;
            case "delete":
                return "DELETE FROM " + this.escapeTable(tableName);
                // return "DELETE " + (alias ? this.escapeAlias(alias) : "") + " FROM " + this.escapeTable(tableName) + " " + (alias ? this.escapeAlias(alias) : ""); // TODO: only mysql supports aliasing, so what to do with aliases in DELETE queries? right now aliases are used however we are relaying that they will always match a table names
            case "update":
                const updateSet = Object.keys(this.updateQuerySet).map(key => key + "=:updateQuerySet_" + key);
                const params = Object.keys(this.updateQuerySet).reduce((object, key) => {
                    // todo: map propertyNames to names ?
                    (<any> object)["updateQuerySet_" + key] = (<any> this.updateQuerySet)[key];
                    return object;
                }, {});
                this.setParameters(params);
                return "UPDATE " + tableName + " " + (alias ? this.escapeAlias(alias) : "") + " SET " + updateSet;
        }

        throw new Error("No query builder type is specified.");
    }

    protected createHavingExpression() {
        if (!this.havings || !this.havings.length) return "";
        const conditions = this.havings.map((having, index) => {
                switch (having.type) {
                    case "and":
                        return (index > 0 ? "AND " : "") + this.replacePropertyNames(having.condition);
                    case "or":
                        return (index > 0 ? "OR " : "") + this.replacePropertyNames(having.condition);
                    default:
                        return this.replacePropertyNames(having.condition);
                }
            }).join(" ");

        if (!conditions.length) return "";
        return " HAVING " + conditions;
    }

    protected createWhereExpression() {

        const conditions = this.wheres.map((where, index) => {
            switch (where.type) {
                case "and":
                    return (index > 0 ? "AND " : "") + this.replacePropertyNames(where.condition);
                case "or":
                    return (index > 0 ? "OR " : "") + this.replacePropertyNames(where.condition);
                default:
                    return this.replacePropertyNames(where.condition);
            }
        }).join(" ");

        if (!this.fromTableName) {
            const mainMetadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);
            if (mainMetadata.hasDiscriminatorColumn)
                return ` WHERE ${ conditions.length ? "(" + conditions + ") AND" : "" } ${mainMetadata.discriminatorColumn.fullName}=:discriminatorColumnValue`;
        }

        if (!conditions.length) return "";
        return " WHERE " + conditions;
    }

    /**
     * Replaces all entity's propertyName to name in the given statement.
     */
    private replacePropertyNames(statement: string) {
        this.selectionMap.selections.forEach(selection => {
            if (!selection.hasMetadata) return;
            selection.metadata.embeddeds.forEach(embedded => {
                embedded.columns.forEach(column => {
                    const expression = selection.alias + "\\." + embedded.propertyName + "\\." + column.propertyName + "([ =]|.{0}$)";
                    statement = statement.replace(new RegExp(expression, "gm"), this.escapeAlias(selection.alias) + "." + this.escapeColumn(column.fullName) + "$1");
                });
                // todo: what about embedded relations here?
            });
            selection.metadata.columns.filter(column => !column.isInEmbedded).forEach(column => {
                const expression = selection.alias + "\\." + column.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), this.escapeAlias(selection.alias) + "." + this.escapeColumn(column.fullName) + "$1");
            });
            selection.metadata.relationsWithJoinColumns/*.filter(relation => !relation.isInEmbedded)*/.forEach(relation => {
                const expression = selection.alias + "\\." + relation.propertyName + "([ =]|.{0}$)";
                statement = statement.replace(new RegExp(expression, "gm"), this.escapeAlias(selection.alias) + "." + this.escapeColumn(relation.name) + "$1");
            });
        });
        return statement;
    }

    protected createJoinRelationIdsExpression(): string {
        const et = (alias: string) => this.escapeTable(alias);
        const ea = (alias: string) => this.escapeAlias(alias);
        const ec = (alias: string) => this.escapeColumn(alias);

        return this.joinRelationIds.map(joinRelationId => {
            const ownerRelation = joinRelationId.relation;
            const junctionTable = ownerRelation.junctionEntityMetadata.table;
            const [firstJunctionColumn, secondJunctionColumn] = ownerRelation.junctionEntityMetadata.columnsWithoutEmbeddeds; // since its a junction table we only can have a limited number of columns
            const parentAlias = joinRelationId.relationOwnerSelection.alias;
            const junctionAlias = joinRelationId.junctionSelection.alias;
            const joinTable = ownerRelation.isOwning ? ownerRelation.joinTable : ownerRelation.inverseRelation.joinTable;
            const joinTableColumn = ownerRelation.isOwning ? joinTable.referencedColumn.fullName : joinTable.inverseReferencedColumn.fullName;
            // const appendedCondition = joinRelationId.joinInverseSideCondition ? " AND " + this.replacePropertyNames(joinRelationId.joinInverseSideCondition) : "";

            let condition = "";
            if (ownerRelation.isOwning) {
                // example: post_categories.postId = post.id
                condition = ea(junctionAlias) + "." + ec(firstJunctionColumn.fullName) + "=" + ea(parentAlias) + "." + ec(joinTableColumn);

            } else {
                // example: post_categories.categoryId = category.categoryId
                condition = ea(junctionAlias) + "." + ec(secondJunctionColumn.fullName) + "=" + ea(parentAlias) + "." + ec(joinTableColumn);
            }

            return " " + joinRelationId.type + " JOIN " + et(junctionTable.name) + " " + ea(junctionAlias) + " ON " + condition/* + appendedCondition*/;
        }).join(" ");
    }

    protected createJoinExpression(): string {
        const et = (alias: string) => this.escapeTable(alias);
        const ea = (alias: string) => this.escapeAlias(alias);
        const ec = (alias: string) => this.escapeColumn(alias);

        // examples:
        // select from owning side
        // qb.select("post")
        //     .leftJoinAndSelect("post.category", "category");
        // select from non-owning side
        // qb.select("category")
        //     .leftJoinAndSelect("category.post", "post");

        const joins = this.joinAttributes.map(joinAttr => {

            const relation = joinAttr.relation;
            const destinationTableName = joinAttr.tableName;
            const destinationTableAlias = joinAttr.alias;
            const appendedCondition = joinAttr.condition ? " AND (" + this.replacePropertyNames(joinAttr.condition) + ")" : "";
            const parentAlias = joinAttr.parentAlias;

            // if join was build without relation (e.g. without "post.category") then it means that we have direct
            // table to join, without junction table involved. This means we simply join direct table.
            if (!parentAlias || !relation)
                return  " " + joinAttr.type + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) +
                    (joinAttr.condition ? " ON " + this.replacePropertyNames(joinAttr.condition) : "");

            // if real entity relation is involved
            if (relation.isManyToOne || (relation.isOneToOne && relation.isOwning)) {
                const destinationTableReferencedColumn = relation.joinColumn.referencedColumn;

                // JOIN `category` `category` ON `category`.`id` = `post`.`categoryId`
                const condition = ea(destinationTableAlias) + "." + ec(destinationTableReferencedColumn.fullName) + "=" + ea(parentAlias) + "." + ec(relation.name);
                return " " + joinAttr.type + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + condition + appendedCondition;

            } else if (relation.isOneToMany || (relation.isOneToOne && !relation.isOwning)) {
                const relationOwnerReferencedColumn = relation.inverseRelation.joinColumn.referencedColumn;

                // JOIN `post` `post` ON `post`.`categoryId` = `category`.`id`
                const condition = ea(destinationTableAlias) + "." + ec(relation.inverseRelation.name) + "=" + ea(parentAlias) + "." + ec(relationOwnerReferencedColumn.fullName);
                return " " + joinAttr.type + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + condition + appendedCondition;

            } else { // means many-to-many

                const junctionTableName = relation.junctionEntityMetadata.table.name;
                const [firstJunctionColumn, secondJunctionColumn] = relation.junctionEntityMetadata.columnsWithoutEmbeddeds;
                const junctionAlias = relation.isOwning ? parentAlias + "_" + destinationTableAlias : destinationTableAlias + "_" + parentAlias;

                let junctionCondition = "", destinationCondition = "";
                if (relation.isOwning) {
                    const joinTableColumn = relation.joinTable.referencedColumn.fullName;
                    const inverseJoinColumnName = relation.joinTable.inverseReferencedColumn.fullName;

                    // `post_category`.`postId` = `post`.`id`
                    junctionCondition = ea(junctionAlias) + "." + ec(firstJunctionColumn.fullName) + "=" + ea(parentAlias) + "." + ec(joinTableColumn);

                    // `category`.`id` = `post_category`.`categoryId`
                    destinationCondition = ea(destinationTableAlias) + "." + ec(inverseJoinColumnName) + "=" + ea(junctionAlias) + "." + ec(secondJunctionColumn.fullName);

                } else {
                    const joinTableColumn = relation.inverseRelation.joinTable.inverseReferencedColumn.fullName;
                    const inverseJoinColumnName = relation.inverseRelation.joinTable.referencedColumn.fullName;

                    // `post_category`.`categoryId` = `category`.`id`
                    junctionCondition = ea(junctionAlias) + "." + ec(secondJunctionColumn.fullName) + "=" + ea(parentAlias) + "." + ec(joinTableColumn);

                    // `post`.`id` = `post_category`.`postId`
                    destinationCondition = ea(destinationTableAlias) + "." + ec(inverseJoinColumnName) + "=" + ea(junctionAlias) + "." + ec(firstJunctionColumn.fullName);
                }

                return  " " + joinAttr.type + " JOIN " + et(junctionTableName) + " " + ea(junctionAlias) + " ON " + junctionCondition +
                        " " + joinAttr.type + " JOIN " + et(destinationTableName) + " " + ea(destinationTableAlias) + " ON " + destinationCondition + appendedCondition;
            }
        });

        if (!this.ignoreParentTablesJoins && !this.fromTableName) {
            const metadata = this.selectionMap.mainSelection.metadata;
            if (metadata.parentEntityMetadata && metadata.parentIdColumns) {
                const alias = "parentIdColumn_" + metadata.parentEntityMetadata.table.name;
                const parentJoin = " JOIN " + et(metadata.parentEntityMetadata.table.name) + " " + ea(alias) + " ON " +
                    metadata.parentIdColumns.map(parentIdColumn => {
                        return this.selectionMap.mainSelection.alias + "." + parentIdColumn.fullName + "=" + ea(alias) + "." + parentIdColumn.propertyName;
                    });
                joins.push(parentJoin);
            }
        }

        return joins.join(" ");
    }

    protected createGroupByExpression() {
        if (!this.groupBys || !this.groupBys.length) return "";
        return " GROUP BY " + this.replacePropertyNames(this.groupBys.join(", "));
    }

    protected createOrderByCombinedWithSelectExpression(parentAlias: string) {

        // if table has a default order then apply it
        let orderBys = this.orderBys;
        if (!Object.keys(orderBys).length && !this.fromTableName) {
            const metadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);
            orderBys = metadata.table.orderBy || {};
        }

        const selectString = Object.keys(orderBys)
            .map(columnName => {
                const [alias, column, ...embeddedProperties] = columnName.split(".");
                return this.escapeAlias(parentAlias) + "." + this.escapeColumn(alias + "_" + column + embeddedProperties.join("_"));
            })
            .join(", ");

        const orderByString = Object.keys(orderBys)
            .map(columnName => {
                const [alias, column, ...embeddedProperties] = columnName.split(".");
                return this.escapeAlias(parentAlias) + "." + this.escapeColumn(alias + "_" + column + embeddedProperties.join("_")) + " " + this.orderBys[columnName];
            })
            .join(", ");

        return [selectString, orderByString];
    }

    protected createOrderByExpression() {

        let orderBys = this.orderBys;

        // if table has a default order then apply it
        if (!Object.keys(orderBys).length && !this.fromTableName) {
            const metadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);
            orderBys = metadata.table.orderBy || {};
        }

        // if user specified a custom order then apply it
        if (Object.keys(orderBys).length > 0)
            return " ORDER BY " + Object.keys(orderBys)
                    .map(columnName => {
                        return this.replacePropertyNames(columnName) + " " + this.orderBys[columnName];
                    })
                    .join(", ");

        return "";
    }

    protected createLimitExpression(): string {
        if (!this.limit) return "";
        return " LIMIT " + this.limit;
    }

    protected createOffsetExpression(): string {
        if (!this.offset) return "";
        return " OFFSET " + this.offset;
    }

    protected createLockExpression(): string {
        switch (this.lockMode) {
            case "pessimistic_read":
                if (this.connection.driver instanceof MysqlDriver) {
                    return " LOCK IN SHARE MODE";

                } else if (this.connection.driver instanceof PostgresDriver) {
                    return " FOR SHARE";

                } else if (this.connection.driver instanceof SqlServerDriver) {
                    return "";

                } else {
                    throw new LockNotSupportedOnGivenDriverError();
                }
            case "pessimistic_write":
                if (this.connection.driver instanceof MysqlDriver || this.connection.driver instanceof PostgresDriver) {
                    return " FOR UPDATE";

                } else if (this.connection.driver instanceof SqlServerDriver) {
                    return "";

                } else {
                    throw new LockNotSupportedOnGivenDriverError();
                }
            default:
                return "";
        }
    }

    protected join(joinType: "INNER"|"LEFT", property: string, alias: string, condition?: string, options?: JoinOptions, mapToProperty?: string, isMappingMany?: boolean): void;
    protected join(joinType: "INNER"|"LEFT", entity: Function, alias: string, condition?: string, options?: JoinOptions, mapToProperty?: string, isMappingMany?: boolean): void;
    protected join(joinType: "INNER"|"LEFT", entityOrProperty: Function|string, alias: string, condition?: string, options?: JoinOptions, mapToProperty?: string, isMappingMany?: boolean): void;
    protected join(joinType: "INNER"|"LEFT", entityOrProperty: Function|string, alias: string, condition?: string, options?: JoinOptions, mapToProperty?: string, isMappingMany: boolean = false): void {

        const joinAttribute = new JoinAttribute(this.connection, this.selectionMap);
        joinAttribute.alias = alias;
        joinAttribute.type = joinType;
        joinAttribute.mapToProperty = mapToProperty;
        joinAttribute.options = options;
        joinAttribute.isMappingMany = isMappingMany;
        joinAttribute.entityOrProperty = entityOrProperty;
        joinAttribute.condition = condition;
        this.joinAttributes.push(joinAttribute);

        // todo: this is temporary, remove after selection refactoring
        const destinationSelection = new Selection(joinAttribute.alias);
        destinationSelection.metadata = joinAttribute.metadata!;
        this.selectionMap.addSelection(destinationSelection);
    }

    protected joinRelationId(joinType: "LEFT"|"INNER",
                             mapToProperty: string,
                             relationName: string,
                             joinAlias?: string,
                             joinCondition?: string): this {

        if (!QueryBuilderUtils.isAliasProperty(relationName))
            throw new Error("Only entity relations are allowed in the leftJoinRelationId operation"); // todo: also check if that relation really has entityId

        const [parentAlias, relationProperty] = relationName.split(".");
        const junctionAlias = parentAlias + "_" + relationProperty + "_relation_id"; // todo: use some function to generate alias

        const relationOwnerSelection = this.selectionMap.findSelectionByAlias(parentAlias);
        const relation = relationOwnerSelection.metadata.findRelationWithPropertyName(relationProperty);

        if (!relation.isManyToMany)
            throw new Error(`Join RelationId is only supported for many-to-many relations`);

        const junctionSelection = new Selection(junctionAlias);
        this.selectionMap.addSelection(junctionSelection);

        let joinInverseSideSelection: Selection|undefined;
        if (joinAlias && joinCondition) {
            joinInverseSideSelection = new Selection(joinAlias);
            joinInverseSideSelection.metadata = relation.inverseEntityMetadata;
            this.selectionMap.addSelection(joinInverseSideSelection);
        }

        this.joinRelationIds.push({
            relationOwnerSelection: relationOwnerSelection,
            relation: relation,
            type: joinType,
            mapToProperty: mapToProperty,
            junctionSelection: junctionSelection,
            joinInverseSideSelection: joinInverseSideSelection,
            joinInverseSideCondition: joinCondition
        });

        return this;
    }

    /**
     * Creates "WHERE" expression and variables for the given "ids".
     */
    protected createWhereIdsExpression(ids: any[]): [string, ObjectLiteral] {
        const metadata = this.connection.getMetadata(this.selectionMap.mainSelection.target);

        // create shortcuts for better readability
        const escapeAlias = (alias: string) => this.escapeAlias(alias);
        const escapeColumn = (column: string) => this.escapeColumn(column);

        const alias = this.selectionMap.mainSelection.alias;
        const parameters: ObjectLiteral = {};
        const whereStrings = ids.map((id, index) => {
            const whereSubStrings: string[] = [];
            if (metadata.hasMultiplePrimaryKeys) {
                metadata.primaryColumns.forEach((primaryColumn, secondIndex) => {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(primaryColumn.fullName) + "=:id_" + index + "_" + secondIndex);
                    parameters["id_" + index + "_" + secondIndex] = id[primaryColumn.fullName];
                });
                metadata.parentIdColumns.forEach((primaryColumn, secondIndex) => {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(id[primaryColumn.fullName]) + "=:parentId_" + index + "_" + secondIndex);
                    parameters["parentId_" + index + "_" + secondIndex] = id[primaryColumn.propertyName];
                });
            } else {
                if (metadata.primaryColumns.length > 0) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(metadata.firstPrimaryColumn.fullName) + "=:id_" + index);
                    parameters["id_" + index] = id;

                } else if (metadata.parentIdColumns.length > 0) {
                    whereSubStrings.push(escapeAlias(alias) + "." + escapeColumn(metadata.parentIdColumns[0].fullName) + "=:parentId_" + index);
                    parameters["parentId_" + index] = id;
                }
            }
            return whereSubStrings.join(" AND ");
        });

        const whereString = whereStrings.length > 1 ? "(" + whereStrings.join(" OR ") + ")" : whereStrings[0];
        return [whereString, parameters];
    }

    protected async getQueryRunner(): Promise<QueryRunner> {

        if (this.queryRunnerProvider instanceof QueryRunnerProvider) {
            return this.queryRunnerProvider.provide();

        } else { // means its empty
            return this.connection.driver.createQueryRunner();
        }
    }

    protected hasOwnQueryRunner(): boolean {
        return !this.queryRunnerProvider;
    }

}
