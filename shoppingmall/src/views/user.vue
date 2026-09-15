<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-17 23:03:26
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:24:48
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\order.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box">
        <div class="box2">
            <el-input v-model="input" clearable :clear-icon="CloseBold" placeholder="请输入用户名搜索用户..."
                style="max-width: 600px" @clear="handleClear">
                <template #append>
                    <el-button :icon="Search" @click="selectUser()" />
                </template>
            </el-input>
            <div style="margin-right: 20PX;">
                <el-select v-model="value1" placeholder="用户状态" style="width: 120px" clearable @change="selectbystatus" @clear="handleClear2">
                    <template #label="{ value }">
                        <span style="font-weight: bold">{{ value }}</span>
                    </template>
                    <el-option v-for="item in options1" :key="item.value" :value="item.value" />
                </el-select>
                
            </div>

        </div>
        <div class="box3">
           <el-table :data="showtable" style="width: 100% ">
                <el-table-column label="用户头像" width="180">
                    <template #default="scope">
                        <!-- scope.row 代表当前行整条数据 -->
                        <!--    <div>{{ scope.row.user_id }}</div> -->
                        <el-avatar shape="square" :size="50" :src="`/api/head_img/${scope.row.avatar}`" />
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="250" />
                <el-table-column prop="phone" label="电话" width="220" />
                <el-table-column prop=" pay_status" label="账号状态" width="220">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" disable-transitions>{{
                            statusName[scope.row.status]
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="order_status" label="等级" width="220">
                    <template #default="scope">
                        <el-tag :type="scope.row.vip === 1 ? 'warning' : 'primary'" disable-transitions>{{
                            dengji[scope.row.vip]
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="注册时间" width="220" />
                <el-table-column fixed="right" label="操作" min-width="220">

                    <template #default="scope">
                        <el-button type="danger" size="small" :disabled="scope.row.status === 0 ? true : false"
                            @click="updataUser(scope.row.user_id, 0, 'status')" v-if="scope.row.status === 1">
                            冻结
                        </el-button>
                        <el-button type="danger" size="small" :disabled="scope.row.status === 1 ? true : false"
                            @click="updataUser(scope.row.user_id, 1, 'status')" v-else>
                            恢复
                        </el-button>
                        <el-button type="warning" size="small" :disabled="scope.row.vip === 1 ? true : false"
                            @click="updataUser(scope.row.user_id, 1, 'vip')" v-if="scope.row.vip === 0">
                            升级
                        </el-button>
                        <el-button type="primary" size="small" :disabled="scope.row.vip === 0 ? true : false"
                            @click="updataUser(scope.row.user_id, 0, 'vip')" v-else>
                            降级
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div class="box4">
            <div class="example-pagination-block">
                <el-pagination size="large" background layout="prev, pager, next"
                    :total="Math.ceil(total / showNum) * 10" v-model:current-page="pageIndex" class="mt-4"
                    @change="getUser()" />
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
import { fa } from 'element-plus/es/locale/index.mjs';
'use strict'

const statusName = ref([
    '冻结',
    '正常'
])
const dengji = ref([
    '普通用户',
    'VIP用户'
])
const updataUser = async (user_id, value, title) => {
    try {
        const reslut = await request.post('/updataUser', {
                user_id: user_id,
                value: value,
                title: title
        })
        if (reslut.code === 200) {
            ElMessage.success("修改成功")
            getUser()
        } else {
            ElMessage.error(reslut.message || "修改失败")
        }
    } catch (error) {
        console.log('修改出错：', error);
        ElMessage.error('修改失败,请稍后再试')
    }
}
const input = ref()
const value1 = ref('')
const status= ref()
const options1 = [
    {
        value: '冻结',
    },
    {
        value: '正常',
    }
]
const pageIndex = ref(1)
const showNum = ref(7)
const total = ref(0)

const tableData = ref()
const showtable = ref()
const getUser = async () => {
    try {
        if(value1.value=='冻结'){
            status.value =0
        }else if(value1.value == '正常'){
            status.value = 1
        }else if(value1.value == ''){
            status.value = ''
        }
        const reslut = await request.get('/getUser', {
            params: {
                status:status.value,
                pageIndex: pageIndex.value,
                showNum: showNum.value
            }
        })
        if (reslut.code === 200) {
            //ElMessage.success("数据获取成功")
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
const selectUser = () => {
    showtable.value = tableData.value.filter(item => {
        return item.username.includes(input.value)
    })

}
const handleClear = () => {
    selectUser() // 清空后重新查询
}
const handleClear2 = async() => {
    console.log(value1.value);
    console.log(status.value);
    status.value =''
    await getUser()
}
const selectbystatus = () => {
    getUser()
}

const emit = defineEmits(['page'])

onMounted(() => {
    emit('page', 5)
    getUser()
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


.box2 {
    padding-top: 30px;
    padding-left: 20px;
    text-align: left;
    display: flex;
    justify-content: space-between;
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