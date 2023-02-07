import type { RemoveEvent } from "./RemoveEvent"

/**
 * SoftRemoveEvent is an object that broadcaster sends to the entity subscriber when entity is being soft removed to the database.
 */
export type SoftRemoveEvent<Entity> = RemoveEvent<Entity>
