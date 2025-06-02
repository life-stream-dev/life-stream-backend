type DatabaseConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectTimeout: number;
    connectionLimit: number;
}

type Database = {
    config: DatabaseConfig;
    updateTime: number;
    prefix: string;
}

type HttpsConfig = {
    enable: boolean;
    enableHSTS: boolean;
    keyPath: string;
    crtPath: string;
}

type CookieConfig = {
    key: string;
    timeout: number;
}

type CallLimitConfig = {
    count: number;
    time: number;
}

type JwtConfig = {
    secretKey: string;
    expiresIn: string;
    refreshTokenExpiresIn: string;
}

type Config = {
    version: string;
    database: Database;
    https: HttpsConfig;
    cookie: CookieConfig;
    callLimit: CallLimitConfig;
    jwt: JwtConfig;
    homePage: string;
    port: number;
} 