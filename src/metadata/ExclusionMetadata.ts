import type { EntityMetadata } from "./EntityMetadata"
import type { NamingStrategyInterface } from "../naming-strategy/NamingStrategyInterface"
import type { ExclusionMetadataArgs } from "../metadata-args/ExclusionMetadataArgs"

/**
 * Exclusion metadata contains all information about table's exclusion constraints.
 */
export class ExclusionMetadata {
    // ---------------------------------------------------------------------
    // Public Properties
    // ---------------------------------------------------------------------

    /**
     * Entity metadata of the class to which this exclusion constraint is applied.
     */
    entityMetadata: EntityMetadata

    /**
     * Target class to which metadata is applied.
     */
    target?: Function | string

    /**
     * Exclusion expression.
     */
    expression: string

    /**
     * User specified exclusion constraint name.
     */
    givenName?: string

    /**
     * Final exclusion constraint name.
     * If exclusion constraint name was given by a user then it stores normalized (by naming strategy) givenName.
     * If exclusion constraint name was not given then its generated.
     */
    name: string

    // ---------------------------------------------------------------------
    // Constructor
    // ---------------------------------------------------------------------

    constructor(options: {
        entityMetadata: EntityMetadata
        args?: ExclusionMetadataArgs
    }) {
        this.entityMetadata = options.entityMetadata

        if (options.args) {
            this.target = options.args.target
            this.expression = options.args.expression
            this.givenName = options.args.name
        }
    }

    // ---------------------------------------------------------------------
    // Public Build Methods
    // ---------------------------------------------------------------------

    /**
     * Builds some depend exclusion constraint properties.
     * Must be called after all entity metadata's properties map, columns and relations are built.
     */
    build(namingStrategy: NamingStrategyInterface): this {
        this.name = this.givenName
            ? this.givenName
            : namingStrategy.exclusionConstraintName(
                  this.entityMetadata.tableName,
                  this.expression,
              )
        return this
    }
}
