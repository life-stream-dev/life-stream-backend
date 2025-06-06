import {Tracker} from "@/api/utils/tracker.js";
import {config} from "@/config/index.js";
import type {NextFunction, Request, Response} from "express";
import {api} from "@/utils/logger.js";
import {HttpCode} from "@/utils/httpCode.js";

export namespace DeviceMiddleWare {
    const tracker = new Tracker(config.callLimit.count, config.callLimit.time);

    export const checkCallLimit = (req: Request, res: Response, next: NextFunction) => {
        api.info(`New access from ${req.ip} is processing by deviceApiController`);
        if (!tracker.trackIP(req.ip!)) {
            api.warn(`Access Denial: Api call limit`);
            res.status(HttpCode.TooManyRequests).json({status: false, msg: "超出API访问限制"});
            return;
        }
        next();
    };
}