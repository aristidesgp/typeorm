import type { ObjectType } from "./ObjectType"
import type { EntitySchema } from ".."

/**
 * Entity target.
 */
export type EntityTarget<Entity> =
    | ObjectType<Entity>
    | EntitySchema<Entity>
    | string
    | { type: Entity; name: string }
