import { AnyEntity } from "./entity-core"

export type EntityPropsWithModel<
  Entity extends AnyEntity
> = EntityProps<Entity> &
  {
    [P in keyof Entity["model"]["type"]]: {
      type: "model"
      property: P
    }
  }

export type EntityProps<Entity extends AnyEntity> = {
  [P in keyof Entity["columns"]]: {
    type: "column"
    property: P
  }
} &
  {
    [P in keyof Entity["relations"]]: {
      type: "relation"
      property: P
    }
  } &
  {
    [P in keyof Entity["embeds"]]: {
      type: "embed"
      property: P
    }
  }
