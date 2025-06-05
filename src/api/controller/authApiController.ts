import type {NextFunction, Request, Response} from "express";
import lodash from "lodash";
import {AuthService} from "@/api/service/authService.js";
import {HttpCode} from "@/utils/httpCode.js";
import {api, logger} from "@/utils/logger.js";

export namespace AuthApiController {
    export const userLogin = async (req: Request, res: Response) => {
        const {username, password} = req.body;
        const data = await AuthService.login(username, password);
        res.status(data.code).json(data.response);
    };

    export const getTokenInfo = (_: Request, res: Response) => {
        const data = res.locals.JWTData as JwtData;
        res.status(HttpCode.OK).json({
            status: true,
            message: "",
            data: {
                username: data.username,
                tokenExpiresIn: data.exp - lodash.floor(Date.now() / 1000)
            }
        } as ApiResponse<object>);
    };

    export const flushToken = async (_: Request, res: Response) => {
        const data = res.locals.JWTData as JwtData;
        api.debug(`Flush token: ${data}`);
        res.status(HttpCode.OK).json({
            status: true,
            message: "JWT Token 刷新成功",
            data: AuthService.getAuthInfo(data)
        } as ApiResponse<AuthInfo>);
    };

    export const createAccount = async (req: Request, res: Response) => {
        const {username, password, email} = req.body;
        const data = await AuthService.register(username, password, email);
        res.status(data.code).json(data.response);
    };

    export const deleteAccount = async (req: Request, res: Response) => {

    };
}