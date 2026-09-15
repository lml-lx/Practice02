/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-17 22:59:31
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 11:31:52
 * @FilePath: \VUE\代码\shixun\server\ctrls\goods.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
const db = require('../db/index')
//今日，昨日，本月商品收藏量
module.exports.showGoodPart = async (req, res) => {
    let sql = `
SELECT count(*) as today_good from goods_collect where  DATE(create_time )= CURDATE() and is_delete = 0;
SELECT count(*) as yesterday_good  from goods_collect where  create_time >= CURDATE() - INTERVAL 1 DAY and create_time<CURDATE() and is_delete = 0;
SELECT count(*) as month_good FROM goods_collect WHERE create_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
  AND create_time < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01') 
  and is_delete = 0;
`
    let result = await db(sql, [])
    let collect = {
        title: '商品收藏量',
        today: result[0][0].today_good,
        yesterday: result[1][0].yesterday_good,
        month: result[2][0].month_good
    }
    res.send({ code: 200, message: '', data: { collect } })
}
//商品库存
module.exports.showGoodsStock = async (req, res) => {
    let sql = `select good_name,stock from goods  where status =1 and is_delete = 0 ORDER BY stock desc  limit 0,4`
    let result = await db(sql, [])
    let goodNames = []
    let stock = []
    result.forEach((item) => {
        goodNames.push(item.good_name)
        stock.push(item.stock)
    })
    //console.log(goodNames,stock);
    res.send({ code: 200, message: '', data: { goodNames, stock } })
}
//获取商品表数据
module.exports.getGoods = async (req, res) => {
    let { pageIndex, showNum } = req.query
    let sql = `select 
    a.good_id,a.category_id,a.good_name,a.cover_img,a.price,a.stock,a.good_desc,a.status,
    DATE_FORMAT(a.create_time,'%Y-%m-%d') as create_time,
    b.sku_id,b.sku_name,b.sku_price
from goods a
LEFT JOIN (
    SELECT * FROM goods_sku 
    WHERE is_delete=0
    GROUP BY good_id
) b ON a.good_id = b.good_id
where a.is_delete = 0 LIMIT ?,?;
select count(*) as total
from goods a
LEFT JOIN (
    SELECT * FROM goods_sku 
    WHERE is_delete=0
    GROUP BY good_id
) b ON a.good_id = b.good_id
where a.is_delete = 0;
select a.good_id,sum(b.stock)as stock from goods a LEFT JOIN goods_sku b on a.good_id = b.good_id and b.is_delete=0 GROUP BY a.good_id LIMIT ?,?
`
    let tableData = [];
 
    result = await db(sql, [(Number(pageIndex) - 1) * Number(showNum), Number(showNum), (Number(pageIndex) - 1) * Number(showNum), Number(showNum)])

    for (let i = 0; i < result[0].length; i++) {
        tableData.push({
            good_id: result[0][i].good_id,
            category_id: result[0][i].category_id,
            good_name: result[0][i].good_name,
            cover_img: result[0][i].cover_img,
            price: result[0][i].price,
            good_desc: result[0][i].good_desc,
            status: result[0][i].status,
            create_time: result[0][i].create_time,
            sku_id: result[0][i].sku_id,
            sku_name: result[0][i].sku_name,
            sku_price: result[0][i].sku_price
        })
        tableData[i].stock = Number(result[2][i].stock)
    }

    res.send({ code: 200, message: '', data: { tableData: tableData, total: result[1][0].total } })
console.log(result[0], result[1][0].total,tableData);

}
//根据good_id查询规格表
module.exports.getGoodsSKU = async (req, res) => {
    let { good_id } = req.query
    let sql = `SELECT sku_id,good_id,sku_name,sku_price,stock,sku_img, DATE_FORMAT(create_time,'%Y-%m-%d') as create_time from goods_sku where is_delete =0 and good_id = ?`
    let result = await db(sql, [good_id])
    res.send({ code: 200, message: '', data: { skuData: result } })
    console.log(result);

}
//商品表删除，修改状态
module.exports.changeGoods = async (req, res) => {
    let { good_id, title, value } = req.body
    let sql = ``
    let result
    let params = [];
    //console.log(Id,title,value);

    switch (title) {
        case 'del':
            sql = `UPDATE goods set is_delete = 1 where  good_id=?`
            params = [good_id]
            break;
        case 'status':
            sql = `UPDATE goods set status=? where  good_id=?`
            params = [value.statusId, good_id]
            break;
        default:
            return res.send({ code: 400, message: '修改类型不合法', data: null });
    }
    result = await db(sql, params);
    if (result.affectedRows > 0) {
        res.send({ code: 200, message: '修改成功!!!', data: [] });

    } else {
        res.send({ code: 201, message: '修改失败，无匹配订单或数据未变动', data: null });
    }
}
//商品表的修改和添加
module.exports.editGoods = async (req, res) => {
    let { good_id, good_name, good_desc } = req.body
    let sql = ``
    let params = []
    let result
    if (req.file) {
        sql = 'UPDATE goods set good_name=?,good_desc=?,cover_img=? where  good_id=?';
        params = [good_name, good_desc, req.file.filename, good_id];
    }
    else {
        sql = 'UPDATE goods set good_name=?,good_desc=? where  good_id=?';
        params = [good_name, good_desc, good_id];
    }
    result = await db(sql, params);
    if (result.affectedRows > 0) {
        res.send({ code: 200, message: '修改成功' });
    } else {
        res.send({ code: 201, message: '修改失败' });
    }
}
module.exports.addGoods = async () => {

    //商品表新增的商品id
    console.log(result.insertId);

}
exports.addGoodsWithSku = async (req, res) => {
    const { good_name, category_id, good_desc, skuList } = req.body
    const cover_img = req.file ? req.file.filename : null
    const skuArr = JSON.parse(skuList)

    let newGoodId = null;

    try {
        // 第一步：插入商品主表
        // 取出第一条SKU的价格，赋值给商品主价格
        const goodsPrice = skuArr[0].sku_price;

        // 插入商品主表，写入price
        const insertGoods = `
      INSERT INTO goods (good_name,category_id,good_desc,cover_img,price,stock,status,is_delete)
      VALUES (?,?,?,?,?,0,1,0)
    `
        const goodsResult = await db(insertGoods, [
            good_name,
            category_id,
            good_desc,
            cover_img,
            goodsPrice  // 第一条规格价格
        ])
        newGoodId = goodsResult.insertId
        // 第二步：循环插入所有SKU
        let totalStock = 0
        let price
        const insertSku = `INSERT INTO goods_sku(good_id,sku_name,sku_price,stock,is_delete) VALUES (?,?,?,?,0)`
        for (let sku of skuArr) {
            await db(insertSku, [newGoodId, sku.sku_name, sku.sku_price, sku.stock])
            totalStock += Number(sku.stock)
        }

        // 第三步：更新商品总库存
        await db(`UPDATE goods SET stock=? WHERE good_id=?`, [totalStock, newGoodId])

        res.send({ code: 200, msg: '新增成功' })

    } catch (err) {
        // 只要出错，如果商品已经插入，就把这条商品删掉
        if (newGoodId) {
            // 先删sku子数据
            await db(`DELETE FROM goods_sku WHERE good_id=?`, [newGoodId])
            // 再删商品主数据
            await db(`DELETE FROM goods WHERE good_id=?`, [newGoodId])
        }
        console.log(err)
        res.send({ code: 201, msg: '新增失败' })
    }
}

//删除规格
module.exports.delGoodsSKU = async(req,res)=>{
let {sku_id}  = req.body
    let sql = `UPDATE goods_sku set is_delete = 1 where sku_id = ?`
    let result  = await db(sql,[sku_id])
    if (result.affectedRows > 0) {
        res.send({ code: 200, message: '删除成功' });
    } else {
        res.send({ code: 201, message: '删除失败' });
    }
    console.log(sku_id);
    
}

module.exports.addGoodsSKU = async (req, res) => {
    try {
        const { good_id, sku_name, stock, sku_price } = req.body
        let sku_img = ''
        if (req.file) sku_img = req.file.filename
        const sql = `INSERT INTO goods_sku(good_id,sku_name,stock,sku_price,sku_img) VALUES (?,?,?,?,?)`
        await db(sql, [good_id, sku_name, stock, sku_price, sku_img])
        res.send({ code: 200, message: '新增规格成功' })
    } catch (err) {
        res.send({ code: 500, message: err.message })
    }
}

module.exports.editGoodsSKU = async (req, res) => {
    try {
        const { sku_id, good_id, sku_name, stock, sku_price } = req.body
        let sql, params
        if (req.file) {
            const sku_img = req.file.filename
            sql = `UPDATE goods_sku SET sku_name=?,stock=?,sku_price=?,sku_img=? WHERE sku_id=? AND good_id=?`
            params = [sku_name, stock, sku_price, sku_img, sku_id, good_id]
        } else {
            sql = `UPDATE goods_sku SET sku_name=?,stock=?,sku_price=? WHERE sku_id=? AND good_id=?`
            params = [sku_name, stock, sku_price, sku_id, good_id]
        }
        await db(sql, params)
        res.send({ code: 200, message: '修改规格成功' })
    } catch (err) {
        res.send({ code: 500, message: err.message })
    }
}