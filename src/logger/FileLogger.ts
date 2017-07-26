import {LoggerOptions} from "./LoggerOptions";
import {QueryRunner} from "../query-runner/QueryRunner";
import {Logger} from "./Logger";
import {writeFileSync} from "fs";

/**
 * Performs logging of the events in TypeORM.
 */
export class FileLogger implements Logger {

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private options?: LoggerOptions) {
    }

    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------

    /**
     * Logs query and parameters used in it.
     */
    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (this.options === "all" || this.options === true || (this.options instanceof Array && this.options.indexOf("query") !== -1)) {
            const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
            this.write("executing query" + ": " + sql);
        }
    }

    /**
     * Logs query that is failed.
     */
    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        if (this.options === "all" || this.options === true || (this.options instanceof Array && this.options.indexOf("error") !== -1)) {
            const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
            this.write([
                `query failed: ` + sql,
                `error:`, error
            ]);
        }
    }

    /**
     * Logs query that is slow.
     */
    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
        const sql = query + (parameters && parameters.length ? " -- PARAMETERS: " + this.stringifyParams(parameters) : "");
        this.write([
            `query is slow: ` + sql,
            `execution time: ` + time
        ]);
    }

    /**
     * Logs events from the schema build process.
     */
    logSchemaBuild(message: string, queryRunner?: QueryRunner) {
        if (this.options === "all" || (this.options instanceof Array && this.options.indexOf("schema") !== -1)) {
            this.write(message);
        }
    }

    /**
     * Perform logging using given logger, or by default to the console.
     * Log has its own level and message.
     */
    log(level: "log"|"info"|"warn"|"error", message: any, queryRunner?: QueryRunner) {
        switch (level) {
            case "log":
                if (this.options === "all" || (this.options instanceof Array && this.options.indexOf("log") !== -1))
                    this.write(message);
                break;
            case "info":
                if (this.options === "all" || (this.options instanceof Array && this.options.indexOf("info") !== -1))
                    this.write(message);
                break;
            case "warn":
                if (this.options === "all" || (this.options instanceof Array && this.options.indexOf("warn") !== -1))
                    this.write(message);
                break;
        }
    }

    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------

    /**
     * Writes given strings into the log file.
     */
    protected write(strings: string|string[]) {
        strings = strings instanceof Array ? strings : [strings];
        writeFileSync("ormlogs.log", strings.join("\r\n")); // todo: make async
    }

    /**
     * Converts parameters to a string.
     * Sometimes parameters can have circular objects and therefor we are handle this case too.
     */
    protected stringifyParams(parameters: any[]) {
        try {
            return JSON.stringify(parameters);

        } catch (error) { // most probably circular objects in parameters
            return parameters;
        }
    }

}