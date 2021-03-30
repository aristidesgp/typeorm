import { PostgresRepository } from "../../postgres"
import { AnyDataSource, DataSourceEntity } from "../data-source"

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
  repository<Entity extends DataSourceEntity<Source>>(
    entity: Entity,
  ): PostgresRepository<Source, Entity>
}
