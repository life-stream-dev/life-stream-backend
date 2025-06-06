import express from "express";
import {BlogMiddleWare} from "@/api/middleware/blogMiddleWare.js";
import {AuthMiddleware} from "@/api/middleware/authMiddleWare.js";
import {BlogApiController} from "@/api/controller/blogApiController.js";

export const blogApiRouter = express.Router();

blogApiRouter.use(BlogMiddleWare.checkCallLimit)

blogApiRouter.get("/articles", BlogApiController.getArticles)
blogApiRouter.get("/articles/:id", BlogApiController.getArticle)

blogApiRouter.use(AuthMiddleware.requestLogin)

blogApiRouter.post("/articles", BlogApiController.createArticle)
blogApiRouter.put("/articles/:id", BlogApiController.updateArticle)
blogApiRouter.delete("/articles/:id", BlogApiController.deleteArticle)
