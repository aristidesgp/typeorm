import { PostgresRepository } from "../../postgres"
import { AnyDriver, DriverEntities } from "../driver"

export interface CoreManager {
  "@type": "Manager"
  // dataSource: DataSource<SourceOptions, this>
}

export interface CoreManagerWithRepository<Driver extends AnyDriver> {
  repository<EntityName extends keyof Driver["options"]["entities"]>(
    entity: EntityName,
  ): PostgresRepository<Driver, Driver["options"]["entities"][EntityName]>
  repository<Entity extends DriverEntities<Driver>>(
    entity: Entity,
  ): PostgresRepository<Driver, Entity>
}
