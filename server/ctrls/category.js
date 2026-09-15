/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-20 02:07:41
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:44:58
 * @FilePath: \VUE\代码\shixun\server\ctrls\category.js
moo* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
const db = require('../db/index')
// 各类别今日，昨日销量
module.exports.showCategorySale = async (req, res) => {
    let sql = `
SELECT
    c.category_id as category_id,
    c.cat_name AS category_name,
    COALESCE(SUM(t.num), 0) AS todaySale
FROM category c
LEFT JOIN goods g
    ON c.category_id = g.category_id
    AND g.is_delete = 0 AND g.status = 1
LEFT JOIN (SELECT oi.good_id, oi.num
    FROM order_item oi
    INNER JOIN orders o
        ON oi.order_id = o.order_id
        AND o.is_delete = 0
        AND o.pay_status = 1
        AND o.order_status != 4
        AND DATE(o.create_time) = CURDATE() ) t ON g.good_id = t.good_id
WHERE c.is_delete = 0
GROUP BY c.category_id, c.cat_name;
SELECT
    c.category_id as category_id,
    c.cat_name AS category_name,
    COALESCE(SUM(t.num), 0) AS yesterdaySale
FROM category c
LEFT JOIN goods g
    ON c.category_id = g.category_id
    AND g.is_delete = 0 AND g.status = 1
LEFT JOIN (
    SELECT oi.good_id, oi.num
    FROM order_item oi
    INNER JOIN orders o
        ON oi.order_id = o.order_id
        AND o.is_delete = 0
        AND o.pay_status = 1
        AND o.order_status != 4
        AND DATE(o.create_time) >= CURDATE() - INTERVAL 1 DAY and DATE(o.create_time)<CURDATE() ) t ON g.good_id = t.good_id
WHERE c.is_delete = 0
GROUP BY c.category_id, c.cat_name;

    `

    let result = await db(sql, [])

    let catName = []
    let yesterdaySales = []
    let todaySale = []
    result[1].forEach((item) => {
        catName.push(item.category_name)
        yesterdaySales.push(item.yesterdaySale)
    })
    result[0].forEach((item) => {

        todaySale.push(item.todaySale)
    })
    //console.log(catName, yesterdaySales, todaySale);
    res.send({ code: 200, message: '', data: { catName, yesterdaySales, todaySale } })

}
//获取类别表数据
module.exports.getCategory = async (req, res) => {
    let { pageIndex, showNum } = req.query
    let sql = `SELECT category_id,cat_name,status,DATE_FORMAT(create_time,'%Y-%m-%d') as create_time from category where is_delete=0 limit ?,?;
    SELECT count(*)as total from category where is_delete =0
    `
    let result = await db(sql, [(Number(pageIndex) - 1) * Number(showNum), Number(showNum)])
    //console.log(result);

    res.send({ code: 200, message: '', data: { tableData: result[0], total: result[1][0].total } })
}
//修改类别表数据(添加，删除，编辑，上架，下架)
module.exports.changeCategory = async (req, res) => {
    let { Id, title, value } = req.body
    let sql = '';
    let params = [];
    //console.log(Id,title,value);
    
    switch (title) {
        case 'del':
            await db(`UPDATE category SET is_delete=1 WHERE category_id=?`, [Id])
            await db(`UPDATE goods SET is_delete=1 WHERE category_id=?`, [Id])
            return res.send({ code: 200, message: "删除成功！", data: [] });
            break;
        case 'status':
            await db(`UPDATE category SET status=? WHERE category_id=?`, [value.statusId, Id])
            await db(`UPDATE goods SET status=? WHERE category_id=?`, [value.statusId, Id])
            return res.send({ code: 200, message: "修改成功！", data: [] });
        case 'edit':
            sql = `UPDATE category set cat_name = ? where  category_id = ?`;
            params = [value.name,Id];
            break;
        case 'add':
            sql = `INSERT category(cat_name,status) VALUES(?,?)`;
            params = [value.name,value.statusId];
            break;
        default:
            return res.send({ code: 400, message: '修改类型不合法', data: null });
    }
    let result = await db(sql, params);
    if (result.affectedRows > 0) {
        res.send({ code: 200, message: '修改成功!!!', data: [] });
    } else {
        res.send({ code: 201, message: '修改失败，无匹配订单或数据未变动', data: null });
    }
    //console.log(result);
}
module.exports.getPartCategory = async(req,res)=>{
    let sql = 'select * from category where is_delete=0'
    let result = await db(sql,[])
    let catData =[]
   result.forEach((item)=>{
    catData.push({
        category_id: item.category_id,
        cat_name:item.cat_name,
        cat_status:item.status
    })
   })
    res.send({ code: 200, message: '', data: catData })
    console.log(catData);
    
}
