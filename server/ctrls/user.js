/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:46:18
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:25:13
 * @FilePath: \VUE\代码\shixun\server\ctrls\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = require('../db/index');
const token = require('../util/token');

module.exports.login = async (req, res) => {
    let { username, password, roleNum } = req.body;
    let sql = "select * from user where username=? and password=? and status='1' and role=?;";
    let params = [username, password, roleNum];
    let result = await db(sql, params);
    if (result && result.length > 0) {
        let tk = token.setToken(result[0]);
        res.send({
            code: 200,
            message: '登录成功',
            data: {
                token: tk,
                user: result[0]
            }
        });
        console.log(result[0]);

    } else {
        res.send({ code: 201, message: '登录失败', data: null });
    }
};
//今日,昨日，本月新增用户
module.exports.showUserPart = async (req, res) => {
    let sql = `
    SELECT count(*) as today_user from user where  DATE(create_time )= CURDATE() and status=1 and role =0;
    SELECT count(*) as  yesterday_user from user where create_time >= CURDATE() - INTERVAL 1 DAY and create_time<CURDATE() and status=1 and role =0;
    SELECT count(*) as   month_user FROM user   WHERE create_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    AND create_time < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
    AND status =1 and role = 0;
    `
    let result = await db(sql, [])
    let adduser = {
        title: '新增用户',
        today: result[0][0].today_user,
        yesterday: result[1][0].yesterday_user,
        month: result[2][0].month_user
    }
    res.send({ code: 200, message: '', data: { adduser } })
}
//用户类型数量
module.exports.showUserNum = async (req, res) => {
    let sql = `select vip as name,count(*) as value from user where role =0 and status =1 and is_delete=0 GROUP BY vip`
    let result = await db(sql, [])
    let userNum = []
    result.forEach((item) => {
        if (item.name === 1) {
            userNum.push({ name: 'vip用户', value: item.value })
        } else {
            userNum.push({ name: '普通用户', value: item.value })
        }
    })
    //console.log(userNum);
    res.send({ code: 200, message: '', data: { userNum } })

}

//获取用户数据
module.exports.getUser = async (req, res) => {
    let { status, pageIndex, showNum } = req.query
    let sql
    let result
    if (!status && status === '') {
        sql = `SELECT user_id,username,phone,vip,status,DATE_FORMAT(create_time,'%Y-%m-%d') as create_time ,avatar from user where role = 0  limit ?,?;
    select  count(*) as total from  user where role = 0
`
        result = await db(sql, [(Number(pageIndex) - 1) * Number(showNum), Number(showNum)])
    } else {
        sql = `SELECT user_id,username,phone,vip,status,DATE_FORMAT(create_time,'%Y-%m-%d') as create_time ,avatar from user where role = 0  and status = ? limit ?,?;
    select  count(*) as total from  user where role = 0  and status = ?
`
        result = await db(sql, [status,(Number(pageIndex) - 1) * Number(showNum), Number(showNum),status ])
    }

    //console.log(pageIndex);

    console.log(result);

    res.send({ code: 200, message: '', data: { tableData: result[0], total: result[1][0].total } })
}
//更改用户信息
module.exports.updataUser = async(req,res)=>{
    let { user_id,title,value } = req.body
    let sql=``
    let params = [value, user_id]
    if(title ==='status'){
        sql =`UPDATE user set status = ? where user_id = ?`
       
    }else{
        sql = `UPDATE user set vip = ? where user_id = ?`
    }
    let result = await db(sql,params)
    if (result.affectedRows > 0) {
        res.send({ code: 200, message: '修改成功!!!', data: [] });
        console.log( result);
    } else {
        res.send({ code: 201, message: '修改失败，无匹配订单或数据未变动', data: null });
    }
}