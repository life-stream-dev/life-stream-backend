type Runnable<T> = (param: T) => void;
type Callback = () => void;

type ApiResponse<T> = {
    readonly status: boolean
    readonly message: string
    readonly data: T
}

type JwtData = {
    readonly userId: number,
    readonly username: string,
    readonly permission: number,
    readonly type?: string,
    readonly iat: number,
    readonly exp: number,
    readonly iss: string,
    readonly sub: string
}

type AuthInfo = {
    readonly userId: number,
    readonly username: string,
    readonly tokenExpiresIn: number,
    readonly token: string,
    readonly refreshToken: string
}

type ServiceReturn<T> = {
    readonly code: number,
    readonly response: ApiResponse<T>
}

type DeviceInfo = {
    readonly deviceId: string,
    readonly deviceName?: string
}