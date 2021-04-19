import { AnyModel, Model } from "../../../repository/model"
import {
  AnyEntityCollection,
  AnyEntityList,
  AnyRepositoryList,
  EntityColumnList,
  EntityCore,
  EntityEmbedList,
  EntityRelationList,
  ForceCastIfUndefined,
} from "../../core"
import { PostgresEntityList } from "../entity"
import { createPostgresManager } from "../manager"
import { createPostgresQueryRunner } from "../query-runner"
import { PostgresDriverTypes } from "./driver-column-types"
import { PostgresDriverOptions } from "./driver-options-types"
import { PostgresDriver } from "./driver-types"

export type VirtualLazyPropertiesList<Manager> = {
  [key: string]: (manager: Manager) => Promise<any>
}

export type Postgres = {
  /**
   * Creates a postgres driver.
   */
  <
    Options extends PostgresDriverOptions<
      AnyEntityCollection,
      AnyRepositoryList
    >
  >(
    options: Options,
  ): PostgresDriver<Options>

  /**
   * Creates a postgres entity.
   */
  entity<
    GivenModel,
    Columns extends EntityColumnList<PostgresDriverTypes> | undefined,
    Relations extends EntityRelationList | undefined,
    Embeds extends EntityEmbedList<PostgresDriver<any>> | undefined,
    VirtualLazyProperties extends VirtualLazyPropertiesList<
      PostgresDriver<any>["manager"]
    >
  >(options: {
    virtualLazyProperties?: VirtualLazyProperties
    model?: GivenModel
    columns?: Columns
    relations?: Relations
    embeds?: Embeds
  }): EntityCore<
    PostgresDriver<any>,
    GivenModel extends AnyModel ? GivenModel : Model<undefined>,
    Columns extends EntityColumnList<any> ? Columns : {},
    ForceCastIfUndefined<Relations, {}>,
    ForceCastIfUndefined<Embeds, {}>
  >

  /**
   * Creates a postgres entity list.
   */
  entities<T extends AnyEntityList>(entities: T): PostgresEntityList<T>
}

export const Postgres: Postgres = function <
  Options extends PostgresDriverOptions<AnyEntityCollection, AnyRepositoryList>
>(options: Options): PostgresDriver<Options> {
  // return null as any
  return {
    types: null as any,
    manager: null as any,
    queryRunner: null as any,
    options,
    builder: {
      manager(dataSource) {
        return createPostgresManager(dataSource)
      },
      queryRunner(dataSource) {
        return createPostgresQueryRunner()
      },
    },
  }
}

Postgres.entity = () => {
  return undefined as any
}
Postgres.entities = () => {
  return undefined as any
}

// function Postgres(): PostgresConstructor {
//   return {} as any
// }
// Options.select = () => {
//   return {} as any
// }
//
// export const Postgres: Postgres =
