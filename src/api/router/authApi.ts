import express from "express";
import {AuthMiddleware} from "@/api/middleware/authMiddleWare.js";
import {AuthApiController} from "@/api/controller/authApiController.js";

export const authApiRouter = express.Router();

authApiRouter.use(AuthMiddleware.checkCallLimit);

authApiRouter.get("/users", AuthApiController.getAllUser);
authApiRouter.post("/login", AuthApiController.userLogin);
authApiRouter.post("/register", AuthApiController.createAccount);

authApiRouter.use(AuthMiddleware.requestLogin);

authApiRouter.get("/token/info", AuthApiController.getTokenInfo);
authApiRouter.get("/token/flush", AuthApiController.flushToken);

authApiRouter.delete("/account/:username", AuthApiController.deleteAccount);
