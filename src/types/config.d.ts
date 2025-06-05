type DatabaseConfig = {
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly database: string;
    readonly connectTimeout: number;
    readonly connectionLimit: number;
}

type Database = {
    readonly config: DatabaseConfig;
    readonly updateTime: number;
    readonly prefix: string;
}

type HttpsConfig = {
    readonly enable: boolean;
    readonly enableHSTS: boolean;
    readonly keyPath: string;
    readonly crtPath: string;
}

type CookieConfig = {
    readonly key: string;
    readonly timeout: number;
}

type CallLimitConfig = {
    readonly count: number;
    readonly time: number;
}

type JwtConfig = {
    readonly secretKey: string;
    readonly expiresIn: string;
    readonly refreshTokenExpiresIn: string;
}

type Config = {
    readonly version: string;
    readonly database: Database;
    readonly https: HttpsConfig;
    readonly cookie: CookieConfig;
    readonly callLimit: CallLimitConfig;
    readonly jwt: JwtConfig;
    readonly homePage: string;
    readonly port: number;
} 