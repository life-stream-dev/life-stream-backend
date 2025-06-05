import type {CreationOptional, InferAttributes, InferCreationAttributes} from '@sequelize/core';
import {DataTypes, Model} from '@sequelize/core';
import {
    Attribute,
    AutoIncrement,
    CreatedAt,
    DeletedAt,
    NotNull,
    PrimaryKey,
    Table,
    Unique,
    UpdatedAt
} from "@sequelize/core/decorators-legacy";
import {config} from "@/config/index.js";

@Table({tableName: `${config.database.prefix}_users`})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @Unique
    @NotNull
    declare id?: CreationOptional<number>;

    @Attribute(DataTypes.STRING(32))
    @PrimaryKey
    @NotNull
    declare username: string;

    @Attribute(DataTypes.STRING(64))
    @NotNull
    declare password: string;

    @Attribute(DataTypes.STRING(32))
    @NotNull
    declare salt: string;

    @Attribute(DataTypes.STRING(64))
    @NotNull
    declare email: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    @CreatedAt
    declare registerTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    @UpdatedAt
    declare lastLoginTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @DeletedAt
    declare deleted?: Date;
}

export namespace UserModel {
    export function createUser(user: CreateUser) {
        return User.create({
            username: user.username,
            password: user.password,
            salt: user.salt,
            email: user.email
        })
    }

    export function getUserByUsername(username: string) {
        return User.findOne({
            where: {
                username: username
            }
        })
    }
}