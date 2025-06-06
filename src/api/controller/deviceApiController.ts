import type {Request, Response} from "express";
import {DeviceService} from "@/api/service/deviceService.js";

export namespace DeviceApiController {
    export const listDevices = async (req: Request, res: Response) => {
        const data = await DeviceService.listDevices()
        res.status(data.code).json(data.response)
    }

    export const renameDevices = async (req: Request, res: Response) => {
        const {name} = req.body;
        const deviceId = req.params.deviceId;
        const data = await DeviceService.renameDevice(deviceId, name)
        res.status(data.code).json(data.response)
    }

    export const updateDevice = async (req: Request, res: Response) => {
        const {status} = req.body;
        const deviceId = req.params.deviceId;
        const data = await DeviceService.updateDevice(deviceId, status)
        res.status(data.code).json(data.response)
    }
}