/**
 * If given T type is exactly a Desired one, returns just this T type.
 * Otherwise returns "any". Used to for force typing.
 */
import { AnyModel, model } from "./model";

// export type ForcedType<T, Desired> = T extends Desired ? T : any

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionTruthyKeysXXX<Selection, Relations = { }> = {
    [P in keyof Selection]: Selection[P] extends false ? never : P
} & {
    [P in keyof Relations]: Relations[P] extends false ? never : P
}

/**
 * Helper type to mark non-selected properties as "never".
 */
export type EntitySelectionTruthyKeys<Selection, Relations = { }> =
    EntitySelectionTruthyKeysXXX<Selection, Relations>[keyof (Selection & Relations)]

/**
 * Helper type to pick non-never properties of the selection.
 */
/*export type EntitySelectionPick<Entity extends AnyEntity, Selection> = Pick<
    Entity["model"]["type"],
    {
        [P in keyof Entity["model"]["type"]]:
        P extends EntitySelectionTruthyKeys<Selection> ?
            P extends keyof Entity["columns"] ? P
            : P extends keyof Entity["relations"] ? P
        : never : never
    }[keyof Entity["model"]["type"]]
    >*/

export type EntitySelectionPickColumns<Entity extends AnyEntity, Selection> = Pick<
    Entity["model"]["type"],
    {
        [P in keyof Entity["model"]["type"]]:
            P extends EntitySelectionTruthyKeys<Selection> ?
                P extends keyof Entity["columns"] ? P
            : never : never
    }[keyof Entity["model"]["type"]]
    >

export type EntitySelectionPickRelations<Entity extends AnyEntity, Selection> = Pick<
    Entity["model"]["type"],
    {
        [P in keyof Entity["model"]["type"]]:
        P extends EntitySelectionTruthyKeys<Selection> ?
            P extends keyof Entity["relations"] ? P
        : never : never
    }[keyof Entity["model"]["type"]]
    >

/**
 * Schema for a EntitySelection, used to specify what properties of a Entity must be selected.
 */
export type EntitySelectionSchema<
    Entities extends EntityMap,
    Entity extends AnyEntity
> = {
    [P in keyof Entity["columns"]]?: P extends keyof Entity["columns"] ? boolean : never
} & {
    [P in keyof Entity["relations"]]?:
        Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
            EntitySelectionSchema<Entities, Entities[Entity["relations"][P]["reference"]]>
        : never
} & {
    [P in keyof Entity["embeds"]]?: EntitySelectionSchema<Entities, Entity["embeds"][P]>
} /*{
    [P in keyof (Entity["columns"] & Entity["relations"] & Entity["embeds"])]?:
        P extends keyof Entity["columns"] ? boolean
        : P extends keyof Entity["relations"] ?
            Entity["relations"][P] extends EntityRelationItem<Entity["model"], P> ?
                EntitySelectionSchema<Entities, Entities[Entity["relations"][P]["reference"]]>
            : never
        : P extends keyof Entity["embeds"] ?
            Entity["embeds"][P] extends AnyEntity ?
                EntitySelectionSchema<Entities, Entity["embeds"][P]>
            : never
        : never
}*/
//
// & (Entity["embeds"] extends EntityEmbeds<AnyDriverTypes, AnyEntity["model"]> ? {
//     [P in keyof Entity["embeds"]]?:
//         Entity["embeds"][P] extends AnyEntity ?
//             EntitySelectionSchema<Entities, Entity["embeds"][P]> // todo
//         : never
// } : {})

export type EntityRelationSchema<
    Entities extends EntityMap,
    Entity extends AnyEntity
> = {
    [P in keyof Entity["relations"]]?:
        Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
            EntityRelationSchema<Entities, Entities[Entity["relations"][P]["reference"]]> | boolean
        : never
} & {
    [P in keyof Entity["embeds"]]?:
    // Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> ?
    EntityRelationSchema<Entities, Entity["embeds"][P]> | boolean
    // : never
}

/*export type FindReturnTypeRelations<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    Selection extends EntitySelectionSchema<Source["options"]["entities"], Entity> | undefined,
    Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> | undefined,
    > =
(Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> ? ({
    [P in keyof EntitySelectionPickRelations<Entity, Relations>]:
    Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
        Entity["model"]["type"][P] extends Array<infer U> ?
            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>[]
            : Entity["model"]["type"][P] extends object ?
            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>
            : never
        : Entity["model"]["type"][P]
}) : Relations extends true ? ({
    [P in keyof EntitySelectionPickRelations<Entity, Relations>]:
    Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
        Entity["model"]["type"][P] extends Array<infer U> ?
            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>[]
            : Entity["model"]["type"][P] extends object ?
            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>
            : never
        : Entity["model"]["type"][P]
}): {  })*/

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

type UserEntitySelection = FindReturnType<typeof myDataSource, typeof UserEntity, {}, {}>

export type FindReturnTypeItem<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    Selection extends EntitySelectionSchema<Source["options"]["entities"], Entity>, // | undefined,
    Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>, // | undefined,
    P extends keyof Props<Entity>,
    Property extends Props<Entity>[P]["property"]
> = P extends keyof Entity["columns"] ?
    Entity["model"]["type"][P]
    : P extends keyof Entity["embeds"] ?
        Selection[Property] extends object ?
            Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>
                ? FindReturnType<Source, Entity["embeds"][Property], Selection[Property], Relations[Property]>
                : FindReturnType<Source, Entity["embeds"][Property], Selection[Property], Relations[Property]>
            :
            Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>
                ? FindReturnType<Source, Entity["embeds"][Property], {}, Relations[Property]>
                : FindReturnType<Source, Entity["embeds"][Property], {}, {}>
        : P extends keyof Entity["relations"] ?
            // (Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> ?
            Relations[Property] extends object ?
                Entity["relations"][Property]["type"] extends "many-to-many" | "one-to-many" ? // Entity["model"]["type"][P] extends Array<infer U> ?
                    Selection[Property] extends object ?
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], Relations[Property]>[]
                        :
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], {}, Relations[Property]>[]
                    :
                    FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], Relations[Property]>
                : Relations[Property] extends true ?
                Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" ? // Entity["model"]["type"][P] extends Array<infer U> ?
                    Selection[Property] extends object ?
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], {}>[]
                        :
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], {}, {}>[]
                    :
                    FindReturnType<Source, Source["options"]["entities"][Entity["relations"][Property]["reference"]], Selection[Property], {}>
                : never
            // : Entity["model"]["type"][P]
            /* : Relations extends true ? ({
                [P in keyof EntitySelectionPickRelations<Entity, Relations>]:
                Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
                    Entity["model"]["type"][P] extends Array<infer U> ?
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>[]
                        : Entity["model"]["type"][P] extends object ?
                        FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>
                        : never
                    : Entity["model"]["type"][P]
            })*///: never)

            : never

export type FindReturnType<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    Selection extends EntitySelectionSchema<Source["options"]["entities"], Entity>, // | undefined,
    Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> // | undefined,
> = keyof Selection extends never ? {
    [P in keyof Props<Entity>]:
    FindReturnTypeItem<Source, Entity, Selection, Relations, P, Props<Entity>[P]["property"]>
} : {
    [P in keyof Props<Entity> as P extends EntitySelectionTruthyKeys<Selection, Relations> ? P : never]:
        FindReturnTypeItem<Source, Entity, Selection, Relations, P, Props<Entity>[P]["property"]>
}
    /*& {
        [P in keyof Entity["embeds"] as P extends EntitySelectionTruthyKeys<Selection, Relations> ? P : never]:
            Selection[P] extends object ?
                Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>
                    ? FindReturnType<Source, Entity["embeds"][P], Selection[P], Relations[P]>
                    : FindReturnType<Source, Entity["embeds"][P], Selection[P], undefined>
            :
                Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>
                    ? FindReturnType<Source, Entity["embeds"][P], {}, Relations[P]>
                    : FindReturnType<Source, Entity["embeds"][P], { }, undefined>
    }*/
    /*: {
        [P in keyof Props<Entity>]:
            P extends keyof Entity["columns"] ?
                Entity["model"]["type"][P]
            : P extends keyof Entity["embeds"] ?
                Relations extends EntityRelationSchema<Source["options"]["entities"], Entity>
                    ? FindReturnType<Source, Entity["embeds"][P], {}, Relations[Props<Entity>[P]["property"]]>
                    : FindReturnType<Source, Entity["embeds"][P], {}, undefined>
            : P extends keyof Entity["relations"] ?
                    (Relations extends EntityRelationSchema<Source["options"]["entities"], Entity> ?
                        Entity["relations"][P]["type"] extends "many-to-many" | "one-to-many" ? // Entity["model"]["type"][P] extends Array<infer U> ?
                            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[Props<Entity>[P]["property"]], Relations[Props<Entity>[P]["property"]]>[]
                            :
                            FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[Props<Entity>[P]["property"]], Relations[Props<Entity>[P]["property"]]>
                        // : Entity["model"]["type"][P]
                        /!* : Relations extends true ? ({
                            [P in keyof EntitySelectionPickRelations<Entity, Relations>]:
                            Entity["relations"][P] extends EntityRelationItem<Entity["model"]> ?
                                Entity["model"]["type"][P] extends Array<infer U> ?
                                    FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>[]
                                    : Entity["model"]["type"][P] extends object ?
                                    FindReturnType<Source, Source["options"]["entities"][Entity["relations"][P]["reference"]], Selection[P], Relations[P]>
                                    : never
                                : Entity["model"]["type"][P]
                        })*!/: never)

                    : never
    }*/

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
    Entity extends AnyEntity
> = {
  select?: EntitySelectionSchema<Source["options"]["entities"], Entity>
  relations?: EntityRelationSchema<Source["options"]["entities"], Entity>
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
    Entity extends AnyEntity
> = {
    find<Options extends FindOptions<Source, Entity>>(options: Options): FindReturnType<
        Source,
        Entity,
        ForceEmptyType<Options["select"]>,
        ForceEmptyType<Options["relations"]
    >>
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

export type AnyEntity<Model extends AnyModel = AnyModel> = Entity<
    Model,
    EntityColumns<AnyDriverTypes, Model>,
    EntityRelations<Model>,
    EntityEmbeds<AnyDriverTypes, Model>
>
export type Entity<
    Model extends AnyModel,
    Columns extends EntityColumns<AnyDriverTypes, Model>,
    Relations extends EntityRelations<Model>,
    Embeds extends EntityEmbeds<AnyDriverTypes, Model>
> = {
    model: Model
    columns: Columns
    relations: Relations
    embeds: Embeds
}

export type AnyDriverTypes = DriverTypes<any>
export type DriverTypes<
    ColumnTypes extends string
> = {
    columnTypes: ColumnTypes
}

export type PostgresColumnTypes =
    "int" | "varchar" | "boolean"

export type PostgresTypes = DriverTypes<
    PostgresColumnTypes
>

export type AnyEntityColumns = EntityColumns<AnyDriverTypes, AnyModel>
export type EntityColumns<
    DriverTypes extends AnyDriverTypes,
    Model extends AnyModel
> = {
    // [P in keyof Model["type"]]?: {
    [key: string]: {
        type: DriverTypes["columnTypes"]
    }
}

export type EntityRelationTypes = "one-to-one" | "many-to-one" | "one-to-many" | "many-to-many"
export type AnyEntityRelations = EntityRelations<AnyModel>
export type EntityRelationItem<
    Model extends AnyModel,
    // Relation extends keyof Model["type"]
> = {
    type: "one-to-many" | "many-to-many" | "one-to-one" | "many-to-one"
    inverse?: string
    reference: string
} /*Model["type"][Relation] extends Array<infer U> ?
    *//*{
        type: "one-to-many"
        inverse: keyof Model["type"][Relation][0] // U doesn't work here, looks like a TypeScript bug
        reference: string
    } | {
        type: "many-to-many"
        inverse?: keyof Model["type"][Relation][0] // U doesn't work here, looks like a TypeScript bug
        reference: string
    } | // : Model["type"][Relation] extends object ?
{
        type: "one-to-one"
        inverse?: keyof Model["type"][Relation]
        reference: string
    } | {
        type: "many-to-one"
        inverse?: keyof Model["type"][Relation]
        reference: string
     } *///: never

export type EntityRelations<Model extends AnyModel> = {
    [key: string]:  EntityRelationItem<Model>
    // [P in keyof Model["type"]]?: EntityRelationItem<Model, P>
}

export type AnyEntityEmbeds = EntityEmbeds<AnyDriverTypes, AnyModel>
export type EntityEmbeds<DriverTypes extends AnyDriverTypes, TModel extends AnyModel> = {
    [key: string]: AnyEntity
    // [P in keyof TModel["type"]]?:
    //     TModel["type"][P] extends Array<infer U> ?
    //         Entity<
    //             Model<TModel["type"][P][0]>,
    //             EntityColumns<DriverTypes, Model<TModel["type"][P][0]>>,
    //             EntityRelations<Model<TModel["type"][P][0]>>,
    //             EntityEmbeds<DriverTypes, Model<TModel["type"][P][0]>>
    //         >
    //         // {
    //         //     columns: EntityColumns<DriverTypes, Model["type"][P][0]>
    //         // }
    //     : TModel["type"][P] extends object ?             Entity<
    //             Model<TModel["type"][P]>,
    //             EntityColumns<DriverTypes, Model<TModel["type"][P]>>,
    //             EntityRelations<Model<TModel["type"][P]>>,
    //             EntityEmbeds<DriverTypes, Model<TModel["type"][P]>>
    //             >
    //         : never
}

// export type AnyEntityOptions<Source extends AnyDataSource> = EntityOptions<Source, _, _>
// export type EntityOptions<
//     Columns extends EntityColumns,
//     Relations extends EntityRelations
//     > = {
//
// }


export const Postgres = {
    entity<
        Model extends AnyModel,
        Columns extends EntityColumns<PostgresTypes, Model>,
        Relations extends EntityRelations<Model>,
        Embeds extends EntityEmbeds<PostgresTypes, Model>,
    >(options: {
        model: Model
        columns: Columns
        relations: Relations
        embeds: Embeds
    }): Entity<Model, Columns, Relations, Embeds> {
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
            reference: "PhotoEntity" as const
        }
    },
    embeds: {},
})

export const PhotoEntity = Postgres.entity({
    model: model<Photo>(),
    columns: {
        id: {
            type: "int"
        },
        filename: {
            type: "varchar"
        }
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
    model: model<User>(),
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

const loadedUserx = myDataSource
    .manager
    .repository("UserEntity")
    .find({
        select: {
            id: true,
            name: true,
            photos: {
                id: true,
                filename: true,
                album: {
                    id: true
                }
            },
            profile: {
                bio: true,
                educationPhotos: {
                    id: true,
                    album: {
                        name: true
                    }
                }
            }
        },
        relations: {
            photos: {
                album: true
            },
            profile: {
                educationPhotos: {
                    album: true
                }
            }
        }
        // relations: {
        //     photos: {
        //         album: {
        //             photos: {
        //                 album: true
        //             }
        //         }
        //     },
        //     avatar: {
        //         album: {
        //             photos: {
        //                 album: true
        //             }
        //         }
        //     }
        // }
    })
console.log(loadedUserx);
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
