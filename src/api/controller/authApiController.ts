import type {Request, Response} from "express";
import lodash from "lodash";
import {AuthService} from "@/api/service/authService.js";
import {HttpCode} from "@/utils/httpCode.js";
import {api} from "@/utils/logger.js";
import {newApiResponse} from "@/api/utils/service.js";

export namespace AuthApiController {
    export const getAllUser = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const data = await AuthService.getAllUser()
        res.status(data.code).json(data.response);
    }

    export const userLogin = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const {username, password} = req.body;
        const data = await AuthService.login(username, password);
        res.status(data.code).json(data.response);
    };

    export const getTokenInfo = (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const data = res.locals.JWTData as JwtData;
        res.status(HttpCode.OK).json(newApiResponse(true, "", {
            username: data.username,
            tokenExpiresIn: data.exp - lodash.floor(Date.now() / 1000)
        }));
    };

    export const flushToken = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const data = res.locals.JWTData as JwtData;
        api.debug(`Flush token: ${data}`);
        res.status(HttpCode.OK).json(newApiResponse(true, "JWT Token 刷新成功", AuthService.getAuthInfo(data)));
    };

    export const createAccount = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const {username, password, email} = req.body;
        const data = await AuthService.register(username, password, email);
        res.status(data.code).json(data.response);
    };

    export const deleteAccount = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
    };
}