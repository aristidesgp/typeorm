import {
  AnyDataSource,
  CoreManager,
  CoreManagerWithRepository,
} from "../../core"

export interface PostgresManager<Source extends AnyDataSource>
  extends CoreManager,
    CoreManagerWithRepository<Source> {}
