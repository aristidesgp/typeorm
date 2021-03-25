import { AnyDataSource, DataSourceEntities } from "../data-source";
import { Repository } from "../repository";

export type Manager<Source extends AnyDataSource> = {
    "@type": "Manager";
    repository<EntityName extends keyof Source["options"]["entities"]>(
        entity: EntityName
    ): Repository<Source, Source["options"]["entities"][EntityName]>;
    repository<Entity extends DataSourceEntities<Source>>(
        entity: Entity
    ): Repository<Source, Entity>;
};
