import {createHash} from "crypto";
import {readFileSync} from "fs";

export namespace EncryptUtils {

    /**
     * 使用指定的哈希函数计算某个字符串的哈希值
     * @param {string} algorithm 哈希函数名(sha1, sha256, md5等)
     * @param {string} content 要加密的字符串
     * @return {string} 字符串的十六进制哈希值
     */
    export function encrypt(algorithm: string, content: string): string {
        return createHash(algorithm).update(content, 'utf8').digest('hex');
    }

    /**
     * @desc 使用指定的加密算法函数计算某个文件的哈希值
     * @desc 内置的加密算法函数有 {@link encryptSHA1}, {@link encryptSHA256}, {@link encryptMD5}
     * @desc 你也可以按照这些函数的格式自定义加密算法函数
     * @param {string} filePath 要计算哈希值的文件路径
     * @param {Function} encrypt 使用的加密算法函数
     * @returns {string} 文件的十六进制哈希值
     */
    export function encryptFile(filePath: string, encrypt: Function): string {
        return encrypt.call(null, readFileSync(filePath));
    }

    /**
     * 使用SHA1哈希算法计算某个字符串的哈希值
     * @param {string} content 要加密的字符串
     * @returns {string} 字符串的十六进制哈希值
     */
    export function encryptSHA1(content: string): string {
        return encrypt('sha1', content);
    }

    /**
     * 使用SHA256哈希算法计算某个字符串的哈希值
     * @param {string} content 要加密的字符串
     * @returns {string} 字符串的十六进制哈希值
     */
    export function encryptSHA256(content: string): string {
        return encrypt('sha256', content);
    }

    /**
     * 使用MD5哈希算法计算某个字符串的哈希值
     * @param {string} content 要加密的字符串
     * @returns {string} 字符串的十六进制哈希值
     */
    export function encryptMD5(content: string): string {
        return encrypt('md5', content);
    }

    /**
     * 对密码进行加盐并用SHA256求哈希值
     * @param {string} password 密码
     * @param {string} salt 盐值
     * @returns {string} 加盐后经过哈希函数处理的密码
     */
    export function encryptPassword(password: string, salt: string): string {
        return encryptSHA256(`${salt.substring(0, 16)}.${password}.${salt.substring(16)}`);
    }
}
