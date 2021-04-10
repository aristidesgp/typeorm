import {
  EntityCore,
  EntityColumnList,
  EntityEmbedList,
  EntityRelationList,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDriver } from "../driver"

export function entity<
  Columns extends EntityColumnList<PostgresDriver<any>> | undefined,
  Relations extends EntityRelationList | undefined,
  Embeds extends EntityEmbedList<PostgresDriver<any>> | undefined
>(options: {
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
}): EntityCore<
  PostgresDriver<any>,
  ForceCastIfUndefined<Columns, {}>,
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>
> {
  return undefined as any
}
