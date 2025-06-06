import {grpcClient} from "@/api/grpc/grpcClient.js";
import {DeviceModel} from "@/database/model/devices.js";
import {newServiceReturn} from "@/api/utils/service.js";
import {HttpCode} from "@/utils/httpCode.js";
import {ParamMismatchError} from "@/error/requestError.js";

export namespace DeviceService {
    export const listDevices = async (): Promise<ServiceReturn<DeviceInfo[]>> => {
        const data = await new Promise((resolve, reject) => {
            grpcClient.GetAllDevices({}, (err: any, data: any) => {
                if (err) reject(err); else resolve(data)
            })
        }) as { devices: { DevicesId: string }[] }
        const devices = new Map<string, string>()
        const stored = await DeviceModel.getAllDevices()
        for (const device of data.devices) {
            devices.set(device.DevicesId, "")
        }
        for (const device of stored) {
            devices.set(device.deviceId, device.deviceName)
        }
        const devicesList: DeviceInfo[] = []
        for (const [k, v] of devices.entries()) {
            devicesList.push({
                deviceId: k,
                deviceName: v
            })
        }
        return newServiceReturn(HttpCode.OK, true, "", devicesList)
    }

    export const renameDevice = async (deviceId?: string, name?: string): Promise<ServiceReturn<boolean>> => {
        if (deviceId === undefined || deviceId === null) {
            throw new ParamMismatchError("设备ID不能为空");
        }
        if (name === undefined || name === "") {
            throw new ParamMismatchError("名字不能为空");
        }
        const effectRow = await DeviceModel.renameDevices(deviceId, name)
        if (effectRow[0] === 0) {
            await DeviceModel.createDevice(deviceId, name)
            return newServiceReturn(HttpCode.OK, true, "关联创建成功", true)
        }
        return newServiceReturn(HttpCode.OK, true, "重命名成功", true)
    }

    export const updateDevice = async (deviceId?: string, status?: boolean): Promise<ServiceReturn<boolean>> => {
        if (deviceId === undefined || deviceId === null) {
            throw new ParamMismatchError("设备ID不能为空");
        }
        if (status === undefined || status === null) {
            throw new ParamMismatchError("状态不能为空");
        }
        const data = await new Promise((resolve, reject) => {
            grpcClient.SetDevicesState({DevicesId: deviceId, status}, (err: any, data: any) => {
                if (err) reject(err); else resolve(data)
            })
        }) as { status: boolean }
        if (data.status) {
            return newServiceReturn(HttpCode.OK, true, "操作成功", true)
        }
        return newServiceReturn(HttpCode.InternalServerError, false, "操作失败", false)
    }
}