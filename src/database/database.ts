import {Sequelize} from '@sequelize/core';
import {MySqlDialect} from '@sequelize/mysql';
import {config} from "@/config/index.js";
import {dbLogger} from "@/utils/logger.js";
import {ServerLifeCycle, ServerLifeCycleEvent} from "@/utils/lifeCycle.js";
import process from "node:process";
import {User} from "@/database/model/user.js";
import {Article} from "@/database/model/article.js";
import {Device} from "@/database/model/devices.js";

export namespace Database {
    export const database = new Sequelize({
        dialect: MySqlDialect,
        ...config.database.config,
        waitForConnections: true,
        multipleStatements: false,
        queueLimit: 0,
        logging: (sql: string) => {
            dbLogger.debug(sql);
        },
        models: [User, Article, Device]
    });

    export function initDatabase() {
        database.authenticate().then(() => {
            dbLogger.info("Connect to database successfully.");
            database.sync().then(() => {
                dbLogger.info("Database Synced successfully.");
                ServerLifeCycle.emitEvent(ServerLifeCycleEvent.ServerDatabaseInit)
            }).catch((err) => {
                dbLogger.error("Database Synced error while initializing database.");
                dbLogger.error(err);
                process.exit(-1);
            })
        }).catch((err) => {
            dbLogger.error(`Database connect error!`);
            dbLogger.error(err.message);
            process.exit(-1);
        });
    }
}
