import {
  AnyEntityList,
  EntityCollection,
  EntityResolveMap,
  EntityResolver,
} from "../../core"
import { PostgresDriverTypes } from "../driver"
import { PostgresRepository } from "../repository"

export interface PostgresEntityCollection<Entities extends AnyEntityList>
  extends EntityCollection<Entities> {
  /**
   * Logic for entity properties and methods resolving.
   */
  resolve<EntityName extends keyof Entities>(
    entity: EntityName,
    resolver: EntityResolveMap<
      PostgresDriverTypes,
      Entities,
      Entities[EntityName]
    >,
  ): EntityResolver<Entities[EntityName]>

  /**
   * Creates a custom repository for a given entity.
   */
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
