import { AnyModel, Model } from "../../../repository/model"
import {
  EntityCore,
  EntityColumnList,
  EntityEmbedList,
  EntityRelationList,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDriver } from "../driver"

export function entity<
  GivenModel,
  Columns extends EntityColumnList<PostgresDriver<any>> | undefined,
  Relations extends EntityRelationList | undefined,
  Embeds extends EntityEmbedList<PostgresDriver<any>> | undefined
>(options: {
  model?: GivenModel
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
}): EntityCore<
  PostgresDriver<any>,
  GivenModel extends AnyModel ? GivenModel : Model<undefined>,
  ForceCastIfUndefined<Columns, {}>,
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>
> {
  return undefined as any
}
