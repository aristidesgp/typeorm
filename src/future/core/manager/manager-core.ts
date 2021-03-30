import { PostgresRepository } from "../../postgres"
import { AnyDataSource } from "../data-source"
import { DriverEntities } from "../driver"

export interface CoreManager {
  "@type": "Manager"
  // dataSource: DataSource<SourceOptions, this>
}

export interface CoreManagerWithRepository<Source extends AnyDataSource> {
  repository<EntityName extends keyof Source["driver"]["options"]["entities"]>(
    entity: EntityName,
  ): PostgresRepository<
    Source,
    Source["driver"]["options"]["entities"][EntityName]
  >
  repository<Entity extends DriverEntities<Source["driver"]>>(
    entity: Entity,
  ): PostgresRepository<Source, Entity>
}
