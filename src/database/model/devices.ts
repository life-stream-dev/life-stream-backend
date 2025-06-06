import {
    Attribute,
    AutoIncrement,
    CreatedAt, DeletedAt,
    NotNull,
    PrimaryKey,
    Table, UpdatedAt
} from "@sequelize/core/decorators-legacy";
import {config} from "@/config/index.js";
import {
    type CreationOptional,
    DataTypes,
    type InferAttributes,
    type InferCreationAttributes,
    Model
} from "@sequelize/core";

@Table({tableName: `${config.database.prefix}_devices`})
export class Device extends Model<InferAttributes<Device>, InferCreationAttributes<Device>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare id?: CreationOptional<number>;

    @Attribute(DataTypes.STRING(64))
    @NotNull
    declare deviceId: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare deviceName: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    @CreatedAt
    declare createTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    @UpdatedAt
    declare editTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @DeletedAt
    declare deleted?: Date;
}

export namespace DeviceModel {
    export const getAllDevices = async () => {
        return Device.findAll()
    }

    export const renameDevices = async (deviceId: string, deviceName: string) => {
        return Device.update({
            deviceName
        }, {
            where: {
                deviceId
            }
        })
    }

    export const createDevice = async (deviceId: string, deviceName: string) => {
        return Device.create({
            deviceId,
            deviceName
        })
    }

    export const getDeviceByName = (deviceName: string) => {
        return Device.findOne({
            where: {
                deviceName
            }
        })
    }
}