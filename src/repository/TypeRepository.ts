/**
 * Value of order by in find options.
 */
import { Entity } from "../decorator/entity/Entity";

export type FindOptionsOrderByValue = "ASC" | "DESC" | "asc" | "desc" | 1 | -1 | {
    direction?: "asc"|"desc"|"ASC"|"DESC";
    nulls?: "first"|"last"|"FIRST"|"LAST";
};

/**
 * Order by find options.
 */
export type FindOptionsOrder<E> = {
    [P in keyof E]?:
        E[P] extends (infer R)[] ? FindOptionsOrder<R> :
        E[P] extends Promise<infer R> ? FindOptionsOrder<R> :
        E[P] extends object ? FindOptionsOrder<E[P]> :
        FindOptionsOrderByValue;
};

/**
 * "where" in find options.

 export type FindOptionsWhereCondition<E> = {
    [P in keyof E]?:
    E[P] extends (infer R)[] ? FindOptionsWhere<R> | boolean | FindOperator<number> | FindAltOperator<number> :
        E[P] extends Promise<infer R> ? FindOptionsWhere<R> | boolean :
            E[P] extends Object ? FindOperator<E[P]> | FindAltOperator<E[P]> | FindOptionsWhere<E[P]> | boolean :
                FindOperator<E[P]> | FindAltOperator<E[P]> | E[P]
}; */

/**
 * "where" in find options.
 * Includes "array where" as well.

 export type FindOptionsWhere<E> = FindOptionsWhereCondition<E>|FindOptionsWhereCondition<E>[];
 */


// export function Column<
//     Source extends AnyDataSource,
//     Entity extends ValueOf<Source["options"]["entities"]>,
//     // Property extends string
//     >(
//     column: keyof Entity["columns"],
//     alias?: string
// ): FindOperatorColumn<Source, Entity> {
//     return {
//         kind: "FindOperatorColumn",
//         // entity: null as any,
//         value: column
//     }
// }
//
// export function Equal<
//     Source extends AnyDataSource,
//     Entity extends ValueOf<Source["options"]["entities"]>,
//     ColumnName extends keyof Entity["columns"]
//     >(
//     value: ColumnCompileType<Entity, ColumnName>
// ): FindOperatorColumn<Source, Entity> {
//     return {
//         kind: "FindOperatorColumn",
//         // entity: null as any,
//         value: column
//     }
// }


// -----------------------------------------------------------------
// common
// -----------------------------------------------------------------

export type ForceEmptyType<T> = T extends undefined ? {} : T
export type ValueOf<T> = T[keyof T];

// -----------------------------------------------------------------
// FindOperator
// -----------------------------------------------------------------

//
// export function Raw(expression: string) {
//     return {
//         kind: "Raw",
//         expression
//     }
// }
//
// export function Fn(name: string, args: (string | FindOperatorColumn<any>)[]) {
//     return {
//         kind: "Fn",
//         name,
//         args
//     }
// }
//
// export function Escaped(value: string) {
//     return {
//         kind: "Escaped",
//         value
//     }
// }
//
// export function Like<ColumnType>(value: ColumnType): FindExpression<ColumnType> {
//     return {
//         kind: "Like",
//         value
//     }
// }
//
// export function Equal<ColumnType>(value: ColumnType): FindExpression<ColumnType> {
//     return {
//         kind: "Equal",
//         value
//     }
// }

// -----------------------------------------------------------------
// FindExpression
// -----------------------------------------------------------------

export type FindExpression<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
> = {
    "@type": "FindExpression"
    kind: "not" | "or" | "and" | "xor"
    source: Source
    entity: Entity
    options: FindOptionsWhere<Source, Entity>[]
}

export type FindOperator<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>,
    ValueType
> = {
    "@type": "FindOperator"
    kind:
        | "any"
        | "between"
        | "equal"
        | "ilike"
        | "like"
        | "in"
        | "lessThan"
        | "lessThanOrEqual"
        | "moreThan"
        | "moreThanOrEqual"
        | "raw"
        | "and"
        | "or"
        | "not"
    source: Source
    entity: Entity
    valueType: ValueType
    value: any
}

// -----------------------------------------------------------------
// Functions
// -----------------------------------------------------------------

export function Or<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
>(...args: FindOptionsWhere<Source, Entity>[])
    : FindExpression<Source, Entity> {
    return {
        "@type": "FindExpression",
        kind: "or",
        source: null as any,
        entity: null as any,
        options: args
    }
}

export function And<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
>(...args: FindOptionsWhere<Source, Entity>[])
    : FindExpression<Source, Entity> {
    return {
        "@type": "FindExpression",
        kind: "and",
        source: null as any,
        entity: null as any,
        options: args
    }
}

export function Not<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
>(...args: FindOptionsWhere<Source, Entity>[])
    : FindExpression<Source, Entity> {
    return {
        "@type": "FindExpression",
        kind: "not",
        source: null as any,
        entity: null as any,
        options: args
    }
}

export function Xor<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
>(...args: FindOptionsWhere<Source, Entity>[])
    : FindExpression<Source, Entity> {
    return {
        "@type": "FindExpression",
        kind: "xor",
        source: null as any,
        entity: null as any,
        options: args
    }
}


// -----------------------------------------------------------------
// Functions
// -----------------------------------------------------------------

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type FindOptionsWhere<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
> =
    | FindExpression<Source, Entity>
    | FindOperatorWhereOptions<Source, Entity>

// export type EntityKeys<Entity extends AnyEntity> = keyof (Entity["columns"] & Entity["relations"] & Entity["embeds"])

export type FindOperatorWhereOptionsProperty<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    P extends keyof EntityProps<Entity>,
    Property extends EntityProps<Entity>[P]["property"],
> =
    // if property is a column, just return it's type inferred from a driver column types defined in the entity
    P extends keyof Entity["columns"] ?
        | ColumnCompileType<Entity, P>
        | FindOperator<Source, Entity, ColumnCompileType<Entity, P>>

    // if selected property is an embed, we just go recursively
    : P extends keyof Entity["embeds"] ?
        FindOptionsWhere<Source, Entity["embeds"][P]>

    // if selected property is relation
    : P extends keyof Entity["relations"] ?
        FindOptionsWhere<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]]>

    : never

export type FindOperatorWhereOptions<
    Source extends AnyDataSource,
    Entity extends AnyEntity, // ValueOf<Source["options"]["entities"]>
> = true extends false ? {} :
{
    [P in keyof EntityProps<Entity>]?:
        FindOperatorWhereOptionsProperty<Source, Entity, P, EntityProps<Entity>[P]["property"]>
}

// export type FindOperatorWhere<
//     Entity extends AnyEntity,
//     Columns extends string
// > = {
//     "@type": "FindOperator"
//     kind: "where"
//     options: FindOperatorWhereXXX<Entity, Columns> // FindOperatorWhereOptions<Source, Entity>
// }

// export type FindOperatorWhereXXX<
//     Entity extends AnyEntity,
//     Columns extends string
// > =
// {
//     [P in keyof Columns]?: ColumnCompileType<Entity, P>
// }

// export function Where<
//     Entity extends AnyEntity,
//     Columns extends string
// >(options: FindOperatorWhereXXX<Entity, Columns>): FindOperatorWhere<Entity, Columns> {
//     return {
//         "@type": "FindOperator",
//         kind: "where",
//         options // : [args]
//     }
// }
// export type FindOperatorOr<
//     Source extends AnyDataSource,
//     Entity extends ValueOf<Source["options"]["entities"]>
// > = {
//     "@type": "FindOperator"
//     kind: "or"
//     wheres: FindOperatorWhereXXX<Entity>[]
// }

// export function Or<
//     Source extends AnyDataSource,
//     Entity extends ValueOf<Source["options"]["entities"]>
// >(args: FindOperatorWhere<Entity, any>): FindOperatorOr<Source, Entity> {
//     return {
//         "@type": "FindOperator",
//         kind: "or",
//         wheres: [] // [args]
//     }
// }

// export type FindOperator<ColumnType> = {
//     kind: "Like" | "Equal"
//     value: ColumnType
// }

// export type FindOperator<ColumnType> = (value: ColumnType) => FindOperatorKind


// -----------------------------------------------------------------
// FindOptions
// -----------------------------------------------------------------

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type FindOptionsSelect<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = /*{ "*"?: boolean } &*/ {
    [P in keyof Entity["columns"]]?: boolean // P extends keyof Entity["columns"] ? boolean : never
} & {
    [P in keyof Entity["relations"]]?: boolean | FindOptionsSelect<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]]>
} & {
    [P in keyof Entity["embeds"]]?: FindOptionsSelect<Source, Entity["embeds"][P]>
}

export type EntityProps<
    Entity extends AnyEntity
> = {
    [P in keyof Entity["columns"]]: {
        type: "column",
        property: P
    }
} & {
    [P in keyof Entity["relations"]]: {
        type: "relation",
        property: P
    }
} & {
    [P in keyof Entity["embeds"]]: {
        type: "embed",
        property: P
    }
}

/**
 * todo: also need to consider transformers
 */
export type ColumnCompileType<
    Entity extends AnyEntity,
    Property extends keyof Entity["columns"]
> =
    Entity["columns"][Property]["nullable"] extends true ?
        Entity["driverTypes"]["columnTypes"][Entity["columns"][Property]["type"]]["type"] | null
    :
        Entity["driverTypes"]["columnTypes"][Entity["columns"][Property]["type"]]["type"]


export type FindReturnTypeProperty<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>,
    Selection extends FindOptionsSelect<Source, Entity>, // | undefined,
    P extends keyof EntityProps<Entity>,
    Property extends EntityProps<Entity>[P]["property"],
    ParentPartiallySelected extends boolean
> =
    // if property is a column, just return it's type inferred from a driver column types defined in the entity
    P extends keyof Entity["columns"] ?
        ColumnCompileType<Entity, P>

    // if selected property is an embed, we just go recursively
    : P extends keyof Entity["embeds"] ?
        FindReturnType<Source, Entity["embeds"][Property], Selection[Property], ParentPartiallySelected>

    // if selected property is relation
    : P extends keyof Entity["relations"] ?

        // relation selection can be defined two ways:
        // 1. we can select some properties of the related object
        Selection[Property] extends object ?
            Entity["relations"][Property]["type"] extends "many-to-many" | "one-to-many" ? // Entity["model"]["type"][P] extends Array<infer U> ?
                FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], false>[]
            :
                FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], false>

        // 2. we can select the whole related object (means its columns) by using relation: true
        : Selection[Property] extends true ?
            Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" ? // Entity["model"]["type"][P] extends Array<infer U> ?
                FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], {}, false>[]
            :
                FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], {}, false>
        : never
    : never

export type OnlyColumnKeys<
    Selection,
    Entity extends AnyEntity
> = {
    [P in keyof Selection]:
        Selection[P] extends true ?
            P extends keyof Entity["columns"] ? P : never
        : Selection[P] extends object ?
            P extends keyof Entity["embeds"] ?
                OnlyColumnKeys<Selection[P], Entity["embeds"][P]> extends never ? never : P
            : never
        : never
}[keyof Selection]

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionTruthyKeys<Selection> = {
    [P in keyof Selection]:
        Selection[P] extends true ? P
        : Selection[P] extends object ? P
        : never
}[keyof Selection]

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionAllColumns<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>,
    Selection extends FindOptionsSelect<Source, Entity>,
    > =  keyof (Entity["columns"] & {
    [P in keyof Entity["relations"] as
        Selection[P] extends true ? P
        : Selection[P] extends object ? P
        : never
    ]: true
}  & Entity["embeds"])


export type FindReturnType<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>,
    Selection extends FindOptionsSelect<Source, Entity>, // | undefined,
    ParentPartiallySelected extends boolean
> =
    // this case is possible in embed, when parent selected set of columns,
    // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
    ParentPartiallySelected extends true ?
    {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionTruthyKeys<Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, EntityProps<Entity>[P]["property"], true>
    }

    // if no columns were specified in selection, it means we need to select every column
    : OnlyColumnKeys<Selection, Entity> extends never ?
    {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionAllColumns<Source, Entity, Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, EntityProps<Entity>[P]["property"], false>
    }

    // otherwise it means only set of columns were selected, and we should only select them
    :
    {
        [P in keyof EntityProps<Entity> as P extends EntitySelectionTruthyKeys<Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, EntityProps<Entity>[P]["property"], true>
    }

export type DataSourceDatabaseType = "mysql" | "postgres" | "sqlite"
export type EntityMap = { [name: string]: AnyEntity }
export type AnyDataSourceOptions = DataSourceOptions<DataSourceDatabaseType, EntityMap>
export type DataSourceOptions<DatabaseType extends DataSourceDatabaseType, Entities extends EntityMap> = {
    type: DataSourceDatabaseType
    entities: Entities
}
export type AnyDataSource = DataSource<DataSourceOptions<DataSourceDatabaseType, EntityMap>>
export type DataSource<Options extends DataSourceOptions<DataSourceDatabaseType, EntityMap>> = {
    "@type": "DataSource"
    options: Options
    manager: Manager<DataSource<Options>>
}

export type Manager<Source extends AnyDataSource> = {
    "@type": "Manager"
    repository<EntityName extends keyof Source["options"]["entities"]>(entity: EntityName): Repository<Source, Source["options"]["entities"][EntityName]>
    repository<Entity extends ValueOf<Source["options"]["entities"]>>(entity: Entity): Repository<Source, Entity>
}

export type FindOptions<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
  select?: FindOptionsSelect<Source, Entity>
  where?: FindOptionsWhere<Source, Entity> // FindExpressionOr<Source, Entity>
  // order?: FindOptionsOrder<Entity>
}

export type Repository<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
    find<
        FindEntity extends Entity,
        Options extends FindOptions<Source, FindEntity>
    >(options: Options): FindReturnType<
        Source,
        FindEntity,
        ForceEmptyType<Options["select"]>,
        false
    >

    options<
        FindEntity extends Entity,
        Options extends FindOptions<Source, Entity>
    >(options: Options): Options
}

export const DataSource = {
    create<Options extends AnyDataSourceOptions>(options: Options): DataSource<Options> {
        return {
            "@type": "DataSource",
            options,
            manager: {
                "@type": "Manager",
                repository() {
                    return null as any
                }
            },
            // entity: () => {
            //     return undefined as any
            // }
        }
    }
}

export type AnyEntity = Entity<
    any,
    EntityColumns<AnyDriverTypes>,
    EntityRelations,
    EntityEmbeds<AnyDriverTypes>
>
export type Entity<
    GivenDriverTypes extends DriverTypes<any>,
    Columns extends EntityColumns<AnyDriverTypes>,
    Relations extends EntityRelations,
    Embeds extends EntityEmbeds<AnyDriverTypes>
> = {
    "@type": "Entity"
    driverTypes: GivenDriverTypes
    columns: Columns
    relations: Relations
    embeds: Embeds
}

export type AnyDriverTypes = DriverTypes<any>
export type DriverTypes<ColumnTypes extends DriverColumnTypes> = {
    columnTypes: ColumnTypes
}

export type DriverColumnTypes = {
    [databaseTypeName: string]: DriverColumnTypeOptions<any>
}

export type DriverColumnTypeOptions<Type> = {
    type: Type
}

export type PostgresTypes = DriverTypes<{
    int: { type: number },
    varchar: { type: string },
    boolean: { type: boolean },
}>

export type EntityColumns<DriverTypes extends AnyDriverTypes> = {
    [key: string]: {
        type: keyof DriverTypes["columnTypes"]
        nullable?: boolean
    }
}

export type EntityRelationTypes = "one-to-one" | "many-to-one" | "one-to-many" | "many-to-many"
export type EntityRelationItem = {
    type: "one-to-many"
    inverse: string
    reference: string
} | {
    type: "many-to-many"
    inverse?: string
    reference: string
} | {
    type: "one-to-one"
    inverse?: string
    reference: string
} | {
    type: "many-to-one"
    inverse?: string
    reference: string
 }

export type EntityRelations = {
    [key: string]: EntityRelationItem
}

export type EntityEmbeds<DriverTypes extends AnyDriverTypes> = {
    [key: string]: AnyEntity
}

export const Postgres = {
    entity<
        Columns extends EntityColumns<PostgresTypes> | undefined,
        Relations extends EntityRelations | undefined,
        Embeds extends EntityEmbeds<PostgresTypes> | undefined,
    >(options: {
        columns?: Columns
        relations?: Relations
        embeds?: Embeds
    }): Entity<
        PostgresTypes,
        ForceEmptyType<Columns>,
        ForceEmptyType<Relations>,
        ForceEmptyType<Embeds>
    > {
        return undefined as any
    }
}

export const AlbumEntity = Postgres.entity({
    columns: {
        id: {
            type: "int"
        },
        name: {
            type: "varchar"
        }
    },
    relations: {
        photos: {
            type: "one-to-many",
            inverse: "album",
            reference: "PhotoEntity" as const
        }
    },
})

export const PhotoEntity = Postgres.entity({
    columns: {
        id: {
            type: "int"
        },
        filename: {
            type: "varchar",
            nullable: true
        },
    },
    relations: {
        album: {
            type: "many-to-one",
            inverse: "photos",
            reference: "AlbumEntity" as const
        }
    },
})

export const ProfileEmbed = Postgres.entity({
    columns: {
        bio: {
            type: "varchar"
        },
        maritalStatus: {
            type: "varchar"
        },
        adult: {
            type: "boolean"
        },
        kids: {
            type: "int"
        },
    },
    relations: {
        educationPhotos: {
            type: "one-to-many",
            inverse: "",
            reference: "PhotoEntity" as const
        }
    }
})

export const UserEntity = Postgres.entity({
    columns: {
        id: {
            type: "int"
        },
        name: {
            type: "varchar"
        }
    },
    relations: {
        avatar: {
            type: "many-to-one",
            reference: "PhotoEntity" as const
        },
        photos: {
            type: "many-to-many",
            reference: "PhotoEntity" as const
        }
    },
    embeds: {
        profile: ProfileEmbed
    }
})

// -----------------------------------------------------------------
// usage example
// -----------------------------------------------------------------

const myDataSource = DataSource.create({
    type: "postgres",
    entities: {
        UserEntity,
        PhotoEntity,
        AlbumEntity
    }
})

const options = myDataSource
    .manager
    .repository("UserEntity")
    .options({
        where: Or({
            avatar: {
                id: Any(1, 2),
                album: {
                    photos: And({
                        filename: Any(null)
                    }, {filename: Any("1")})
                }
            },
            id: 1,
            name: "Dima",
            profile: Or({
                kids: Any(1),
                adult: Any(true),
                educationPhotos: {
                    id: Any(1),
                    filename: Any(null),
                    album: {
                        photos: And({
                            filename: Any(null)
                        }, {filename: Any("1")})
                    }
                }
            })
            // avatar: {
            //     id: Any(1),
            //     filename: "hmm"
            // }
            // name: "Dima"
        })/*, {
            // id: 2
        }*/
           /* Or(
               {
                   avatar: {
                       filename: "123",
                       album: {
                           id: Any(1, 2, 3)
                       }
                   },
                    profile: {
                        maritalStatus: "Married",
                        educationPhotos: {
                            filename: "asd"
                        }
                    }
                })*/
            // And(
            //     Or(
            //         Xor(
            //             Or({
            //                 name: "Umed",
            //             }),
            //             Not({
            //                 profile: {
            //                     maritalStatus: "Married"
            //                 }
            //             })
            //         )
            //     )
            // )

    })
console.log(options)

// const loadedUsers = myDataSource
//     .manager
//     .repository("UserEntity")
//     .find({
//         // select: {
//         //     id: true,
//         //     // name: true,
//         //     photos: {
//         //         id: true,
//         //         album: {
//         //             photos: true
//         //         }
//         //     },
//         //     profile: {
//         //         bio: true,
//         //         educationPhotos: {
//         //             id: true
//         //         }
//         //     }
//         // },
//         where2: where2({
//
//         }),
//         // where: or<typeof myDataSource, typeof UserEntity>({
//         //     id: 1, // "wwwjjjat",
//         //     name: "Dima",
//         //     // photos: ({ or, column, lessThan }) => or({
//         //     //     id: lessThan(2),
//         //     //     filename: column("filename"),
//         //     // }, {
//         //     //     filename: "Umed",
//         //     // }),
//         //     // photos: Or(Where({
//         //     //
//         //     // }))
//         //     // photos: {
//         //     //     id: Column("wow"), // Like(1)
//         //     //     filename: Column("id"),
//         //     // }
//         // })
//     })
// console.log(loadedUsers);
