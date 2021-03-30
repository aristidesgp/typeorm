import { AnyDataSource, DataSourceEntity } from "../data-source"
import {
  FindOptions,
  FindOptionsSelect,
  FindOptionsWhere,
  FindReturnType,
} from "../find-options"
import { ForceEmptyTypeIfUndefined } from "../util"

/**
 * A single repository managing a particular entity.
 */
export type CoreRepository = {
  "@type": "Repository"
}

/**
 *
 */
export interface CoreRepositoryWithFind<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  find<Options extends FindOptions<Source, Entity>>(
    options: Options,
  ): Promise<
    FindReturnType<
      Source,
      Entity,
      ForceEmptyTypeIfUndefined<Options["select"]>,
      false
    >
  >
}

/**
 *
 */
export interface CoreRepositoryWithOptions<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> {
  findOptions: CoreRepositoryOptionsType<Source, Entity>
}

/**
 * Function that produces FindOptions
 */
export type CoreRepositoryOptionsType<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  <Options extends FindOptions<Source, Entity>>(options: Options): Options

  select<Select extends FindOptionsSelect<Source, Entity>>(
    select: Select,
  ): Select

  where<Where extends FindOptionsWhere<Source, Entity>>(where: Where): Where
}
