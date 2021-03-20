/**
 * If given T type is exactly a Desired one, returns just this T type.
 * Otherwise returns "any". Used to for force typing.
 */
import { AnyModel, model } from "./model";

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type EntitySelectionSchema<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = /*{ "*"?: boolean } &*/ {
    [P in keyof Entity["columns"]]?: P extends keyof Entity["columns"] ? boolean : never
} & {
    [P in keyof Entity["relations"]]?: boolean | EntitySelectionSchema<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]]>
} & {
    [P in keyof Entity["embeds"]]?: EntitySelectionSchema<Source, Entity["embeds"][P]>
}

export type Props<
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

export type FindReturnTypeProperty<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>,
    Selection extends EntitySelectionSchema<Source, Entity>, // | undefined,
    P extends keyof Props<Entity>,
    Property extends Props<Entity>[P]["property"],
    ParentPartiallySelected extends boolean
> =
    // if property is a column, just return it's type in the model
    // if model isn't defined, we infer type from a driver column types defined in the entity
    P extends keyof Entity["columns"] ?
        Entity["model"] extends object ?
            Entity["model"]["type"][P]
        :
            Entity["driverTypes"]["columnTypes"][Entity["columns"][P]["type"]]["type"]  // todo: also need to consider transformers

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
    Selection extends EntitySelectionSchema<Source, Entity>,
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
    Selection extends EntitySelectionSchema<Source, Entity>, // | undefined,
    ParentPartiallySelected extends boolean
> =
    // this case is possible in embed, when parent selected set of columns,
    // we need to tell to child (embed) to select only what was selected, to prevent selection of every column
    ParentPartiallySelected extends true ?
    {
        [P in keyof Props<Entity> as P extends EntitySelectionTruthyKeys<Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, Props<Entity>[P]["property"], true>
    }

    // if no columns were specified in selection, it means we need to select every column
    : OnlyColumnKeys<Selection, Entity> extends never ?
    {
        [P in keyof Props<Entity> as P extends EntitySelectionAllColumns<Source, Entity, Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, Props<Entity>[P]["property"], false>
    }

    // otherwise it means only set of columns were selected, and we should only select them
    :
    {
        [P in keyof Props<Entity> as P extends EntitySelectionTruthyKeys<Selection> ? P : never]:
            FindReturnTypeProperty<Source, Entity, Selection, P, Props<Entity>[P]["property"], true>
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

export type ValueOf<T> = T[keyof T];

export type Manager<Source extends AnyDataSource> = {
    "@type": "Manager"
    repository<EntityName extends keyof Source["options"]["entities"]>(entity: EntityName): Repository<Source, Source["options"]["entities"][EntityName]>
    repository<Entity extends ValueOf<Source["options"]["entities"]>>(entity: Entity): Repository<Source, Entity>
}

export type FindOptions<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
  select?: EntitySelectionSchema<Source, Entity>
  // relations?: EntityRelationSchema<Source["options"]["entities"], Entity>
  // relations?: FindOptionsRelation<Entity>
  // where?: FindOptionsWhere<Entity>
  // order?: FindOptionsOrder<Entity>
}

// export type DataSourceEntityName<Source extends AnyDataSource> = keyof Source["options"]["entities"]
// export type DataSourceEntity<Source extends AnyDataSource, EntityName extends DataSourceEntityName<Source>> =
//     Source["options"]["entities"][EntityName] extends Function ? Source["options"]["entities"][EntityName]["prototype"] : Source["options"]["entities"][EntityName]

export type ForceEmptyType<T> = T extends undefined ? {} : T

// export type FindOptionsReturnType<Options extends FindOptions<any, any>> =
//     FindReturnType<Source, Entity, ForceEmptyType<Options["select"]>, ForceEmptyType<Options["relations"]>>

export type Repository<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
    // x(a: keyof Entity["columns"]): keyof Entity["columns"]
    // x<T extends keyof Entity["columns"]>(a: T): T
    find<SomeEntity extends Entity, Options extends FindOptions<Source, SomeEntity>>(options: Options): FindReturnType<
        Source,
        SomeEntity,
        ForceEmptyType<Options["select"]>,
        false
    >
        // FindReturnType<DataSourceEntity<Source, EntityName>, Options>
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
    AnyModel | undefined,
    EntityColumns<AnyDriverTypes, AnyModel>,
    EntityRelations<AnyModel>,
    EntityEmbeds<AnyDriverTypes, AnyModel>
>
export type Entity<
    GivenDriverTypes extends DriverTypes<any>,
    Model extends AnyModel | undefined,
    Columns extends EntityColumns<AnyDriverTypes, Model>,
    Relations extends EntityRelations<Model>,
    Embeds extends EntityEmbeds<AnyDriverTypes, Model>
> = {
    driverTypes: GivenDriverTypes
    model: Model
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

// export type PostgresColumnTypes =
//     "int" | "varchar" | "boolean"

export type PostgresTypes = DriverTypes<{
    int: { type: number },
    varchar: { type: string },
    boolean: { type: boolean },
}>

export type AnyEntityColumns = EntityColumns<AnyDriverTypes, AnyModel>
export type EntityColumns<
    DriverTypes extends AnyDriverTypes,
    Model extends AnyModel | undefined
> = {
    // [P in keyof Model["type"]]?: {
    [key: string]: {
        type: keyof DriverTypes["columnTypes"]
    }
}

export type EntityRelationTypes = "one-to-one" | "many-to-one" | "one-to-many" | "many-to-many"
export type AnyEntityRelations = EntityRelations<AnyModel>
export type EntityRelationItem<
    Model extends AnyModel | undefined,
    Reference extends string
> = {
    type: "one-to-many"
    inverse: string
    reference: Reference
} | {
    type: "many-to-many"
    inverse?: string
    reference: Reference
} | {
    type: "one-to-one"
    inverse?: string
    reference: Reference
} | {
    type: "many-to-one"
    inverse?: string
    reference: Reference
 }

export type EntityRelations<Model extends AnyModel | undefined> = {
    [key: string]: EntityRelationItem<Model, string>
}

export type AnyEntityEmbeds = EntityEmbeds<AnyDriverTypes, AnyModel>
export type EntityEmbeds<DriverTypes extends AnyDriverTypes, Model extends AnyModel | undefined> = {
    [key: string]: AnyEntity
}

export const Postgres = {
    entity<
        Model extends AnyModel | undefined,
        Columns extends EntityColumns<PostgresTypes, Model>,
        Relations extends EntityRelations<Model>,
        Embeds extends EntityEmbeds<PostgresTypes, Model>,
    >(options: {
        model?: Model
        columns: Columns
        relations: Relations
        embeds: Embeds
    }): Entity<PostgresTypes, Model, Columns, Relations, Embeds> {
        return undefined as any
    }
}

export type Photo = {
    id: number
    filename: string
    album: Album
}

export type Album = {
    id: number
    name: string
    photos: Photo[]
}

export class User {
    id: number
    name: string
    age: number
    online: boolean
    avatar: Photo
    photos: Photo[]
    profile: Profile
}

export class Profile {
    bio: string
    maritalStatus: string
    adult: boolean
    kids: number
    educationPhotos: Photo[]
}

// const UserEntity: UserEntityType = undefined as any
// todo: there wasn't error when this wasn't connected in data source
export const AlbumEntity = Postgres.entity({
    model: model<Album>(),
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
            reference: "PhotoEntity"
        }
    },
    embeds: {},
    // uniques: [{
    //     name: "UQ_1234",
    //     columns: {
    //         id: true
    //         name: true
    //     },
    // }]
})

export const PhotoEntity = Postgres.entity({
    model: model<Photo>(),
    columns: {
        id: {
            type: "int"
        },
        filename: {
            type: "varchar"
        },
    },
    relations: {
        album: {
            type: "many-to-one",
            inverse: "photos",
            reference: "AlbumEntity" as const
        }
    },
    embeds: {},
})

export const ProfileEntity = Postgres.entity({
    model: model<Profile>(),
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
    embeds: {},
    relations: {
        educationPhotos: {
            type: "one-to-many",
            inverse: "",
            reference: "PhotoEntity" as const
        }
    }
})

export const UserEntity = Postgres.entity({
    // model: model<User>(),
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
        profile: ProfileEntity
    }
})

const myDataSource = DataSource.create({
    type: "postgres",
    entities: {
        UserEntity,
        PhotoEntity,
        AlbumEntity
    }
})

// const a = User
// type keys = keyof typeof a.prototype

// const a = { age: 1, name: "Umed", id: 2 }
// const selection = { age: true, name: true }
// type A = keyof typeof a
// type B = keyof typeof selection
// // type Checker<T1, T2> = { [P in T1 as T1[P]]: true }
// type C = B extends A ? true : false

const loadedUsers = myDataSource
    .manager
    .repository("UserEntity")
    .find({
        select: {
            id: true,
            // name: true,
            photos: {
                id: true,
                album: {
                    photos: true
                }
            },
            profile: {
                bio: true,
                educationPhotos: {
                    id: true
                }
            }
        }
    })
console.log(loadedUsers);
//
// const loadedUserx = myDataSource
//     .manager
//     .repository("UserEntity")
//     .find({
//         select: {
//             id: true,
//             name: true,
//             // photos: {
//             //     id: true,
//             //     filename: true,
//             //     // album: {
//             //     //     id: true
//             //     // }
//             // },
//             profile: {
//                 bio: true,
//                 // educationPhotos: {
//                 //     id: true,
//                 //     // album: {
//                 //     //     name: true
//                 //     // }
//                 // }
//             }
//         },
//         // relations: {
//         //     photos: true,
//         //     // profile: {
//         //     //     educationPhotos: true
//         //     // }
//         // }
//         // relations: {
//         //     photos: {
//         //         album: {
//         //             photos: {
//         //                 album: true
//         //             }
//         //         }
//         //     },
//         //     avatar: {
//         //         album: {
//         //             photos: {
//         //                 album: true
//         //             }
//         //         }
//         //     }
//         // }
//     })
// console.log(loadedUserx);
//
// const selection: EntityRelationSchema<
//     typeof myDataSource["options"]["entities"],
//     typeof UserEntity
//     > = {
//     photos: {
//         album: {
//             photos: {
//                 album: {
//                     photos: {
//                         album: {
//                             photos: {
//                                 album: {
//                                     photos: true
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
// console.log(selection);

// console.log(loadedUser.photos[0].id)

/**
 * Value of order by in find options.
 */
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
 * Filters and lefts only object-type properties from the object.
 * Used in relations find options.
 */
export type FindOptionsRelationKeyName<E> = {
    [K in keyof E]:
    E[K] extends object ? K :
        E[K] extends object|null ? K :
            E[K] extends object|undefined ? K :
                never
}[keyof E];

/**
 * Flattens array type in the object.
 * Used in relations find options.
 */
export type FindOptionsRelationKey<E> = {
    [P in keyof E]?:
    E[P] extends (infer R)[] ? FindOptionsRelation<R> | boolean :
        E[P] extends Promise<infer R> ? FindOptionsRelation<R> | boolean :
            FindOptionsRelation<E[P]> | boolean;
};

/**
 * Relations find options.
 */
export type FindOptionsRelation<E> = FindOptionsRelationKeyName<E>[]|FindOptionsRelationKey<Pick<E, FindOptionsRelationKeyName<E>>>;

export type KeyOf<T> = T extends Function ? keyof T["prototype"] : keyof T

/**
 * Select find options.
 */
export type FindOptionsSelect<E> =
    KeyOf<E>[]|{
    [P in KeyOf<E>]?:
    E[P] extends (infer R)[] ? FindOptionsSelect<R> | boolean :
        E[P] extends Promise<infer R> ? FindOptionsSelect<R> | boolean :
            E[P] extends object ? FindOptionsSelect<E[P]> | boolean :
                boolean;
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
