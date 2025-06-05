import type {HttpCode} from "@/utils/httpCode.js";


export const newServiceReturn = <T>(code: HttpCode, status: boolean, message: string, data: T): ServiceReturn<T> => {
    return {code, response: newApiResponse(status, message, data)}
}

export const newApiResponse = <T>(status: boolean, message: string, data: T): ApiResponse<T> => {
    return {status, message, data}
}