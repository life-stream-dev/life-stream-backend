type Runnable<T> = (param: T) => void;
type Callback = () => void;

type ApiResponse<T> = {
    status: boolean
    message: string
    data: T
}