import process from "node:process";
import {logger} from "@/utils/logger.js";

export const initCatcher = () => {
    logger.debug("Init GEC(Global Exception Catcher)...");

    process.on('uncaughtException', (err: Error) => {
        logger.error("UncaughtException: " + err.message);
        logger.error(err.stack);
    });

    process.on('unhandledRejection', (err: Error) => {
        logger.error("UnhandledRejection: " + err.message);
        logger.error(err.stack);
    });

    logger.debug("GEC init finish");
};
