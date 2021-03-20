export type ForceEmptyType<T> = T extends undefined ? {} : T

export type ValueOf<T> = T[keyof T];

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

export type FindReturnTypeProperty<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>,
    Selection extends EntitySelectionSchema<Source, Entity>, // | undefined,
    P extends keyof EntityProps<Entity>,
    Property extends EntityProps<Entity>[P]["property"],
    ParentPartiallySelected extends boolean
> =
    // if property is a column, just return it's type inferred from a driver column types defined in the entity
    P extends keyof Entity["columns"] ?
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
  select?: EntitySelectionSchema<Source, Entity>
  // relations?: EntityRelationSchema<Source["options"]["entities"], Entity>
  // relations?: FindOptionsRelation<Entity>
  // where?: FindOptionsWhere<Entity>
  // order?: FindOptionsOrder<Entity>
}

// export type DataSourceEntityName<Source extends AnyDataSource> = keyof Source["options"]["entities"]
// export type DataSourceEntity<Source extends AnyDataSource, EntityName extends DataSourceEntityName<Source>> =
//     Source["options"]["entities"][EntityName] extends Function ? Source["options"]["entities"][EntityName]["prototype"] : Source["options"]["entities"][EntityName]


export type Repository<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
    find<SomeEntity extends Entity, Options extends FindOptions<Source, SomeEntity>>(options: Options): FindReturnType<
        Source,
        SomeEntity,
        ForceEmptyType<Options["select"]>,
        false
    >
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

const myDataSource = DataSource.create({
    type: "postgres",
    entities: {
        UserEntity,
        PhotoEntity,
        AlbumEntity
    }
})

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
