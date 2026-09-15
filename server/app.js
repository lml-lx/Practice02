/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:35:49
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:37:06
 * @FilePath: \VUE\代码\shixun\server\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('express-jwt');
const token = require('./util/token');
const indexRouter = require('./routes/index');
var app = express();
//全局开启跨域，所有接口都允许前端跨域访问
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(jwt.expressjwt({
  secret: 'shoppingmall_key',//Token 加密,解密密钥
  algorithms: ['HS256']
}).unless({
  path: ['/login', '/reg', '/category', /^\/category\/.*/, /^\/goods\/.*/, /^\/public\/.*/]//放行白名单
}));
//express-jwt中间件会自动验证token的有效性，如果无效会抛出401错误
//验证后，回将token解密后的信息放到req.auth
//验证token的中间件
/* app.use(async (req, res, next) => {
    let tk = req.headers['authorization'];
    if (tk) {
        let info = await token.getToken(tk);
        req.data = info; 
        return next();
    } else {
        return next();
    }
}); */
app.use((err, req, res, next) => {
  if (err.status === 401) {
    res.send({ code: 401, message: 'token失效' });
  } else {
    next();
  }
});
// 挂载统一业务路由
app.use('/', indexRouter);

module.exports = app;