export interface CoreQueryRunner {
  "@type": "QueryRunner"
  // dataSource: DataSource<SourceOptions, this>
  // repository<EntityName extends keyof Source["options"]["entities"]>(
  //   entity: EntityName,
  // ): Source["options"]["type"]["repository"]
  // repository<Entity extends DataSourceEntities<Source>>(
  //   entity: Entity,
  // ): Repository<Source, Entity>
}
