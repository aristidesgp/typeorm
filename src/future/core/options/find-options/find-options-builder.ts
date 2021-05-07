import { AnyDriver } from "../../driver"
import { AnyEntity } from "../../entity"
import { WhereOptions } from "../where-options"
import { FindOptionsMany } from "./find-options-many"
import { FindOptionsOrder } from "./find-options-order"
import { FindOptionsSelect } from "./find-options-select"

/**
 * Function type that produces FindOptions.
 * This function also contains functions that help to build FindOptions sub-objects.
 */
export type FindOptionsBuilder<
  Driver extends AnyDriver,
  Entity extends AnyEntity
> = {
  /**
   * Creates a FindOptionsMany object.
   */
  <Options extends FindOptionsMany<Driver, Entity>>(options: Options): Options

  /**
   * Creates a FindOptionsSelect object.
   */
  select<Select extends FindOptionsSelect<Entity>>(select: Select): Select

  /**
   * Creates a FindOptionsWhere object.
   */
  where<Where extends WhereOptions<Driver, Entity>>(where: Where): Where

  /**
   * Creates a FindOptionsOrder object.
   */
  order<Order extends FindOptionsOrder<Driver, Entity>>(order: Order): Order
}
