import express from "express";
import {DeviceMiddleWare} from "@/api/middleware/deviceMiddleWare.js";
import {AuthMiddleware} from "@/api/middleware/authMiddleWare.js";
import {DeviceApiController} from "@/api/controller/deviceApiController.js";

export const deviceApiRouter = express.Router();

deviceApiRouter.use(DeviceMiddleWare.checkCallLimit)
deviceApiRouter.use(AuthMiddleware.requestLogin);

deviceApiRouter.get("/list", DeviceApiController.listDevices);
deviceApiRouter.post("/rename/:deviceId", DeviceApiController.renameDevices);
deviceApiRouter.put("/update/:deviceId", DeviceApiController.updateDevice);