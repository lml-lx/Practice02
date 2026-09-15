<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-22 08:48:08
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-30 11:47:21
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\order_item.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box">
        <div class="box1">
            <el-link target="_blank" type="primary" @click="$router.push(`/order`)">
                <el-icon>
                    <ArrowLeftBold />
                </el-icon>返回上一级</el-link>
        </div>
        <div class="box2">
            <div class="left">
                <div class="left1">


                    <span style="padding-bottom: 10px;">订单状态</span>
                    <el-card class="card-top" shadow="hover">
                        <div>
                            <el-text size="large" v-if="orderMsg && orderName[Number(orderMsg.order_status)]"
                                :type="orderName[Number(orderMsg.order_status)].type">
                                <el-icon>
                                    <Clock />
                                </el-icon>
                                <span>
                                    {{ orderName[Number(orderMsg.order_status)].name }}
                                </span>
                            </el-text>


                            <div class="goods-id">订单ID: {{ orderMsg.order_no }}</div>
                        </div>
                        <!-- 商品行 -->
                        <div class="goods-row" v-for="item in goods">
                            <div class="goods-img">
                                <img :src="`/api/images/${item.cover_img}`" alt="商品图" />
                            </div>
                            <div class="goods-info">
                                <div class="goods-name">{{ item.good_name }}</div>

                            </div>
                            <div class="goods-price">
                                <div>¥ 20.00</div>
                                <div class="num">数量: {{ item.num }}</div>
                            </div>
                        </div>
                        <!-- 操作按钮 -->
                        <div class="btn-wrap">
                            <el-button plain
                                v-if="Number(orderMsg.order_status) != 0 && Number(orderMsg.order_status) != 1 && Number(orderMsg.order_status) != 4 && Number(orderMsg.order_status) != 3"
                                @click="wc()">标记为已完成</el-button>
                            <el-button type="primary" v-if="Number(orderMsg.order_status) === 1"
                                @click="fahuo()">发货</el-button>
                        </div>
                    </el-card>

                </div>
                <div class="left2">
                    <span style="padding-bottom: 10px;">支付状态</span>
                    <el-card class="card-bottom" shadow="hover">
                        <div>
                            <el-text size="large" v-if="payName[Number(orderMsg.pay_status)]"
                                :type="payName[Number(orderMsg.pay_status)].type">

                                <el-icon>
                                    <Money />
                                </el-icon>
                                <span>{{ payName[Number(orderMsg.pay_status)].name }}</span>
                            </el-text>

                        </div>
                        <div class="price-list">
                            <div class="price-item">
                                <span>小计 </span>
                                <span>¥ {{ orderMsg.total_money }}</span>
                            </div>
                            <div class="price-item">
                                <span>运费 </span>
                                <span>¥ 0.0</span>
                            </div>

                            <div class="price-item total-row">
                                <span>总计</span>
                                <span>¥ {{ orderMsg.total_money }}</span>
                            </div>
                        </div>

                        <div class="btn-wrap"
                            v-if="Number(orderMsg.pay_status) == 0 && Number(orderMsg.order_status) != 4 && Number(orderMsg.order_status) != 5">
                            <!-- 支付状态为未支付 -->

                            <el-button class="!ml-0" plain @click="dialogVisible = true">
                                更改价格
                            </el-button>
                            <el-dialog v-model="dialogVisible" title="Tips" width="500" draggable>
                                <el-modul>更改后价格：</el-modul><el-input type="text" name="" id="" v-model="changePrice" />
                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button @click="dialogVisible = false;">取消</el-button>
                                        <el-button type="primary" @click="change1()">
                                            确定
                                        </el-button>
                                    </div>
                                </template>
                            </el-dialog>
                        </div>
                    </el-card>
                </div>
            </div>
            <div class="right">
                <div class="right1">
                    <el-card class="right-card" shadow="hover">
                        <h3 class="card-head">买家信息</h3>
                        <div class="buyer-header">
                            <el-avatar size="50" :src="`/api/head_img/${orderMsg.avatar}`" />
                            <div class="buyer-name">
                                <div>{{ orderMsg.username }}</div>
                            </div>

                        </div>

                        <div class="info-block">
                            <div class="block-title" style='text-align: left;'>联系信息
                                <span class="edit !ml-0" plain @click="dialogVisible1 = true" >编辑</span>

                                <el-dialog v-model="dialogVisible1" title="编辑" width="500" draggable>
                                    <el-modul>用户名：</el-modul><el-input type="text" name="" id="" v-model="changename" />
                                    <el-modul>电话 ：</el-modul><el-input type="text" name="" id=""
                                        v-model="changePhone" />
                                    <template #footer>
                                        <div class="dialog-footer">
                                            <el-button @click="dialogVisible1 = false">取消</el-button>
                                            <el-button type="primary" @click="change2()">
                                                确定
                                            </el-button>
                                        </div>
                                    </template>
                                </el-dialog>
                            </div>
                            <div class="info-line">
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>{{ orderMsg.receiver }}</span>
                            </div>
                            <div class="info-line">
                                <el-icon>
                                    <Phone />
                                </el-icon>
                                <span>{{ orderMsg.receiver_phone }}</span>
                            </div>
                        </div>

                        <div class="info-block" style='text-align: left; '>
                            <div class="block-title">收货地址 <span class="edit !ml-0" plain
                                    @click="dialogVisible2 = true">编辑</span>
                                <el-dialog v-model="dialogVisible2" title="编辑" width="500" draggable>
                                    <el-modul>收货地址：</el-modul><el-input type="text" name="" id=""
                                        v-model="changeaddr" />
                                    <template #footer>
                                        <div class="dialog-footer">
                                            <el-button @click="dialogVisible2 = false">取消</el-button>
                                            <el-button type="primary" @click="change3()">
                                                确定
                                            </el-button>
                                        </div>
                                    </template>
                                </el-dialog>

                            </div>
                            <div class="info-line">
                                <el-icon>
                                    <Location />
                                </el-icon>
                                <span>{{ orderMsg.receiver_addr }}</span>
                            </div>
                        </div>

                        <div class="info-block">
                            <div class="block-title">账单地址 </div>
                            <div class="info-line">
                                <el-icon>
                                    <Location />
                                </el-icon>
                                <span>与收货地址相同</span>
                            </div>
                        </div>
                    </el-card>
                    <el-card class="right-card note-card" shadow="hover">
                        <div class="block-title" style='text-align: left; '>备注 <span class="edit " plain
                                @click="dialogVisible3 = true">编辑</span>
                            <el-dialog v-model="dialogVisible3" title="编辑" width="500" draggable>
                                <el-modul>备注：</el-modul><el-input type="text" name="" id="" v-model="changenote" />
                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button @click="dialogVisible3 = false">取消</el-button>
                                        <el-button type="primary" @click="change4">
                                            确定
                                        </el-button>
                                    </div>
                                </template>
                            </el-dialog>
                        </div>
                        <div class="note-text">
                            <span>{{ orderMsg.note }}</span>
                            <span v-if="orderMsg.note === ''"> 买家暂无备注</span>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import request from '../utils/request.js'
import { ElMessage, valueEquals } from 'element-plus';
import { ArrowLeftBold, Van, Message, Clock, CircleCheck, Phone, Location, User, Money } from '@element-plus/icons-vue'
const route = useRoute()
const payName = ref([
    { name: '未支付', type: 'danger' },
    { name: '已支付', type: 'success' }
])
const orderName = ref([
    { name: '待付款', type: 'warning' },
    { name: '待发货', type: 'info' },
    { name: '待收货 ', type: 'primary' },
    { name: '已完成', type: 'success' },
    { name: '已取消', type: 'danger' },
    { name: '退款中', type: 'primary' }
])
const dialogVisible = ref(false)
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const dialogVisible3 = ref(false)
const changePrice = ref('')
const changename = ref()
const changePhone = ref()
const changenote = ref()
const changeaddr = ref()
const orderMsg = ref({})
const goods = ref([])
const emit = defineEmits(['page'])
const getOrderItem = async () => {
    try {
        const reslut = await request.get('/getOrderItem', {
            params: {
                order_id: route.params.order_id
            }
        })
        if (reslut.code === 200) {

            orderMsg.value = reslut.data.orderMsg
            goods.value = reslut.data.goods
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}

const title = ref()
const Msg = ref({})
// 修改接口，返回完整响应供外层判断
const changeMsg = async () => {
    try {
        const reslut = await request.post('/changeMsg', {
            order_id: route.params.order_id,
            title: title.value,
            Msg: Msg.value
        })
        return reslut
    } catch (error) {
        console.log('数据修改出错：', error);
        ElMessage.error('数据修改失败,请稍后再试')
        return null
    }
}

// 发货
const fahuo = async () => {
    title.value = 'status'
    Msg.value = { value: 2 }
    const res = await changeMsg()
    if (res.code === 200) {
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}

// 完成
const wc = async () => {
    title.value = 'status'
    Msg.value = { value: 3 }
    const res = await changeMsg()
    if (res.code === 200) {
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}

// 修改价格
const change1 = async () => {
    title.value = 'price'
    Msg.value = { value: changePrice.value }
    const res = await changeMsg()
    if (res.code === 200) {
        dialogVisible.value = false
        changePrice.value = ''
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}

// 修改收件人信息
const change2 = async () => {
    title.value = 'user'
    Msg.value = { username: changename.value, userPhone: changePhone.value }
    const res = await changeMsg()
    if (res.code === 200) {
        dialogVisible1.value = false
        changename.value = ''
        changePhone.value = ''
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}

// 修改地址
const change3 = async () => {
    title.value = 'addr'
    Msg.value = { value: changeaddr.value }
    const res = await changeMsg()
    if (res.code === 200) {
        dialogVisible2.value = false
        changeaddr.value = ''
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}

// 修改备注
const change4 = async () => {
    title.value = 'note'
    Msg.value = { value: changenote.value }
    const res = await changeMsg()
    if (res.code === 200) {
        dialogVisible3.value = false
        changenote.value = ''
        ElMessage.success("数据修改成功")
        await getOrderItem()
    } else if (res) {
        ElMessage.error(res.message || "数据修改失败")
    }
}
onMounted(() => {
    emit('page', 4)
    //console.log(route.query.status);
    getOrderItem()

})
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: start;
}

.box1 {
    width: 10%;
    padding: 10px;
    text-align: center;
    font-size: 20px;
}

.box2 {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
}

.left {
    width: 60%;
    padding-bottom: 10px;
    text-align: left;
}

.left1 {
    width: 98%;
    height: 48%;
    padding: 20px;

    border-radius: 15px;
    margin-bottom: 20px;
}

.left2 {
    width: 98%;
    height: 48%;
    padding: 20px;
    border-radius: 15px;

    margin-bottom: 40px;
}

.right {
    width: 40%;
    padding-top: 10px;
}

.right1 {
    width: 95%;
    height: 100%;

    border-radius: 15px;

}

.left-item1 {
    background-color: rgb(228, 228, 228);
    margin-left: 20px;
    list-style: none;
}

.page-wrap {
    padding: 20px;
    background: #f0f7ff;
    min-height: 100vh;
}

.container {
    display: flex;
    gap: 20px;
}

/* 左侧 */
.left-box {
    width: 62%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.card-top,
.card-bottom {
    border-radius: 12px;
}

.status-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
    margin-bottom: 24px;
    padding: 10px;
    border-bottom: 1px solid rgb(228, 228, 228, 0.5);
}

.status-text {
    font-size: 18px;
    color: #ff9500;
    font-weight: 500;
}

.goods-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
    background-color: #f2efef;
    border-radius: 10px;
    padding: 5px;
}

.goods-img img {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    object-fit: cover;
}

.goods-info {
    flex: 1;

}

.goods-name {
    font-size: 16px;
    margin-bottom: 4px;
}

.goods-id {
    color: #999;
    font-size: 13px;
}

.goods-price {
    text-align: right;
}

.num {
    font-size: 13px;
    color: #999;
    margin-top: 4px;
}

.btn-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.pay-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
    margin-bottom: 20px;
}

.price-list {
    margin-bottom: 20px;
}

.price-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 15px;
}

.count,
.name,
.discount-text {
    color: #999;
    margin-left: 6px;
}

.total-row {
    font-weight: 500;
    padding-top: 10px;
    border-top: 1px solid #eee;
    margin-top: 8px;
}

.real-pay {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    padding-top: 10px;
    border-top: 1px solid #eee;
}

.pay-num {
    font-weight: bold;
    font-size: 18px;
}

.right-card {
    border-radius: 12px;
}

.card-head {
    font-size: 16px;
    margin: 0 0 20px 0;
}

.buyer-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
}

.buyer-name div:first-child {
    font-size: 16px;
}

.buyer-name div:last-child {
    font-size: 13px;
    color: #999;
}

.mail-icon {
    margin-left: auto;
    color: #409EFF;
    cursor: pointer;
}

.info-block {
    margin-bottom: 22px;
}

.block-title {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    margin-bottom: 10px;
}

.edit {
    color: #409EFF;
    font-size: 13px;
    cursor: pointer;
}

.info-line {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
}

.note-text {
    font-size: 14px;
    color: #999;
}

.note-card {
    margin-top: 10px;
}
</style>