import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Interface for repositories that implement methods working with tree tables / structures.
 */
export interface RepositoryTreeMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {}
