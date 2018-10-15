import {Subject} from "./Subject";
import {DateUtils} from "../util/DateUtils";
import {ObjectLiteral} from "../common/ObjectLiteral";
import {EntityMetadata} from "../metadata/EntityMetadata";

/**
 * Finds what columns are changed in the subject entities.
 */
export class SubjectChangedColumnsComputer {

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Finds what columns are changed in the subject entities.
     */
    compute(subjects: Subject[]) {
        subjects.forEach(subject => {
            this.computeDiffColumns(subject);
            this.computeDiffRelationalColumns(subjects, subject);
        });
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Differentiate columns from the updated entity and entity stored in the database.
     */
    protected computeDiffColumns(subject: Subject): void {

        // if there is no persisted entity then nothing to compute changed in it
        if (!subject.entity)
            return;

        subject.metadata.columns.forEach(column => {

            // ignore special columns
            if (column.isVirtual ||
                column.isDiscriminator ||
                column.isUpdateDate ||
                column.isVersion ||
                column.isCreateDate)
                return;

            // get user provided value - column value from the user provided persisted entity
            const entityValue = column.getEntityValue(subject.entity!);

            // we don't perform operation over undefined properties (but we DO need null properties!)
            if (entityValue === undefined)
                return;

            // if there is no database entity then all columns are treated as new, e.g. changed
            if (subject.databaseEntity) {

                // get database value of the column
                let databaseValue = column.getEntityValue(subject.databaseEntity);

                // filter out "relational columns" only in the case if there is a relation object in entity
                if (column.relationMetadata) {
                    const value = column.relationMetadata.getEntityValue(subject.entity!);
                    if (value !== null && value !== undefined)
                        return;
                }
                let normalizedValue = entityValue;
                // normalize special values to make proper comparision
                if (entityValue !== null && entityValue !== undefined) {
                    if (column.type === "date") {
                        normalizedValue = DateUtils.mixedDateToDateString(entityValue);

                    } else if (column.type === "time") {
                        normalizedValue = DateUtils.mixedDateToTimeString(entityValue);

                    } else if (column.type === "datetime" || column.type === Date) {
                        normalizedValue = DateUtils.mixedDateToUtcDatetimeString(entityValue);
                        databaseValue = DateUtils.mixedDateToUtcDatetimeString(databaseValue);

                    } else if (column.type === "json" || column.type === "jsonb") {
                        normalizedValue = JSON.stringify(entityValue);
                        if (databaseValue !== null && databaseValue !== undefined)
                            databaseValue = JSON.stringify(databaseValue);

                    } else if (column.type === "sample-array") {
                        normalizedValue = DateUtils.simpleArrayToString(entityValue);
                        databaseValue = DateUtils.simpleArrayToString(databaseValue);
                    }
                }

                // if value is not changed - then do nothing
                if (normalizedValue === databaseValue)
                    return;
            }
            subject.diffColumns.push(column);
            // find if there is already a column to be changed
            const changeMap = subject.changeMaps.find(changeMap => changeMap.column === column);
            if (changeMap) { // and update its value if it was found
                changeMap.value = entityValue;

            } else { // if it wasn't found add a new column for change
                subject.changeMaps.push({
                    column: column,
                    value: entityValue
                });
            }
        });
    }

    /**
     * Difference columns of the owning one-to-one and many-to-one columns.
     */
    protected computeDiffRelationalColumns(allSubjects: Subject[], subject: Subject): void {

        // if there is no persisted entity then nothing to compute changed in it
        if (!subject.entity)
            return;

        subject.metadata.relationsWithJoinColumns.forEach(relation => {

            // get the related entity from the persisted entity
            let relatedEntity = relation.getEntityValue(subject.entity!);

            // we don't perform operation over undefined properties (but we DO need null properties!)
            if (relatedEntity === undefined)
                return;

            // if there is no database entity then all relational columns are treated as new, e.g. changed
            if (subject.databaseEntity) {

                // here we cover two scenarios:
                // 1. related entity can be another entity which is natural way
                // 2. related entity can be just an entity id
                // if relation entity is just a relation id set (for example post.tag = 1)
                // then we create an id map from it to make a proper comparision
                let relatedEntityRelationIdMap: ObjectLiteral = relatedEntity;
                if (relatedEntityRelationIdMap !== null && relatedEntityRelationIdMap instanceof Object)
                    relatedEntityRelationIdMap = relation.getRelationIdMap(relatedEntityRelationIdMap)!;

                // get database related entity. Since loadRelationIds are used on databaseEntity
                // related entity will contain only its relation ids
                const databaseRelatedEntityRelationIdMap = relation.getEntityValue(subject.databaseEntity);

                // if relation ids are equal then we don't need to update anything
                const areRelatedIdsEqual = EntityMetadata.compareIds(relatedEntityRelationIdMap, databaseRelatedEntityRelationIdMap);
                if (areRelatedIdsEqual) {
                    return;
                } else {
                    subject.diffRelations.push(relation);
                }
            }

            // if there is an inserted subject for the related entity of the persisted entity then use it as related entity
            // this code is used for related entities without ids to be properly inserted (and then updated if needed)
            const valueSubject = allSubjects.find(subject => subject.mustBeInserted && subject.entity === relatedEntity);
            if (valueSubject)
                relatedEntity = valueSubject;

            // find if there is already a relation to be changed
            const changeMap = subject.changeMaps.find(changeMap => changeMap.relation === relation);
            if (changeMap) { // and update its value if it was found
                changeMap.value = relatedEntity;

            } else { // if it wasn't found add a new relation for change
                subject.changeMaps.push({
                    relation: relation,
                    value: relatedEntity
                });
            }
        });
    }

}
