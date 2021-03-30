import { AnyDataSource, DataSourceEntity } from "../data-source"
import { FindOptionsSelect } from "./find-options-select"
import { FindOptionsWhere } from "./find-options-where"

export type FindOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  select?: FindOptionsSelect<Source, Entity>
  where?: FindOptionsWhere<Source, Entity>
  // order?: FindOptionsOrder<Entity>
}
