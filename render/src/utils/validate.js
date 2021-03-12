/*
* author: wancheng
* date: 6/26/18
* desc: 校验数据
*/


export function isValidUsername(str) {
    str = '' + str;
    return str.length > 0;
}