/**
 * Represents a single connection to a database.
 */
export interface DatabaseConnection {

    /**
     * Native driver's connection object.
     */
    connection: any;

    /**
     * Connection's transaction instance.
     */
    transaction?: any;

    /**
     * Special function that holds a connection release logic.
     * Releases connection when its called.
     * After releasing connection cannot be used anymore.
     */
    releaseCallback?: () => Promise<void>;

}