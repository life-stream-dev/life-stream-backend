import type {NextFunction, Request, Response} from "express";
import {Utils} from "@/utils/utils.js";
import {HttpCode} from "@/utils/httpCode.js";
import {AuthService} from "@/api/service/authService.js";
import {api} from "@/utils/logger.js";
import {config} from "@/config/index.js";
import {Tracker} from "@/api/utils/tracker.js";
import jwt from "jsonwebtoken";

export namespace AuthMiddleware {
    import translateTime = Utils.translateTime;
    import generateJWTToken = AuthService.generateJWTToken;
    const tracker = new Tracker(config.callLimit.count, config.callLimit.time);

    export const checkCallLimit = (req: Request, res: Response, next: NextFunction) => {
        api.info(`New access from ${req.ip} is processing by authApiController`);
        if (!tracker.trackIP(req.ip!)) {
            api.warn(`Access Denial: Api call limit`);
            res.status(HttpCode.TooManyRequests).json({status: false, msg: "超出API访问限制"});
            return;
        }
        next();
    };

    export const requestLogin = (req: Request, res: Response, next: NextFunction) => {
        if (!req.headers.authorization) {
            res.status(403).json({
                status: false,
                message: "No jwt token found",
                data: null
            } as ApiResponse<null>);
            return
        }
        const token = req.headers.authorization.split(" ")[1];
        api.debug(`Verify JWT token ${token}`);
        jwt.verify(token, config.jwt.secretKey, (err, decoded) => {
            if (err || decoded === undefined || typeof decoded === "string") {
                if (err instanceof jwt.TokenExpiredError) {
                    res.status(401).json({
                        status: false,
                        message: "JWT token expired",
                        data: null
                    } as ApiResponse<null>);
                    return
                }
                res.status(403).json({
                    status: false,
                    message: "Invalid JWT token",
                    data: null
                } as ApiResponse<null>);
                return
            }
            const data = decoded as JwtData;
            if (data.type !== undefined && data.type === "refresh") {
                api.debug(`Refresh JWT token ${JSON.stringify(data)}`);
                res.status(200).json({
                    status: true,
                    message: "JWT Token 刷新成功",
                    data: {
                        userId: data.userId,
                        username: data.username,
                        tokenExpiresIn: translateTime(config.jwt.expiresIn),
                        token: generateJWTToken({
                            username: data.username
                        }),
                        refreshToken: generateJWTToken({
                            username: data.username,
                            type: "refresh"
                        })
                    }
                } as ApiResponse<AuthInfo>);
                return;
            }
            api.debug(`JWT token authentication succeeded: ${JSON.stringify(data)}`);
            res.locals.JWTData = data;
            next();
        });
    };

    export const requestAdmin = (_: Request, res: Response, next: NextFunction) => {
        const data = res.locals.JWTData as JwtData;
        if (data.permission < 1) {
            res.status(403).json({
                status: false,
                message: "Your permissions are not sufficient to view this entry",
                data: null
            } as ApiResponse<null>);
            return;
        }
        next();
    };

    export const requestSuperAdmin = (_: Request, res: Response, next: NextFunction) => {
        const data = res.locals.JWTData as JwtData;
        if (data.permission < 2) {
            res.status(403).json({
                status: false,
                message: "Your permissions are not sufficient to view this entry",
                data: null
            } as ApiResponse<null>);
            return;
        }
        next();
    }
}