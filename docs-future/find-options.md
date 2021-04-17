# Find

-   Find Methods
-   Where Options
-   Select Options
    -   dasdasd
    -   dasdasd

## Find Methods

In order to load data from the database use `manager.find*` methods:

-   `find` - loads many entities by a given where options
-   `findBy` - loads many entities by a given find options
-   `findOne` - load a single entity by a given where options
-   `findOneBy` - load a single entity by a given find options

```typescript
const users = await manager.find(UserEntity, {
    id: 12,
});
```

## Where Options

`WhereOptions` allows to specify what entity rows `find*` methods must return.

-   Where options loads rows wich equals to specific parameters. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    where: { id: 1 },
});
```

Returns:

```json
[
    {
        "id": 1,
        "name": "Timber",
        "age": 25,
        "stats": {
            "strength": 10,
            "agility": 2,
            "intelligence": 5
        }
    }
]
```

## Select Options

`SelectOptions` allows to specify what entity columns and relations `find*` methods must return.

-   Empty select options loads all columns defined in the entity. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {},
});
```

Returns:

```json
[
    {
        "id": 1,
        "name": "Timber",
        "age": 25,
        "stats": {
            "strength": 10,
            "agility": 2,
            "intelligence": 5
        }
    }
]
```

-   Select options with specific columns loads columns from select. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        id: true,
        name: true,
        age: true,
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "name": "Timber",
        "age": 25
    }
]
```

-   Select options with specific columns and the wole relation loads columns from select and the whole relation. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        id: true,
        avatar: true,
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "avatar": {
            "id": 1,
            "filename": "photo"
        }
    }
]
```

-   Select options with specific columns and specific relation columns loads columns from select and relation columns from select. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        id: true,
        avatar: {
            filename: true,
        },
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "avatar": {
            "filename": "photo"
        }
    }
]
```

-   Select options without any colums with the wole relation loads all columns defined and the whole relation. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        avatar: true,
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "name": "Timber",
        "age": 25,
        "stats": {
            "strength": 10,
            "agility": 2,
            "intelligence": 5
        },
        "avatar": {
            "id": 1,
            "filename": "photo"
        }
    }
]
```

-   Select options without any colums with relation specific columns loads all columns defined and relation columns from select. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        avatar: {
            filename: true,
        },
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "name": "Timber",
        "age": 25,
        "stats": {
            "strength": 10,
            "agility": 2,
            "intelligence": 5
        },
        "avatar": {
            "filename": "photo"
        }
    }
]
```

-   Select options with specific columns and specific уьиув columns loads columns from select and уьиув columns from select. For example:

```typescript
const users = await manager.findBy(UserEntity, {
    select: {
        id: true,
        profile: {
            id: true,
        },
    },
});
```

Returns:

```json
[
    {
        "id": 1,
        "profile": {
            "id": 12
        }
    }
]
```
