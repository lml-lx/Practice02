<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-17 23:03:26
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-30 11:16:29
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\order.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box">

        <div class="box1">
            <el-segmented v-model="value" :options="options" block style="background-color: white;height: 45px;"
                @change="getOrder()" />
        </div>
        <div class="box2">
            <el-input v-model="input" clearable :clear-icon="CloseBold" placeholder="请输入名称或其他关键字搜索..." style="max-width: 600px" @clear="handleClear">
               <template #append>
                    <el-button :icon="Search" @click="selectOrder()" />
                </template>
            </el-input>
        </div>
        <div class="box3">
            <orderList :tableData="showtable"></orderList>
        </div>
        <div class="box4">
            <div class="example-pagination-block">
                <el-pagination size="large" background layout="prev, pager, next" :total="Math.ceil(total / showNum) * 10"
                    v-model:current-page="pageIndex" class="mt-4" @change="getOrder()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { CloseBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import request from '../utils/request.js'
import orderList from '../components/orderList.vue'
const value = ref('')
const input = ref()
const options = [
    '全部订单',
    '待付款',
    '待发货',
    '待收货',
    '退款中',
    '已取消',
    '已完成'
]
const pageIndex = ref(1)
const showNum = ref(7)
const total = ref(0)

value.value = options[0]
const tableData = ref()
const showtable = ref()
const getOrder = async () => {
    const statusId = ref('')
    if (value.value == '全部订单') {
        statusId.value = ''
    } else if (value.value == '待付款') {
        statusId.value = 0
    } else if (value.value == '待发货') {
        statusId.value = 1
    } else if (value.value == '待收货') {
        statusId.value = 2
    } else if (value.value == '退款中') {
        statusId.value = 5
    } else if (value.value == '已取消') {
        statusId.value = 4
    } else if (value.value == '已完成') {
        statusId.value = 3
    }
    console.log(pageIndex);

    try {

        const reslut = await request.get('/getOrder', {
            params: {
                statusId: statusId.value,
                pageIndex: pageIndex.value,
                showNum: showNum.value
            }
        })
        if (reslut.code === 200) {
            ElMessage.success("数据获取成功")
            tableData.value = reslut.data.tableData
            total.value = reslut.data.total
            showtable.value = tableData.value


        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
const selectOrder = () => {
    showtable.value = tableData.value.filter(item => {
        return item.good_name.includes(input.value)
    })

}
const handleClear = () => {
    selectOrder() // 清空后重新查询
}
const emit = defineEmits(['page'])

onMounted(() => {
    emit('page', 2)
    getOrder()
})
</script>

<style scoped>
.box {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: start;
}

.box1 {
    width: 600px;
    padding-top: 20px;
    padding-left: 20px;
}

.box2 {
    padding-top: 30px;
    padding-left: 20px;
    text-align: left;
}

.box3 {
    padding-top: 30px;
}

.box4 {
    width: 100%;
    padding-top: 40px;

    padding-left: 35%;
}

.example-pagination-block+.example-pagination-block {
    margin-top: 10px;
}
</style>