import { AnyDriver } from "../driver"
import { ValueOf } from "../util"
import { FindOptionsSelect } from "./find-options-select"
import { FindOptionsWhere } from "./find-options-where"

export type FindOptions<
  Driver extends AnyDriver,
  Entity extends ValueOf<Driver["options"]["entities"]>
> = {
  select?: FindOptionsSelect<Driver, Entity>
  where?: FindOptionsWhere<Driver, Entity>
  // order?: FindOptionsOrder<Entity>
}
