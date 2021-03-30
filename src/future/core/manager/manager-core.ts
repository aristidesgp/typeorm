import { PostgresRepository } from "../../postgres"
import { DriverEntities } from "../data-source"
import { AnyDriver } from "../driver"

export interface CoreManager {
  "@type": "Manager"
  // dataSource: DataSource<SourceOptions, this>
  // repository<EntityName extends keyof Source["options"]["entities"]>(
  //   entity: EntityName,
  // ): Source["options"]["type"]["repository"]
  // repository<Entity extends DataSourceEntities<Source>>(
  //   entity: Entity,
  // ): Repository<Source, Entity>
}

export interface CoreManagerWithRepository<Driver extends AnyDriver> {
  repository<EntityName extends keyof Driver["options"]["entities"]>(
    entity: EntityName,
  ): PostgresRepository<Driver, Driver["options"]["entities"][EntityName]>
  repository<Entity extends DriverEntities<Driver>>(
    entity: Entity,
  ): PostgresRepository<Driver, Entity>
}
