/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-17 23:01:21
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-23 10:02:13
 * @FilePath: \VUE\代码\shixun\server\ctrls\orders.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEb
 */
const db = require('../db/index')
//获取今日，昨日,本月的商品数量和订单数量
module.exports.showOrderPart = async (req, res) => {
    let sql1 = `
    SELECT SUM(b.num) AS today_sales FROM orders a,order_item b 
    WHERE a.order_id = b.order_id and DATE(a.create_time) = CURDATE()
    AND order_status IN (1,2,3);
    SELECT SUM(b.num) AS yesterday_sales FROM orders a,order_item b
    WHERE a.order_id = b.order_id and a.create_time >= CURDATE() - INTERVAL 1 DAY
    AND a.create_time < CURDATE()
    AND order_status IN (1,2,3);
    SELECT SUM(b.num) AS month_sales FROM orders a,order_item b
    WHERE a.order_id = b.order_id and a.create_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    AND a.create_time < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
    AND order_status IN (1,2,3);
    select count(*) AS  today_order from orders where DATE(create_time) = CURDATE()  and  order_status IN (1,2,3);
    SELECT count(*) AS yesterday_order FROM orders WHERE create_time >= CURDATE()- INTERVAL 1 DAY and create_time<CURDATE() AND order_status IN (1,2,3);
    SELECT count(*) AS month_order FROM orders WHERE create_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
    AND create_time < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')
    and order_status IN (1,2,3);
    `
    let result = await db(sql1, [])
    let goods = {
        title: '销量',
        today: Number(result[0][0].today_sales),
        yesterday: Number(result[1][0].yesterday_sales),
        month: Number(result[2][0].month_sales)
    }
    let order = {
        title: '订单量',
        today: Number(result[3][0].today_order),
        yesterday: Number(result[4][0].yesterday_order),
        month: Number(result[5][0].month_order)
    }
    res.send({ code: 200, message: '', data: { goods, order } })
    //console.log(goods,order);

}
//获取订单列表
module.exports.getOrder = async (req, res) => {
    let { statusId,pageIndex, showNum } = req.query
    let sql = ``
    let result
    if (!statusId || statusId === '') {
        sql = `
select a.order_id,b.good_name,a.order_no, DATE_FORMAT(a.create_time,'%Y-%m-%d')as create_time,c.username ,a.pay_status,a.order_status,a.total_money
from orders a,order_item b,user c
where a.order_id = b.order_id and c.user_id = a.user_id and a.is_delete=0 limit ?,?;
select count(*) as total
from orders a,order_item b,user c
where a.order_id = b.order_id and c.user_id = a.user_id and a.is_delete=0;
    `
        result = await db(sql, [(Number(pageIndex) - 1) * Number(showNum), Number(showNum)])
    } else {
        sql = `
select a.order_id,b.good_name,a.order_no, DATE_FORMAT(a.create_time,'%Y-%m-%d') as create_time,c.username ,a.pay_status,a.order_status,a.total_money
from orders a,order_item b,user c
where a.order_id = b.order_id and c.user_id = a.user_id and a.is_delete=0 and order_status=? limit ?,?;
select count(*) as total
from orders a,order_item b,user c
where a.order_id = b.order_id and c.user_id = a.user_id and a.is_delete=0 and  order_status=? ;
`
        result = await db(sql, [statusId,(Number(pageIndex) - 1) * Number(showNum), Number(showNum),statusId])

    }
   //console.log(pageIndex);
    
    //console.log(result);

    res.send({ code: 200, message: '', data: { tableData:result[0],total:result[1][0].total} })
}

//订单详情
module.exports.getOrderItem  = async (req,res)=>{
    let { order_id } = req.query
    let sql =`
    
SELECT a.order_status,a.pay_status,a.order_no,a.total_money,b.username,b.avatar,a.receiver,a.receiver_phone,a.receiver_addr,a.note
from orders a,user b
where a.user_id = b.user_id  and b.is_delete =0 and a.order_id =?;

SELECT a.good_name,a.cover_img,a.price,b.num
from order_item b,goods a
where b.good_id  = a.good_id and b.order_id=?
    `
    let result = await db(sql,[order_id,order_id])
    console.log(result[0],result[1]);
    
    res.send({ code: 200, message: '', data: { orderMsg: result[0][0], goods: result[1]} })

}
//详情页的信息更改
module.exports.changeMsg = async (req,res)=>{
    try {
        const { order_id, title, Msg } = req.body;
        let sql = '';
        let params = [];
        switch (title) {
            case 'user':
                sql = `UPDATE orders SET receiver = ?, receiver_phone = ? WHERE order_id = ?`;
                params = [Msg.username, Msg.userPhone, order_id];
                break;
            case 'addr':
                sql = `UPDATE orders SET receiver_addr = ? WHERE order_id = ?`;
                params = [Msg.value, order_id];
                break;
            case 'note':
                sql = `UPDATE orders SET note = ? WHERE order_id = ?`;
                params = [Msg.value, order_id];
                break;
            case 'price':
                sql = `UPDATE orders SET total_money = ? WHERE order_id = ?`;
                params = [Msg.value, order_id];
                break;
            case 'status':
                sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
                params = [Msg.value, order_id];
                break;
            default:
                return res.send({ code: 400, message: '修改类型不合法', data: null });
        }
        const result = await db(sql, params);
        // 正确判断是否修改成功：affectedRows > 0 代表有数据被更新
        if (result.affectedRows > 0) {
            res.send({ code: 200, message: '修改成功!!!', data: [] });
            console.log('更新结果：', result);
        } else {
            res.send({ code: 201, message: '修改失败，无匹配订单或数据未变动', data: null });
        }
    } catch (err) {
        console.error('更新订单异常：', err);
        res.send({ code: 500, message: '服务器数据库异常', data: null });
    }
}