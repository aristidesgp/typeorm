import {ObjectLiteral} from "../common/ObjectLiteral";
import {EntityMetadata} from "../metadata/EntityMetadata";
import {SubjectChangeMap} from "./SubjectChangeMap";
import {OrmUtils} from "../util/OrmUtils";

/**
 * Subject is a subject of persistence.
 * It holds information about each entity that needs to be persisted:
 * - what entity should be persisted
 * - what is database representation of the persisted entity
 * - what entity metadata of the persisted entity
 * - what is allowed to with persisted entity (insert/update/remove)
 *
 * Having this collection of subjects we can perform database queries.
 */
export class Subject {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    /**
     * Entity metadata of the subject entity.
     */
    metadata: EntityMetadata;

    /**
     * Subject identifier.
     * This identifier is not limited to table entity primary columns.
     * This can be entity id or ids as well as some unique entity properties, like name or title.
     * Insert / Update / Remove operation will be executed by a given identifier.
     */
    identifier: ObjectLiteral|undefined = undefined;

    /**
     * Gets entity sent to the persistence (e.g. changed entity).
     * If entity is not set then this subject is created only for the entity loaded from the database,
     * or this subject is used for the junction operation (junction operations are relying only on identifier).
     */
    entity?: ObjectLiteral;

    /**
     * Database entity.
     * THIS IS NOT RAW ENTITY DATA, its a real entity.
     */
    databaseEntity?: ObjectLiteral;

    /**
     * Changes needs to be applied in the database for the given subject.
     */
    changeMaps: SubjectChangeMap[] = [];

    /**
     * Generated values returned by a database (for example generated id or default values).
     * Used in insert and update operations.
     * Has entity-like structure (not just column database name and values).
     */
    generatedMap?: ObjectLiteral;

    /**
     * Inserted values with updated values of special and default columns.
     * Has entity-like structure (not just column database name and values).
     */
    insertedValueSet?: ObjectLiteral;

    /**
     * Indicates if this subject can be inserted into the database.
     * This means that this subject either is newly persisted, either can be inserted by cascades.
     */
    canBeInserted: boolean = false;

    /**
     * Indicates if this subject can be updated in the database.
     * This means that this subject either was persisted, either can be updated by cascades.
     */
    canBeUpdated: boolean = false;

    /**
     * Indicates if this subject MUST be removed from the database.
     * This means that this subject either was removed, either was removed by cascades.
     */
    mustBeRemoved: boolean = false;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(options: {
        metadata: EntityMetadata,
        entity?: ObjectLiteral,
        databaseEntity?: ObjectLiteral,
        canBeInserted?: boolean,
        canBeUpdated?: boolean,
        mustBeRemoved?: boolean,
        identifier?: ObjectLiteral,
        changeMaps?: SubjectChangeMap[]
    }) {
        this.metadata = options.metadata;
        this.entity = options.entity;
        this.databaseEntity = options.databaseEntity;
        if (options.canBeInserted !== undefined)
            this.canBeInserted = options.canBeInserted;
        if (options.canBeUpdated !== undefined)
            this.canBeUpdated = options.canBeUpdated;
        if (options.mustBeRemoved !== undefined)
            this.mustBeRemoved = options.mustBeRemoved;
        if (options.identifier !== undefined)
            this.identifier = options.identifier;
        if (options.changeMaps !== undefined)
            this.changeMaps.push(...options.changeMaps);

        if (this.entity) {
            this.identifier = this.metadata.isEntityIdMapEmpty(this.entity) ? undefined : this.metadata.getEntityIdMap(this.entity); // todo: try to change

        } else if (this.databaseEntity) {
            this.identifier = this.metadata.isEntityIdMapEmpty(this.databaseEntity) ? undefined : this.metadata.getEntityIdMap(this.databaseEntity); // todo: try to change
        }
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    /**
     * Checks if this subject must be inserted into the database.
     * Subject can be inserted into the database if it is allowed to be inserted (explicitly persisted or by cascades)
     * and if it does not have database entity set.
     */
    get mustBeInserted() {
        return this.canBeInserted && !this.databaseEntity;
    }

    /**
     * Checks if this subject must be updated into the database.
     * Subject can be updated in the database if it is allowed to be updated (explicitly persisted or by cascades)
     * and if it does have differentiated columns or relations.
     */
    get mustBeUpdated() {
        return this.canBeUpdated && this.identifier && this.changeMaps.length > 0;
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Creates a value set needs to be inserted / updated in the database.
     * Value set is based on the entity and change maps of the subject.
     * Important note: this method pops data from this subject's change maps.
     */
    createValueSetAndPopChangeMap(): ObjectLiteral {
        const changeMapsWithoutValues: SubjectChangeMap[] = [];
        const changeSet = this.changeMaps.reduce((updateMap, changeMap) => {
            let value = changeMap.value;
            if (value instanceof Subject) {

                // referenced columns can refer on values both which were just inserted and which were present in the model
                // if entity was just inserted valueSets must contain all values from the entity and values just inserted in the database
                // so, here we check if we have a value set then we simply use it as value to get our reference column values
                // otherwise simply use an entity which cannot be just inserted at the moment and have all necessary data
                value = value.insertedValueSet ? value.insertedValueSet : value.entity;
            }
            // value = changeMap.valueFactory ? changeMap.valueFactory(value) : changeMap.column.createValueMap(value);

            let valueMap: ObjectLiteral|undefined;
            if (this.metadata.isJunction && changeMap.column) {
                valueMap = changeMap.column.createValueMap(changeMap.column.referencedColumn!.getEntityValue(value));

            } else if (changeMap.column) {
                valueMap = changeMap.column.createValueMap(value);

            } else if (changeMap.relation) {

                // value can be a related object, for example: post.question = { id: 1 }
                // or value can be a null or direct relation id, e.g. post.question = 1
                // if its a direction relation id then we just set it to the valueMap,
                // however if its an object then we need to extract its relation id map and set it to the valueMap
                if (value instanceof Object) {

                    // get relation id, e.g. referenced column name and its value,
                    // for example: { id: 1 } which then will be set to relation, e.g. post.category = { id: 1 }
                    const relationId = changeMap.relation!.getRelationIdMap(value);

                    // but relation id can be empty, for example in the case when you insert a new post with category
                    // and both post and category are newly inserted objects (by cascades) and in this case category will not have id
                    // this means we need to insert post without question id and update post's questionId once question be inserted
                    // that's why we create a new changeMap operation for future updation of the post entity
                    if (relationId === undefined) {
                        changeMapsWithoutValues.push(changeMap);
                        this.canBeUpdated = true;
                        return updateMap;
                    }
                    valueMap = changeMap.relation!.createValueMap(relationId);

                } else { // value can be "null" or direct relation id here
                    valueMap = changeMap.relation!.createValueMap(value);
                }
            }

            OrmUtils.mergeDeep(updateMap, valueMap);
            return updateMap;
        }, {} as ObjectLiteral);
        this.changeMaps = changeMapsWithoutValues;
        return changeSet;
    }

}