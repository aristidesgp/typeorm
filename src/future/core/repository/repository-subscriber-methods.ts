import { Observable } from "zen-observable-ts"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Interface for repositories that implement basic entity methods supported by all drivers.
 */
export interface RepositorySubscriberMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Listens to a given event name.
   */
  on<Event extends keyof DataSource["@types"]["subscriberTypes"]>(
    event: Event,
  ): Observable<DataSource["@types"]["subscriberTypes"][Event]>
}
