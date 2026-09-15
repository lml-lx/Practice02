/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-01 08:24:40
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-01 08:38:55
 * @FilePath: \nodejs(class)\rabbitfairy\server\db\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const config = require('./config');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(config.db);
module.exports = async(sql, params) => {
    try {
        let [results] = await pool.query(sql, params);
        return results;
    } catch (err) {
        console.log(err);
    }
};