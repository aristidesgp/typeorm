import { Observable } from "zen-observable-ts"
import { AnyDataSource } from "../data-source"
import { AnyEntity } from "../entity"

/**
 * Interface for manager that implement basic entity methods supported by all drivers.
 */
export interface ManagerSubscriberMethods<
  DataSource extends AnyDataSource,
  Entity extends AnyEntity
> {
  /**
   * Listens to a given event.
   */
  on<Event extends keyof DataSource["@types"]["subscriberTypes"]>(
    event: Event,
  ): Observable<DataSource["@types"]["subscriberTypes"][Event]>
}
