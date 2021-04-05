import { AnyDataSource, DataSourceEntity } from "../../data-source"
import { FindOptionsMany } from "./find-options-many"
import { FindOptionsOrder } from "./find-options-order"
import { FindOptionsSelect } from "./find-options-select"
import { WhereOptions } from "../where-options"

/**
 * Function type that produces FindOptions.
 * This function also contains functions that help to build FindOptions sub-objects.
 */
export type FindOptionsBuilder<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  /**
   * Creates a FindOptionsMany object.
   */
  <Options extends FindOptionsMany<Source, Entity>>(options: Options): Options

  /**
   * Creates a FindOptionsSelect object.
   */
  select<Select extends FindOptionsSelect<Source, Entity>>(
    select: Select,
  ): Select

  /**
   * Creates a FindOptionsWhere object.
   */
  where<Where extends WhereOptions<Source, Entity>>(where: Where): Where

  /**
   * Creates a FindOptionsOrder object.
   */
  order<Order extends FindOptionsOrder<Source, Entity>>(order: Order): Order
}
