import { AnyDataSource } from "../data-source";
import { AnyEntity } from "../entity";
import { FindOperator } from "./find-options-where";

export function Any<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(...values: ValueType[]): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "any",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: values
    };
}

export function Between<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(
    first: ValueType,
    second: ValueType
): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "between",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: [first, second]
    };
}

export function Equal<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "equal",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function Like<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: string): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "like",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function ILike<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: string): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "ilike",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function In<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(...values: ValueType[]): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "in",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: values
    };
}

export function LessThan<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "lessThan",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function LessThanOrEqual<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "lessThanOrEqual",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function MoreThan<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "moreThan",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function MoreThanOrEqual<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: ValueType): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "moreThanOrEqual",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function Raw<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: string): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "raw",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function Escaped<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(value: string): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "escaped",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: value
    };
}

export function Column<
    Source extends AnyDataSource,
    Entity extends AnyEntity,
    ValueType
>(
    name: keyof Entity["columns"]
    // alias?: string
): FindOperator<Source, Entity, ValueType> {
    return {
        "@type": "FindOperator",
        kind: "column",
        source: null as any,
        entity: null as any,
        valueType: null as any,
        value: name
    };
}
