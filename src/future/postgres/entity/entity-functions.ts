import { AnyModel, Model } from "../../../repository/model"
import {
  EntityColumnList,
  EntitySchema,
  EntityEmbedList,
  EntityMethods,
  EntityProperties,
  EntityRelationList,
  EntitySchemaType,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDataSource, PostgresDataSourceTypes } from "../data-source"

export function entity<
  Type extends EntitySchemaType,
  GivenModel,
  Columns extends EntityColumnList<PostgresDataSource<any>> | undefined,
  Relations extends EntityRelationList | undefined,
  Embeds extends EntityEmbedList<PostgresDataSource<any>> | undefined,
  VirtualMethods extends EntityMethods | undefined,
  VirtualLazyProperties extends
    | EntityProperties<PostgresDataSource<any>>
    | undefined,
  VirtualEagerProperties extends
    | EntityProperties<PostgresDataSource<any>>
    | undefined
>(options: {
  type?: Type
  model?: GivenModel
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
  virtualMethods?: VirtualMethods
  virtualLazyProperties?: VirtualLazyProperties
  virtualEagerProperties?: VirtualEagerProperties
}): EntitySchema<
  Type extends EntitySchemaType ? Type : "default",
  GivenModel extends AnyModel ? GivenModel : Model<undefined>,
  Columns extends EntityColumnList<any> ? Columns : {},
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>,
  ForceCastIfUndefined<VirtualMethods, {}>,
  ForceCastIfUndefined<VirtualLazyProperties, {}>,
  ForceCastIfUndefined<VirtualEagerProperties, {}>
> {
  return undefined as any
}
