import {Article, ArticleModel} from "@/database/model/article.js";
import {HttpCode} from "@/utils/httpCode.js";
import {ParamMismatchError} from "@/error/requestError.js";
import {newServiceReturn} from "@/api/utils/service.js";

export namespace BlogService {
    export const getArticles = async (authorId: number): Promise<ServiceReturn<Article[]>> => {
        return newServiceReturn(HttpCode.OK, true, "", await ArticleModel.getArticlesByAuthorId(authorId))
    }

    export const getArticle = async (articleId?: number): Promise<ServiceReturn<Article | null>> => {
        if (articleId === undefined) {
            throw new ParamMismatchError("文章ID不能为空");
        }
        const article = await ArticleModel.getArticleById(articleId)
        if (article === null) {
            return newServiceReturn(HttpCode.NotFound, false, "未找到指定文章", null)
        }
        return newServiceReturn(HttpCode.OK, true, "", article)
    }

    export const createArticle = async (authorId?: number, title?: string, content?: string): Promise<ServiceReturn<number>> => {
        if (authorId === undefined) {
            throw new ParamMismatchError("文章作者不可为空");
        }
        if (title === undefined || title === "") {
            throw new ParamMismatchError("文章标题不可为空");
        }
        if (content === undefined || content === "") {
            throw new ParamMismatchError("文章内容不可为空");
        }
        const article = await ArticleModel.addArticle({authorId, title, content})
        if (article.id === undefined) {
            return newServiceReturn(HttpCode.InternalServerError, false, "文章插入失败", 0)
        }
        return newServiceReturn(HttpCode.OK, true, "", article.id)
    }

    export const deleteArticle = async (authorId: number, articleId?: number): Promise<ServiceReturn<boolean>> => {
        if (articleId === undefined) {
            throw new ParamMismatchError("文章ID不可为空");
        }
        const article = await ArticleModel.getArticleById(articleId)
        if (article === null) {
            return newServiceReturn(HttpCode.NotFound, false, "文章不存在", false)
        }
        if (article.authorId !== authorId) {
            return newServiceReturn(HttpCode.Forbidden, true, "你只能删除自己的文章", false)
        }
        const effectRow = await ArticleModel.deleteArticle(articleId, authorId)
        if (effectRow === 0) {
            return newServiceReturn(HttpCode.InternalServerError, true, "删除失败", false)
        }
        return newServiceReturn(HttpCode.OK, true, "删除成功", true)
    }

    export const updateArticle = async (articleId?: number, authorId?: number, title?: string, content?: string): Promise<ServiceReturn<boolean>> => {
        if (articleId === undefined) {
            throw new ParamMismatchError("文章ID不可为空");
        }
        if (authorId === undefined) {
            throw new ParamMismatchError("文章作者不可为空");
        }
        let mode = 0;
        if (title !== undefined && title !== "") {
            mode += 1;
        }
        if (content !== undefined && content !== "") {
            mode += 2;
        }
        let effectRow: [affectedCount: number];
        switch (mode) {
            case 0:
                throw new ParamMismatchError("未指定修改内容");
            case 1:
                effectRow = await ArticleModel.updateArticleTitle({articleId, authorId, title: title!!, content: ""})
                break;
            case 2:
                effectRow = await ArticleModel.updateArticleContent({
                    articleId,
                    authorId,
                    title: "",
                    content: content!!
                })
                break;
            case 3:
                effectRow = await ArticleModel.updateArticle({articleId, authorId, title: title!!, content: content!!})
                break;
            default:
                throw new ParamMismatchError("未指定修改内容");
        }
        return newServiceReturn(HttpCode.OK, true, "更新信息成功", effectRow[0] === 1)
    }
}