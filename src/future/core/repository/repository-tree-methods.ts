import { AnyDataSource, DataSourceEntity } from "../data-source"

/**
 * Interface for repositories that implement methods working with tree tables / structures.
 */
export interface RepositoryTreeMethods<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {}
