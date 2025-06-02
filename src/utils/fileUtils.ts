import {accessSync, constants, mkdirSync, readdirSync, statSync, writeFileSync} from "fs";
import type {WriteFileOptions} from "fs";
import {join, relative} from "path";
import {EncryptUtils} from "@/utils/encryptUtils.js";

export namespace FileUtils {
    import encryptMD5 = EncryptUtils.encryptMD5;
    import encryptFile = EncryptUtils.encryptFile;

    /**
     * @desc 检查一个目录是否存在
     * @desc 如果不存在且createFile为true则创建该目录
     * @param {string} path 要检查的目录
     * @param {boolean} createDir 如若目录不存在是否创建目录
     * @param {Runnable<boolean>} callback 回调函数
     * @return {true} 存在
     * @return {false} 不存在
     * @return {void} 当传入回调函数时不返回值
     */
    export function checkDirExist(path: string, createDir: boolean = false, callback?: Runnable<boolean>): void | boolean {
        try {
            accessSync(path, constants.F_OK);
            const stat = statSync(path);
            if (stat.isDirectory()) {
                return callback ? callback(true) : true;
            }
            return callback ? callback(false) : false;
        } catch (_) {
            if (createDir) {
                mkdirSync(path, {recursive: true});
            }
            return callback ? callback(false) : false;
        }
    }

    /**
     * @desc 检查一个文件是否存在
     * @desc 如果不存在且createFile为true则创建该文件并写入内容data
     * @desc options为文件写入时候的选项
     * @param {string} path 要检查的文件路径
     * @param {boolean} createFile 如若文件不存在是否创建文件
     * @param {string} data 要写入文件的内容,默认为空文件
     * @param {WriteFileOptions} options 写入文件时的选项,默认为"utf-8"
     * @param {Runnable<boolean>} callback 回调函数
     * @return {true} 存在
     * @return {false} 不存在
     * @return {void} 当传入回调函数时不返回值
     */
    export function checkFileExist(path: string, createFile: boolean = false, data: string = "",
                                   options: WriteFileOptions = 'utf-8', callback?: Runnable<boolean>): void | boolean {
        try {
            accessSync(path, constants.F_OK);
            const stat = statSync(path);
            if (stat.isFile()) {
                return callback ? callback(true) : true;
            }
            return callback ? callback(false) : false;
        } catch (_) {
            if (createFile) {
                writeFileSync(path, data, options);
            }
            return callback ? callback(false) : false;
        }
    }

    /**
     * 递归列出某个目录下面的所有文件
     * @param {string} directory 要列出文件的目录路径
     * @param {string[] | undefined} ignoreList 忽略的路径或者文件名列表
     * @returns {string[]} 存储所有文件路径的列表
     */
    export function listAllFiles(directory: string, ignoreList?: string[]): string[] {
        let filesArray: string[] = [];
        const files = readdirSync(directory);
        files.forEach(file => {
            const filePath = join(directory, file);
            const stat = statSync(filePath);
            if (ignoreList !== undefined && (ignoreList.includes(filePath) || ignoreList.includes(file))) {
                return;
            }
            if (stat.isFile()) {
                filesArray.push(filePath);
            } else if (stat.isDirectory()) {
                const subdirectoryFiles = listAllFiles(filePath, ignoreList);
                filesArray = filesArray.concat(subdirectoryFiles);
            }
        });
        return filesArray;
    }

    /**
     * 计算指定目录下所有文件的MD5值
     * @param {string} path 指定目录路径
     * @param {string[] | undefined} ignoreList 忽略的路径或者文件名列表
     * @returns 返回一个字典,键是文件路径,值是该文件的MD5值
     */
    export function calculateFilesMd5(path: string, ignoreList?: string[]): { [key: string]: string } {
        const files = listAllFiles(path, ignoreList);
        const content: { [key: string]: string } = {};
        for (const file of files) {
            content[relative(path, file)] = encryptFile(file, encryptMD5);
        }
        return content;
    }
}
