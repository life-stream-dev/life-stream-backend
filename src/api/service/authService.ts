import {EncryptUtils} from "@/utils/encryptUtils.js";
import {HttpCode} from "@/utils/httpCode.js";
import {Utils} from "@/utils/utils.js";
import {config} from "@/config/index.js";
import type {StringValue} from "ms";
import {User, UserModel} from "@/database/model/user.js";
import {ParamMismatchError} from "@/error/requestError.js";
import {api} from "@/utils/logger.js";
import jwt from "jsonwebtoken";
import {newServiceReturn} from "../utils/service.js";

export namespace AuthService {
    import encryptPassword = EncryptUtils.encryptPassword;
    import translateTime = Utils.translateTime;
    import generateKey = Utils.generateKey;
    import getUserByUsername = UserModel.getUserByUsername;
    import createUser = UserModel.createUser;

    export const generateJWTToken = (payload: object) => {
        return jwt.sign(payload, config.jwt.secretKey,
            {
                expiresIn: config.jwt.expiresIn as StringValue,
                algorithm: "HS256",
                issuer: "Life Stream Team",
                subject: "Life Stream Backend"
            });
    };

    export const getAuthInfo = (account: User | JwtData): AuthInfo => {
        return {
            userId: (account instanceof User ? account.id : account.userId)!!,
            username: account.username,
            tokenExpiresIn: translateTime(config.jwt.expiresIn),
            token: generateJWTToken({
                username: account.username
            }),
            refreshToken: generateJWTToken({
                username: account.username,
                type: "refresh"
            })
        };
    };

    export const login = async (username?: string, password?: string): Promise<ServiceReturn<AuthInfo>> => {
        if (username === undefined || password === undefined) {
            throw new ParamMismatchError("用户名或密码不能为空");
        }
        const data = await getUserByUsername(username);
        if (data === null) {
            throw new ParamMismatchError("指定用户名不存在或密码错误");
        }
        api.debug(`User(${username}) request login with password: ${password}, salt: ${data.salt}`);
        const passwordWithSalt = encryptPassword(password, data.salt);
        if (data.password === passwordWithSalt) {
            api.debug(`Password authentication successful`);
            return newServiceReturn(HttpCode.OK, true, "登陆成功", getAuthInfo(data))
        }
        api.debug(`Password authentication failed`);
        throw new ParamMismatchError("指定用户名不存在或密码错误");
    };

    export const register = async (username?: string, password?: string, email?: string): Promise<ServiceReturn<AuthInfo | null>> => {
        if (username === undefined || password === undefined) {
            throw new ParamMismatchError("用户名或密码不能为空");
        }
        if (email === undefined) {
            throw new ParamMismatchError("邮箱不能为空");
        }
        if ((await getUserByUsername(username)) !== null) {
            throw new ParamMismatchError("指定用户名已存在");
        }
        const salt = generateKey();
        const user = await createUser({
            salt,
            username,
            password: encryptPassword(password, salt),
            email
        })
        if (user.id !== undefined) {
            api.debug(`User(${user.id})<${user.username}> register successful`);
            return newServiceReturn(HttpCode.OK, true, "注册成功", getAuthInfo(user))
        }
        api.error(`User register failed: ${user.username}`);
        return newServiceReturn(HttpCode.InternalServerError, false, "注册失败", null)
    }
}