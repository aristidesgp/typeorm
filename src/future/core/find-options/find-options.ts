import { AnyDataSource } from "../data-source"
import { ValueOf } from "../util"
import { FindOptionsSelect } from "./find-options-select"
import { FindOptionsWhere } from "./find-options-where"

export type FindOptions<
  Source extends AnyDataSource,
  Entity extends ValueOf<Source["driver"]["options"]["entities"]>
> = {
  select?: FindOptionsSelect<Source, Entity>
  where?: FindOptionsWhere<Source, Entity>
  // order?: FindOptionsOrder<Entity>
}
