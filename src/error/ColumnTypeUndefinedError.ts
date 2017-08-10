export class ColumnTypeUndefinedError extends Error {
    name = "ColumnTypeUndefinedError";

    constructor(object: Object, propertyName: string) {
        super();
        this.message = `Column type for ${(<any>object.constructor).name}#${propertyName} is not defined or cannot be guessed. ` +
            `Try to explicitly provide a column type to the @Column decorator.`;
    }

}