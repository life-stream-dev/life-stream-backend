import {readFileSync, writeFileSync} from "fs";
import {join} from "path";
import * as path from "node:path";
import {FileUtils} from "@/utils/fileUtils.js";
import checkFileExist = FileUtils.checkFileExist;
import {logger} from "@/utils/logger.js";
import checkDirExist = FileUtils.checkDirExist;

export abstract class BaseConfig<T> {
    private _configPath: string = join(path.dirname("."), "config")
    protected abstract _defaultConfig: T;
    protected abstract _configFileName: string;
    protected _config?: T;

    protected constructor() {
        if (!checkDirExist(this._configPath, true)) {
            logger.error("Config dir not exist, creating config folder");
        }
    }

    public loadConfig() {
        const configFilePath = join(this._configPath, this._configFileName)
        if (!checkFileExist(configFilePath)) {
            logger.error(`Config file not found, creating config file.`);
            this._config = this._defaultConfig
            writeFileSync(configFilePath, JSON.stringify(this._defaultConfig, null, 4));
            return
        }
        const configData = readFileSync(configFilePath, 'utf8');
        this._config = JSON.parse(configData);
        return;
    }
}

export class MainConfig extends BaseConfig<Config> {
    protected _configFileName: string;
    protected _defaultConfig: Config;
    private static instance: MainConfig;

    private constructor() {
        super();
        this._configFileName = "config.json";
        this._defaultConfig = {
            "version": "1.0.0",
            "database": {
                "config": {
                    "host": "127.0.0.1",
                    "port": 3306,
                    "user": "root",
                    "password": "123456",
                    "database": "life",
                    "connectTimeout": 500,
                    "connectionLimit": 20
                },
                "updateTime": 5,
                "prefix": "backend"
            },
            "https": {
                "enable": false,
                "enableHSTS": false,
                "keyPath": "certificate/certificate.key",
                "crtPath": "certificate/certificate.crt"
            },
            "cookie": {
                "key": "123456",
                "timeout": 1200000
            },
            "callLimit": {
                "count": 100,
                "time": 1000
            },
            "jwt": {
                "secretKey": "123456",
                "expiresIn": "1h",
                "refreshTokenExpiresIn": "1d"
            },
            "homePage": "https://www.baidu.com",
            "port": 80
        };
    }

    public static getInstance(): MainConfig {
        if (!MainConfig.instance) {
            MainConfig.instance = new MainConfig();
        }
        return MainConfig.instance;
    }

    get config() {
        return this._config as Config
    }
}