import { AnyDataSource, DataSourceEntity } from "../../data-source"
import { ReferencedEntity } from "../../entity"

/**
 * Ordering options in find options.
 */
export type FindOptionsOrder<
  Source extends AnyDataSource,
  Entity extends DataSourceEntity<Source>
> = {
  [P in keyof Entity["columns"]]?: Source["driver"]["types"]["orderTypes"]
} &
  {
    [P in keyof Entity["relations"]]?: FindOptionsOrder<
      Source,
      ReferencedEntity<Source, Entity, P>
    >
  } &
  {
    [P in keyof Entity["embeds"]]?: FindOptionsOrder<
      Source,
      Entity["embeds"][P]
    >
  }
