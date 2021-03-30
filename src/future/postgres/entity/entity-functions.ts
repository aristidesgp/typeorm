import {
  CoreEntity,
  EntityColumns,
  EntityEmbeds,
  EntityRelations,
  ForceEmptyTypeIfUndefined,
} from "../../core"
import { PostgresDriver } from "../driver"

export function entity<
  Columns extends EntityColumns<PostgresDriver<any>> | undefined,
  Relations extends EntityRelations | undefined,
  Embeds extends EntityEmbeds<PostgresDriver<any>> | undefined
>(options: {
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
}): CoreEntity<
  PostgresDriver<any>,
  ForceEmptyTypeIfUndefined<Columns>,
  ForceEmptyTypeIfUndefined<Relations>,
  ForceEmptyTypeIfUndefined<Embeds>
> {
  return undefined as any
}
