import { AnyDataSource } from "../../data-source"
import { AnyEntity } from "../../entity"
import { OrderOptions } from "../order-options"
import { SelectAndMapOptions, SelectOptions } from "../select-options"
import { WhereOptions } from "../where-options"
import { FindOptionsMany } from "./find-options-many"

/**
 * Function type that produces FindOptions.
 * This function also contains functions that help to build FindOptions sub-objects.
 */
export type FindOptionsBuilder<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> = {
  /**
   * Creates a FindOptionsMany object.
   */
  <Options extends FindOptionsMany<DataSource, Entity>>(
    options: Options,
  ): Options

  /**
   * Creates a SelectAndMapOptions object.
   */
  selectAndMap<SelectAndMap extends SelectAndMapOptions<DataSource, Entity>>(
    selectAndMap: SelectAndMap,
  ): SelectAndMap

  /**
   * Creates a SelectOptions object.
   */
  select<Select extends SelectOptions<Entity>>(select: Select): Select

  /**
   * Creates a WhereOptions object.
   */
  where<Where extends WhereOptions<DataSource, Entity>>(where: Where): Where

  /**
   * Creates a OrderOptions object.
   */
  order<Order extends OrderOptions<DataSource, Entity>>(order: Order): Order
}
