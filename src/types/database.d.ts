type CreateUser = {
    readonly username: string;
    readonly password: string;
    readonly salt: string;
    readonly email: string;
}