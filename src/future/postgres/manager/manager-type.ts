import { AnyDriver, CoreManager, CoreManagerWithRepository } from "../../core"

export interface PostgresManager<Driver extends AnyDriver>
  extends CoreManager,
    CoreManagerWithRepository<Driver> {}
