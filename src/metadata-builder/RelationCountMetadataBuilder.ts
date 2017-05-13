import {RelationCountMetadataArgs} from "../metadata-args/RelationCountMetadataArgs";
import {QueryBuilder} from "../query-builder/QueryBuilder";
import {EntityMetadata} from "../metadata/EntityMetadata";
import {RelationMetadata} from "../metadata/RelationMetadata";

/**
 * Contains all information about entity's relation count.
 */
export class RelationCountMetadataBuilder {

    // ---------------------------------------------------------------------
    // Public Properties
    // ---------------------------------------------------------------------

    /**
     * Entity metadata where this column metadata is.
     */
    entityMetadata: EntityMetadata;

    // ---------------------------------------------------------------------
    // Readonly Properties
    // ---------------------------------------------------------------------

    /**
     * Relation name which need to count.
     */
    readonly relationNameOrFactory: string|((object: any) => any);

    /**
     * Target class to which metadata is applied.
     */
    readonly target: Function|string;

    /**
     * Target's property name to which this metadata is applied.
     */
    readonly propertyName: string;

    /**
     * Alias of the joined (destination) table.
     */
    readonly alias?: string;

    /**
     * Extra condition applied to "ON" section of join.
     */
    readonly queryBuilderFactory?: (qb: QueryBuilder<any>) => QueryBuilder<any>;

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(entityMetadata: EntityMetadata, args: RelationCountMetadataArgs) {
        this.entityMetadata = entityMetadata;
        this.target = args.target;
        this.propertyName = args.propertyName;
        this.relationNameOrFactory = args.relation;
        this.alias = args.alias;
        this.queryBuilderFactory = args.queryBuilderFactory;
    }

    // ---------------------------------------------------------------------
    // Accessors
    // ---------------------------------------------------------------------

    /**
     * Relation which need to count.
     */
    get relation(): RelationMetadata {
        const propertyName = this.relationNameOrFactory instanceof Function ? this.relationNameOrFactory(this.entityMetadata.propertiesMap) : this.relationNameOrFactory;
        const relation = this.entityMetadata.relations.find(relation => relation.propertyName === propertyName);
        if (!relation)
            throw new Error(`Cannot find relation ${propertyName}. Wrong relation specified for @RelationCount decorator.`);

        return relation;
    }

}