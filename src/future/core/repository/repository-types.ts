import { AnyDataSource } from "../data-source";
import { FindOptions, FindReturnType } from "../find-options";
import { ForceEmptyType, ValueOf } from "../util";

export type Repository<
    Source extends AnyDataSource,
    Entity extends ValueOf<Source["options"]["entities"]>
> = {
    find<
        FindEntity extends Entity,
        Options extends FindOptions<Source, FindEntity>
    >(
        options: Options
    ): FindReturnType<
        Source,
        FindEntity,
        ForceEmptyType<Options["select"]>,
        false
    >;

    options<
        FindEntity extends Entity,
        Options extends FindOptions<Source, Entity>
    >(
        options: Options
    ): Options;
};
