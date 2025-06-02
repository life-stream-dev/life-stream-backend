/**********************************************
 * @file apiManager.ts
 * @desc 工具类
 * @author Half_nothing
 * @email Half_nothing@163.com
 * @since 1.3.0
 * @date 2024.03.03
 * @license GNU General Public License (GPL)
 **********************************************/
import moment from "moment-timezone";
import type {DurationInputArg2} from "moment-timezone"

import stringRandom from 'string-random';

moment.tz.setDefault('Asia/Shanghai');

export namespace Utils {

    /**
     * 时间操作枚举类
     */
    export enum TimeOperation {
        None,
        Later,
        Early
    }

    /**
     * 以当前时区的当前时间,执行某些对时间的操作
     * @param {TimeOperation} operation 时间操作方法
     * @param {number} time 操作的时间数值
     * @param {DurationInputArg2} timeUnit 操作的时间单位
     * @returns {Date} 经过操作后的时间
     */
    export function getDate(operation: TimeOperation,
                            time: number,
                            timeUnit: DurationInputArg2 = "seconds"): Date {
        switch (operation) {
            case TimeOperation.None:
                return moment().toDate();
            case Utils.TimeOperation.Later:
                return moment().add(time, timeUnit).toDate();
            case Utils.TimeOperation.Early:
                return moment().subtract(time, timeUnit).toDate();
        }
    }

    /**
     * @desc 将数字时间转换为秒数
     * @desc e.g. 将 1m 转换成60, 将1d转换成86400
     * @param {string} time 要转换的时间字符串
     * @returns {number} 字符串代表的秒数
     * @example
     * // output 86400
     * console.log(translateTime("1d"))
     */
    export function translateTime(time: string): number {
        time = time.toLowerCase();
        const timeNumber = parseInt(time.substring(0, time.length - 1), 10);
        switch (time.charAt(time.length - 1)) {
            case 's':
                return timeNumber;
            case 'm':
                return timeNumber * 60;
            case 'h':
                return timeNumber * 60 * 60;
            case 'd':
                return timeNumber * 60 * 60 * 24;
            case 'y':
                return timeNumber * 60 * 60 * 24 * 365;
            default:
                return timeNumber;
        }
    }

    /**
     * 生成一个32位的无特殊符号的字符串
     */
    export function generateKey(): string {
        return stringRandom(32, {letters: true, numbers: true, specials: false});
    }

    /**
     * 延迟一段时间
     * @param {number} ms 要延迟的时间,单位是毫秒
     */
    export function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
