/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-17 23:02:12
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-30 09:50:12
 * @FilePath: \VUE\代码\shixun\server\ctrls\comment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const db = require('../db')

// 1. 查询评论列表（带出是否已回复）
exports.getCommentList = async (req, res) => {
    let { pageIndex, showNum } = req.query
    try {
        let sql = `     SELECT c.*, u.username AS user_name,u.user_id
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.is_delete=0 limit ?,?;
       SELECT count(*) as total
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.user_id
      WHERE c.is_delete=0
      `
        const result = await db(sql, [(Number(pageIndex) - 1) * Number(showNum), Number(showNum), (Number(pageIndex) - 1) * Number(showNum), Number(showNum)])
        res.send({ code: 200, data: { tableData: result[0], total: result[1][0].total } })
    } catch (err) {
        res.send({ code: 201, msg: '获取评论失败' })
    }
}

// 2. 管理员回复评论核心接口
exports.replyComment = async (req, res) => {
    const { comment_id, admin_id,user_id, reply_content } = req.body
    console.log(comment_id, admin_id, reply_content);
    
    try {
        await db(`
      INSERT INTO comment_reply (comment_id, admin_id,user_id, reply_content, reply_time, is_delete)
      VALUES (?, ?,?, ?, NOW(), 0)
    `, [comment_id, admin_id,user_id,reply_content])

        await db(`UPDATE comment SET is_reply=1 WHERE comment_id=?`, [comment_id])
        res.send({ code: 200, msg: '回复成功' })
    } catch (err) {
        console.error(err)
        res.send({ code: 201, msg: '回复失败' })
    }
}
// 根据评论id查询管理员回复
exports.getReplyByCommentId = async (req, res) => {
    const { comment_id } = req.query
    try {
        let sql = `  SELECT r.*, a.username AS admin_name
      FROM comment_reply r
      LEFT JOIN user a ON r.admin_id = a.user_id
      WHERE r.comment_id=? AND r.is_delete=0`
        const result = await db(sql, [comment_id])
        res.send({ code: 200, data: result})
        console.log(result);
        
    } catch (err) {
        console.log(err)
        res.send({ code: 201, msg: '查询回复失败' })
    }
}
