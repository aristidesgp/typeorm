import { AnyEntity } from "./entity-core"

export type EntityPropsWithModel<
  Entity extends AnyEntity
> = EntityProps<Entity> &
  {
    [P in keyof Entity["model"]["type"]]: {
      type: "model"
      property: P
    }
  } &
  {
    [P in keyof Entity["virtualMethods"]]: {
      type: "virtualMethods"
      property: P
    }
  } &
  {
    [P in keyof Entity["virtualLazyProperties"]]: {
      type: "virtualLazyProperties"
      property: P
    }
  } &
  {
    [P in keyof Entity["virtualEagerProperties"]]: {
      type: "virtualEagerProperties"
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
