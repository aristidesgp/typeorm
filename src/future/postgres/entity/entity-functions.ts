import { AnyModel, Model } from "../../../repository/model"
import {
  EntityCore,
  EntityColumnList,
  EntityEmbedList,
  EntityRelationList,
  ForceCastIfUndefined,
  AnyEntityList,
  EntityCollection,
} from "../../core"
import { PostgresDriver, PostgresDriverTypes } from "../driver"

export function entity<
  GivenModel,
  Columns extends EntityColumnList<PostgresDriverTypes> | undefined,
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
  Columns extends EntityColumnList<any> ? Columns : {},
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>
> {
  return undefined as any
}

export function entityList<T extends AnyEntityList>(
  entities: T,
): EntityCollection<PostgresDriverTypes, T> {
  return undefined as any
}
