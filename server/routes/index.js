/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-01 08:24:41
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:42:34
 * @FilePath: \nodejs(class)\rabbitfairy\server\routes\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const userctrls = require('../ctrls/user')
const ordersctrls = require('../ctrls/orders')
const goodsctrls = require('../ctrls/goods')
const categoryctrls = require('../ctrls/category')
const commentctrls = require('../ctrls/comment')
var router = express.Router();
const multer = require('multer')//解析文件中间件
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images')//保存路径
    },
    //保存的文件名
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname)
    }
  })
})
/* GET home page. */
//用户登录
router.post('/login',userctrls.login)
//获取今日，昨日,本月的商品数量和订单数量
router.get('/showOrderPart', ordersctrls.showOrderPart)
//今日,昨日，本月新增用户
router.get('/showUserPart', userctrls.showUserPart)
//今日，昨日，本月商品收藏量
router.get('/showGoodPart', goodsctrls.showGoodPart)
// 各类别今日，昨日销量
router.get('/showCategorySale', categoryctrls.showCategorySale)
//商品库存
router.get('/showGoodsStock', goodsctrls.showGoodsStock)
//用户类型数量
router.get('/showUserNum', userctrls.showUserNum)
//获取订单列表
router.get('/getOrder',ordersctrls.getOrder)
//订单详情数据
router.get('/getOrderItem', ordersctrls.getOrderItem)
//详情页的信息更改
router.post('/changeMsg', ordersctrls.changeMsg)
////获取用户数据
router.get('/getUser', userctrls.getUser)
////更改用户信息
router.post('/updataUser', userctrls.updataUser)
//获取类别表数据
router.get('/getCategory', categoryctrls.getCategory)
//修改类别表数据(添加，删除，编辑，上架，下架)
router.post('/changeCategory', categoryctrls.changeCategory)
//获取商品表数据
router.get('/getGoods', goodsctrls.getGoods)
//根据good_id查询规格表
router.get('/getGoodsSKU', goodsctrls.getGoodsSKU)
//商品表删除，修改状态
router.post('/changeGoods',goodsctrls.changeGoods)

router.post('/editGoods', upload.single('good_img'), goodsctrls.editGoods);
router.post('/addGoodsWithSku', upload.single('cover_img'), goodsctrls.addGoodsWithSku)
router.get('/getPartCategory',categoryctrls.getPartCategory)

router.post('/delGoodsSKU', goodsctrls.delGoodsSKU)

// 新增规格
router.post('/addGoodsSKU', upload.single('sku_img'), goodsctrls.addGoodsSKU)

// 编辑规格 
router.post('/editGoodsSKU', upload.single('sku_img'), goodsctrls.editGoodsSKU)

// 获取所有未被删除的商品评价
router.get('/getCommentList', commentctrls.getCommentList)
// 管理员回复评价
router.post('/replyComment', commentctrls.replyComment)
// 查询单条评论的回复
router.get('/getReplyByCommentId', commentctrls.getReplyByCommentId)
module.exports = router;