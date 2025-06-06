import {
    type BelongsToCreateAssociationMixin,
    type BelongsToGetAssociationMixin, type BelongsToSetAssociationMixin,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes, type NonAttribute
} from '@sequelize/core';
import {DataTypes, Model} from '@sequelize/core';
import {
    Attribute,
    AutoIncrement, BelongsTo,
    CreatedAt, DeletedAt, NotNull,
    PrimaryKey,
    Table,
    UpdatedAt
} from "@sequelize/core/decorators-legacy";
import {config} from "@/config/index.js";
import {User} from "@/database/model/user.js";

@Table({tableName: `${config.database.prefix}_articles`})
export class Article extends Model<InferAttributes<Article>, InferCreationAttributes<Article>> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare id?: CreationOptional<number>;

    @Attribute(DataTypes.STRING(64))
    @NotNull
    declare title: string;

    @BelongsTo(() => User, "authorId")
    declare user?: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare authorId: number;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare content: string;

    @Attribute(DataTypes.DATE)
    @NotNull
    @CreatedAt
    declare createTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @NotNull
    @UpdatedAt
    declare editTime?: CreationOptional<Date>;

    @Attribute(DataTypes.DATE)
    @DeletedAt
    declare deleted?: Date;

    declare getUser: BelongsToGetAssociationMixin<User>
    declare setUser: BelongsToSetAssociationMixin<User, Article["authorId"]>
}

export namespace ArticleModel {
    export function getArticles() {
        return Article.findAll({
            attributes: {
                exclude: [
                    "authorId",
                    "editTime",
                    "deleted"
                ]
            }
        })
    }

    export function getArticleById(articleId: number) {
        return Article.findOne({
            where: {
                id: articleId
            },
            attributes: {
                exclude: [
                    "deleted"
                ]
            }
        })
    }

    export function addArticle(article: CreateArticle) {
        return Article.create({
            authorId: article.authorId,
            title: article.title,
            content: article.content
        })
    }

    export function updateArticle(article: UpdateArticle) {
        return Article.update({
            title: article.title,
            content: article.content
        }, {
            where: {
                id: article.articleId,
                authorId: article.articleId
            }
        })
    }

    export function updateArticleTitle(article: UpdateArticle) {
        return Article.update({
            title: article.title
        }, {
            where: {
                id: article.articleId,
                authorId: article.articleId
            }
        })
    }

    export function updateArticleContent(article: UpdateArticle) {
        return Article.update({
            content: article.content
        }, {
            where: {
                id: article.articleId,
                authorId: article.articleId
            }
        })
    }

    export function deleteArticle(articleId: number, authorId: number) {
        return Article.destroy({
            where: {
                id: articleId,
                authorId: authorId
            }
        })
    }
}