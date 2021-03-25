import {
  Entity,
  EntityColumns,
  EntityEmbeds,
  EntityRelations,
  ForceEmptyTypeIfUndefined,
} from "../core"
import { PostgresTypes } from "./types"

export function entity<
  Columns extends EntityColumns<PostgresTypes> | undefined,
  Relations extends EntityRelations | undefined,
  Embeds extends EntityEmbeds<PostgresTypes> | undefined
>(options: {
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
}): Entity<
  PostgresTypes,
  ForceEmptyTypeIfUndefined<Columns>,
  ForceEmptyTypeIfUndefined<Relations>,
  ForceEmptyTypeIfUndefined<Embeds>
> {
  return undefined as any
}
