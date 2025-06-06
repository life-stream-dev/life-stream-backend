import {connectionLogger, logger} from "@/utils/logger.js";
import express from "express";
import type {Request, Response} from "express";
import process from "node:process";
import cors from 'cors';
import session from "express-session";
import fs from "fs";
import https from "https";
import http from "http";
import {initCatcher} from "@/utils/catcher.js";
import {FileUtils} from "@/utils/fileUtils.js";
import {ServerLifeCycle, ServerLifeCycleEvent} from "@/utils/lifeCycle.js";
import {config} from "@/config/index.js";
import {CommonMiddleWare} from "@/api/middleware/commonMiddleWare.js";
import {Database} from "@/database/database.js";
import checkFileExist = FileUtils.checkFileExist;
import initDatabase = Database.initDatabase;
import {authApiRouter} from "@/api/router/authApi.js";
import {blogApiRouter} from "@/api/router/blogApi.js";
import {deviceApiRouter} from "@/api/router/deviceApi.js";

initCatcher();
initDatabase();

const app = express();

app.set('trust proxy', true);
app.use(connectionLogger);

app.use(CommonMiddleWare.enableHSTS);
app.use(CommonMiddleWare.accessRecord);

// @ts-ignore
app.use(express.urlencoded());
// @ts-ignore
app.use(express.json());

app.use(cors());

app.use(session({
    secret: config.cookie.key,
    cookie: {
        secure: false,
        signed: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    },
    resave: true,
    saveUninitialized: true
}));

app.use("/api/auth", authApiRouter);
app.use("/api/blog", blogApiRouter);
app.use("/api/device", deviceApiRouter);

app.use((_: Request, res: Response) => {
    logger.info(`Not router match, redirect to home page ${config.homePage}`);
    res.redirect(config.homePage);
});

app.use(CommonMiddleWare.errorHandler);

const port = config.port;

if (config.https.enable) {
    if (!checkFileExist(config.https.keyPath)) {
        logger.error("Can not find certificate key.");
        process.exit(-1);
    }
    if (!checkFileExist(config.https.crtPath)) {
        logger.error("Can not find certificate crt.");
        process.exit(-1);
    }
    https.createServer({
        key: fs.readFileSync(config.https.keyPath),
        cert: fs.readFileSync(config.https.crtPath)
    }, app).listen(port);
    logger.info(`Server running at https://0.0.0.0${port === 443 ? "" : ":" + port}/`);
} else {
    if (config.https.enableHSTS) {
        logger.error(`If you want to enable HSTS, please enable HTTPS first`);
        process.exit(-1)
    }
    http.createServer(app).listen(port);
    logger.info(`Server running at http://0.0.0.0${port === 80 ? "" : ":" + port}/`);
}

ServerLifeCycle.emitEvent(ServerLifeCycleEvent.ServerStarted);