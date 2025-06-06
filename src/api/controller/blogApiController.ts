import type {Request, Response} from "express";
import {BlogService} from "@/api/service/blogService.js";
import {api} from "@/utils/logger.js";

export namespace BlogApiController {
    export const getArticles = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const data = await BlogService.getArticles();
        res.status(data.code).json(data.response);
    }

    export const getArticle = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const articleId = Number(req.params.id);
        const data = await BlogService.getArticle(articleId);
        res.status(data.code).json(data.response);
    }

    export const createArticle = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const authInfo = res.locals.JWTData as JwtData;
        const {title, content} = req.body;
        const data = await BlogService.createArticle(authInfo.userId, title, content);
        res.status(data.code).json(data.response);
    }

    export const deleteArticle = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const articleId = Number(req.params.id);
        const authInfo = res.locals.JWTData as JwtData;
        const data = await BlogService.deleteArticle(authInfo.userId, articleId);
        res.status(data.code).json(data.response);
    }

    export const updateArticle = async (req: Request, res: Response) => {
        api.debug(`${req.path} matched`)
        const articleId = Number(req.params.id);
        const authInfo = res.locals.JWTData as JwtData;
        const {title, content} = req.body;
        const data = await BlogService.updateArticle(articleId, authInfo.userId, title, content);
        res.status(data.code).json(data.response);
    }
}