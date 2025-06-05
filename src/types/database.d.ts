type CreateUser = {
    readonly username: string;
    readonly password: string;
    readonly salt: string;
    readonly email: string;
}

type CreateArticle = {
    readonly authorId: number;
    readonly title: string;
    readonly content: string;
}

type UpdateArticle = CreateArticle & {
    readonly articleId: number;
}
