import {
    Entity,
    EntityColumns,
    EntityEmbeds,
    EntityRelations,
    ForceEmptyType,
} from "../core";
import { PostgresTypes } from "./driver";

export function entity<
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
