<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-21 17:31:50
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-22 09:01:49
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\components\orderList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <el-table :data="tableData" style="width: 100% ">
        <el-table-column fixed label="订单" width="180">
            <template #default="scope">
                <!-- scope.row 代表当前行整条数据 -->
                <div>{{ scope.row.good_name }}</div>
                <div style="color:#666; font-size:12px;">{{ scope.row.order_no }}</div>
            </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="250" />
        <el-table-column prop="username" label="卖家" width="220" />
        <el-table-column prop=" pay_status" label="支付状态" width="220">
            <template #default="scope">
                <el-tag :type="scope.row.pay_status === 1 ? 'success' : 'danger'" disable-transitions>{{
                    payName[scope.row.pay_status]
                    }}</el-tag>
            </template>
        </el-table-column> 
        <el-table-column prop="order_status" label="订单状态" width="220">
            <template #default="scope">
                <el-tag :type="scope.row.order_status === 2 ? 'primary'
                    : scope.row.order_status === 1 ? 'info'
                        : scope.row.order_status === 4 ? 'danger'
                            : scope.row.order_status === 0 ? 'warning'
                                : 'success'" disable-transitions>{{ orderName[scope.row.order_status]
                                }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="total_money" label="支付金额" width="220" />
        <el-table-column fixed="right" label="操作" min-width="220">

            <template #default="scope">
                <el-button link type="primary" size="small" @click="handleClick(scope.row.order_id, scope.row.order_status)">
                    查看详情
                </el-button>
            </template>
        </el-table-column>

    </el-table>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
const router = useRouter()
'use strict'
const handleClick = (order_id,order_status) => {
    console.log(order_id,order_status)
    router.push({
        path: `/orderItem/${order_id}`,
        query: {
            status: order_status
        }
    })
}
const payName = ref([
    '未支付',
    '已支付'
])
const orderName = ref([
    ' 待付款',
    '待发货',
    '待收货 ',
    '已完成',
    '已取消',
    '退款中'
])



const props = defineProps(['tableData'])

console.log(props.tableData);

</script>
<style scoped></style>