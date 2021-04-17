import { AnyModel, Model } from "../../../repository/model"
import {
  EntityCore,
  EntityColumnList,
  EntityEmbedList,
  EntityRelationList,
  ForceCastIfUndefined,
  AnyEntityList,
  EntityCollection,
  EntityReference,
  EntityPointer,
  EntityResolveMap,
  EntityResolver,
} from "../../core"
import { PostgresDriver, PostgresDriverTypes } from "../driver"
import { PostgresRepository } from "../repository"

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
): PostgresEntityCollection<T> {
  return undefined as any
}

export interface PostgresEntityCollection<Entities extends AnyEntityList>
  extends EntityCollection<Entities> {
  "@type": "EntityCollection"
  entities: Entities

  resolve<
    EntityRef extends EntityReference<Entities>,
    Entity extends EntityPointer<Entities, EntityRef>
  >(
    entity: EntityRef,
    resolver: EntityResolveMap<PostgresDriverTypes, Entities, Entity>,
  ): EntityResolver<Entity>

  repository<EntityName extends keyof Entities, CustomRepository>(
    entity: EntityName,
    custom: CustomRepository &
      ThisType<
        PostgresRepository<PostgresDriverTypes, Entities, Entities[EntityName]>
      >,
  ): {
    [P in EntityName]: PostgresRepository<
      PostgresDriverTypes,
      Entities,
      Entities[EntityName]
    > &
      CustomRepository
  }
}

// custom: CustomRepository & ThisType<PostgresRepository<Source, Entity>>,
// ): PostgresRepository<Source, Entity> & CustomRepository
