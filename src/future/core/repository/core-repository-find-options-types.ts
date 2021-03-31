import { AnyDataSource, DataSourceEntity } from "../data-source"
import {
  FindOptionsMany,
  FindOptionsOrder,
  FindOptionsSelect,
  FindOptionsWhere,
} from "../find-options"

/**
 * Interface for repositories that implement "findOptions" method.
 * "findOptions" method allows to build FindOptions object easily.
 */
export interface CoreRepositoryWithOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  /**
   * Helps to build a FindOptions object.
   */
  findOptions: CoreRepositoryOptionsType<Source, Entity>
}

/**
 * Function type that produces FindOptions.
 * This function also contains functions that help to build FindOptions sub-objects.
 */
export type CoreRepositoryOptionsType<
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
  where<Where extends FindOptionsWhere<Source, Entity>>(where: Where): Where

  /**
   * Creates a FindOptionsOrder object.
   */
  order<Order extends FindOptionsOrder<Source, Entity>>(order: Order): Order
}
