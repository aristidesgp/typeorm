import {JoinColumnOptions} from "../decorator/options/JoinColumnOptions";
import {RelationType} from "../metadata/types/RelationTypes";
import {JoinTableMultipleColumnsOptions} from "../decorator/options/JoinTableMuplipleColumnsOptions";
import {OnDeleteType} from "../metadata/types/OnDeleteType";
import {OnUpdateType} from "../metadata/types/OnUpdateType";
import {JoinTableOptions} from "../index";

export interface EntitySchemaRelationOptions {

    /**
     * Indicates with which entity this relation is made.
     */
    target: Function|string;

    /**
     * Type of relation. Can be one of the value of the RelationTypes class.
     */
    type: RelationType;

    /**
     * Inverse side of the relation.
     */
    inverseSide?: string;

    /**
     * Indicates if this relation will be lazily loaded.
     */
    lazy?: boolean;

    /**
     * Indicates if this relation will be eagerly loaded.
     */
    eager?: boolean;

    /**
     * Indicates if persistence is enabled for the relation.
     * By default its enabled, but if you want to avoid any changes in the relation to be reflected in the database you can disable it.
     * If its disabled you can only change a relation from inverse side of a relation or using relation query builder functionality.
     * This is useful for performance optimization since its disabling avoid multiple extra queries during entity save.
     */
    persistence?: boolean;

    /**
     * Indicates if this relation will be a primary key.
     * Can be used only for many-to-one and owner one-to-one relations.
     */
    primary?: boolean;

    /**
     * Join table options of this column. If set to true then it simply means that it has a join table.
     */
    joinTable?: boolean|JoinTableOptions|JoinTableMultipleColumnsOptions;

    /**
     * Join column options of this column. If set to true then it simply means that it has a join column.
     */
    joinColumn?: boolean|JoinColumnOptions;

    /**
     * Indicates if this is a parent (can be only many-to-one relation) relation in the tree tables.
     */
    treeParent?: boolean;

    /**
     * Indicates if this is a children (can be only one-to-many relation) relation in the tree tables.
     */
    treeChildren?: boolean;

    /**
     * If set to true then it means that related object can be allowed to be inserted / updated / removed to the db.
     * This is option a shortcut if you would like to set cascadeInsert, cascadeUpdate and cascadeRemove to true.
     */
    cascade?: boolean|("insert"|"update"|"remove")[];

    /**
     * Default database value.
     */
    default?: any;

    /**
     * Indicates if relation column value can be nullable or not.
     */
    nullable?: boolean;

    /**
     * Database cascade action on delete.
     */
    onDelete?: OnDeleteType;

    /**
     * Database cascade action on update.
     */
    onUpdate?: OnUpdateType;

}