import type {Request, Response} from "express";
import {BlogService} from "@/api/service/blogService.js";

export namespace BlogApiController {
    export const getArticles = async (req: Request, res: Response) => {
        const authInfo = res.locals.JWTData as JwtData;
        const data = await BlogService.getArticles(authInfo.userId);
        res.status(data.code).json(data.response);
    }

    export const getArticle = async (req: Request, res: Response) => {
        const ruleId = Number(req.params.id);
        const data = await BlogService.getArticle(ruleId);
        res.status(data.code).json(data.response);
    }

    export const createArticle = async (req: Request, res: Response) => {
        const authInfo = res.locals.JWTData as JwtData;
        const {title, content} = req.body;
        const data = await BlogService.createArticle(authInfo.userId, title, content);
        res.status(data.code).json(data.response);
    }

    export const deleteArticle = async (req: Request, res: Response) => {
        const articleId = Number(req.params.id);
        const authInfo = res.locals.JWTData as JwtData;
        const data = await BlogService.deleteArticle(authInfo.userId, articleId);
        res.status(data.code).json(data.response);
    }

    export const updateArticle = async (req: Request, res: Response) => {
        const articleId = Number(req.params.id);
        const authInfo = res.locals.JWTData as JwtData;
        const {title, content} = req.body;
        const data = await BlogService.updateArticle(articleId, authInfo.userId, title, content);
        res.status(data.code).json(data.response);
    }
}