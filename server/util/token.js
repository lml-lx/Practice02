/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:38:49
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:42:20
 * @FilePath: \VUE\代码\shixun\server\util\token.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEing
 */
//生成、校验 JWT
const jwt = require('jsonwebtoken');
//秘钥
const jwt_key = 'shoppingmall_key';
//生成token
module.exports.setToken = (user) => {
    let token = jwt.sign(user, jwt_key, { expiresIn: '1h' });
    return token;
};
//解析校验Token
module.exports.getToken = async (token) => {
    if (token) {
        try {
            let info = await jwt.verify(token.split(' ')[1], jwt_key);
            return info;
        } catch (err) {
            return null;
        }
    }
    return null;
};