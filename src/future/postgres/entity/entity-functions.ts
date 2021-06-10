import { AnyModel, Model } from "../../../repository/model"
import {
  EntityColumnList,
  EntityEmbedList,
  EntityRelationList,
  EntitySchema,
  EntitySchemaType,
  EntityVirtuals,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDataSource } from "../data-source"

export function entity<
  Type extends EntitySchemaType,
  GivenModel,
  Columns extends EntityColumnList<PostgresDataSource<any>> | undefined,
  Relations extends EntityRelationList | undefined,
  Embeds extends EntityEmbedList<PostgresDataSource<any>> | undefined,
  Virtuals extends EntityVirtuals<PostgresDataSource<any>, any> | undefined
>(options: {
  type?: Type
  model?: GivenModel
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
  virtuals?: Virtuals
}): EntitySchema<
  Type extends EntitySchemaType ? Type : "default",
  GivenModel extends AnyModel ? GivenModel : Model<undefined>,
  Columns extends EntityColumnList<any> ? Columns : {},
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>,
  ForceCastIfUndefined<Virtuals, {}>
> {
  return undefined as any
}
