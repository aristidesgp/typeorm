import { AnyModel, Model } from "../../../repository/model"
import {
  EntityColumnList,
  EntityCore,
  EntityEmbedList,
  EntityMethods,
  EntityProperties,
  EntityRelationList,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDriver, PostgresDriverTypes } from "../driver"

export function entity<
  GivenModel,
  Columns extends EntityColumnList<PostgresDriverTypes> | undefined,
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
  model?: GivenModel
  columns?: Columns
  relations?: Relations
  embeds?: Embeds
  virtualMethods?: VirtualMethods
  virtualLazyProperties?: VirtualLazyProperties
  virtualEagerProperties?: VirtualEagerProperties
}): EntityCore<
  PostgresDriver<any>,
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
