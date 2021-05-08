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
import { PostgresDriver, PostgresDriverTypes } from "../driver"

export function entity<
  Type extends EntitySchemaType,
  GivenModel,
  Columns extends EntityColumnList<PostgresDriver<any>> | undefined,
  Relations extends EntityRelationList | undefined,
  Embeds extends EntityEmbedList<PostgresDriver<any>> | undefined,
  VirtualMethods extends EntityMethods | undefined,
  VirtualLazyProperties extends
    | EntityProperties<PostgresDriver<any>>
    | undefined,
  VirtualEagerProperties extends
    | EntityProperties<PostgresDriver<any>>
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
