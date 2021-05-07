import { AnyModel, Model } from "../../../repository/model"
import {
  EntityColumnList,
  EntityCore,
  EntityEmbedList,
  EntityMethods,
  EntityProperties,
  EntityRelationList,
  EntityType,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresDriver, PostgresDriverTypes } from "../driver"

export function entity<
  Type extends EntityType,
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
}): EntityCore<
  Type extends EntityType ? Type : "entity-schema",
  PostgresDriver<any>,
  GivenModel extends AnyModel ? GivenModel : Model<undefined>,
  Columns extends EntityColumnList<PostgresDriver<any>> ? Columns : {},
  ForceCastIfUndefined<Relations, {}>,
  ForceCastIfUndefined<Embeds, {}>,
  ForceCastIfUndefined<VirtualMethods, {}>,
  ForceCastIfUndefined<VirtualLazyProperties, {}>,
  ForceCastIfUndefined<VirtualEagerProperties, {}>
> {
  return undefined as any
}

export function entityCls<
  ClassType extends new (...args: any) => any,
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
>(
  cls: ClassType,
): EntityCore<
  "class",
  PostgresDriver<any>,
  Model<InstanceType<ClassType>>,
  {},
  {},
  {},
  {},
  {},
  {}
> {
  return undefined as any
}
