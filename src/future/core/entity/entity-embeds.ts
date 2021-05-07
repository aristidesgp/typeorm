import { AnyDriver } from "../driver"
import { AnyEntityCore } from "./entity-core"

/**
 * List of embeds defined in the entity.
 *
 * todo: create a separate type for embed and create "EntityLike" type for both of them
 */
export type EntityEmbedList<Driver extends AnyDriver> = {
  [key: string]: AnyEntityCore
}
