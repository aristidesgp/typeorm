import {
    AnyDataSource,
    AnyEntity,
    FindExpression,
    FindOptionsWhere
} from "../../repository/TypeRepository";

export function Or<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
>(...args: FindOptionsWhere<Source, Entity>[]): FindExpression<Source, Entity> {
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
    Entity extends AnyEntity,
>(...args: FindOptionsWhere<Source, Entity>[]): FindExpression<Source, Entity> {
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
    Entity extends AnyEntity,
>(...args: FindOptionsWhere<Source, Entity>[]): FindExpression<Source, Entity> {
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
    Entity extends AnyEntity,
>(...args: FindOptionsWhere<Source, Entity>[]): FindExpression<Source, Entity> {
    return {
        "@type": "FindExpression",
        kind: "xor",
        source: null as any,
        entity: null as any,
        options: args
    }
}

// todo: export function Where
