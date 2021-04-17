import {
  AnyEntityList,
  EntityCollection,
  EntityPointer,
  EntityReference,
  EntityResolveMap,
  EntityResolver,
} from "../../core"
import { PostgresDriverTypes } from "../driver"
import { PostgresRepository } from "../repository"

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
