import { AnyEntity, ReferencedEntity } from "../../entity/entity-core"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<Entity extends AnyEntity> = {
  [P in keyof Entity["columns"]]?: Entity["driver"]["types"]["orderTypes"]
} &
  {
    [P in keyof Entity["relations"]]?: FindOptionsOrder<
      ReferencedEntity<Entity, P>
    >
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsOrder<Entity["embeds"][P]>
  }
