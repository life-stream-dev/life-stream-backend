import type {NextFunction, Request, Response} from "express";
import {logger} from "@/utils/logger.js";
import {config} from "@/config/index.js";
import {HttpCode} from "@/utils/httpCode.js";
import {RequestError} from "@/error/requestError.js";

export namespace CommonMiddleWare {
    export const enableHSTS = (_: Request, res: Response, next: NextFunction) => {
        if (config.https.enable && config.https.enableHSTS) {
            res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }
        next();
    };

    export const accessRecord = (req: Request, _: Response, next: NextFunction) => {
        logger.info(`[${req.protocol}] Client request (${req.method})${req.path} from ${req.ip}`);
        next();
    };

    export const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
        logger.error(`Error handler request: ${err.message}`);
        if (err instanceof RequestError) {
            res.status(err.statusCode).json({
                status: false,
                message: err.message,
                data: null
            } as ApiResponse<null>);
            return
        }
        res.status(HttpCode.InternalServerError).json({
            status: false,
            message: "Internal Server Error",
            data: null
        } as ApiResponse<null>);
    };
}