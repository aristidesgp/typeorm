import { AnyEntity } from "./entity-core"

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
