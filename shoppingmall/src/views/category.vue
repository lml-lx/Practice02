<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-24 08:25:52
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-30 11:45:35
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\components\category.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box">
        <div class="box1">
            <div style="text-align: left;"><el-button type="primary" plain @click="dialogVisible1 = true">添加</el-button>
               <el-dialog v-model="dialogVisible1" :modal="false" title="新增分类">
                    <!-- 分类名称 -->
                    <el-input v-model="addName" placeholder="请输入分类名称" style="margin-bottom:15px;">
                        <template #prepend>类别名称</template>
                    </el-input>
                    <!-- 上下架下拉框 -->
                     <span>状态：</span>
                    <el-select v-model="addStatus" placeholder="请选择状态" style="width:100%" >
                        <el-option label="下架" :value="0"></el-option>
                        <el-option label="上架" :value="1"></el-option>
                    </el-select>

                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="dialogVisible1 = false">取消</el-button>
                            <el-button type="primary" @click="addSure()">确定</el-button>
                        </div>
                    </template>
                </el-dialog>
                <el-button @click="batchOn()" plain type="success">上架所选类别</el-button> 
                <el-button @click="batchOff()" type="warning" plain>下架所选类别</el-button>
            </div>
            <el-button @click="batchdel()" type="danger" plain>删除所选类别</el-button>
        </div>
        <div>
            <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" size="large">
                <el-table-column type="selection" width="55" />
                <!-- @vue-generic {User} -->
                <el-table-column label="类别编号" width="120">
                    <template #default="scope">{{ scope.row.category_id }}</template>
                </el-table-column>
                <el-table-column property="cat_name" label="类别名称" width="120" />
                <el-table-column prop=" pay_status" label="状态" width="220">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" disable-transitions>{{
                            statusName[scope.row.status]
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="create_time" label="添加日期" />
                <el-table-column label="操作" min-width="220">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="changeCategory(scope.row.category_id, 'del', '')"
                            plain>
                            删除
                        </el-button>
                        <el-button type="primary" size="small"
                            @click="changeCategory(scope.row.category_id, 'status', { statusId: 1 })"
                            v-if="scope.row.status === 0" plain>
                            上架
                        </el-button>
                        <el-button type="warning" size="small"
                            @click="changeCategory(scope.row.category_id, 'status', { statusId: 0 })"
                            v-if="scope.row.status === 1" plain>
                            下架
                        </el-button>
                        <el-button size="small" @click="dialogVisible2 = true;changeName = scope.row.cat_name; chngeId = scope.row.category_id" plain color="#626aef">
                            编辑
                        </el-button>
                        <el-dialog v-model="dialogVisible2" :modal="false" modal-penetrable>
                            <el-form ref="ruleFormRef" style="max-width: 600px" 
                                label-width="auto">
                            
                            <el-input v-model="changeName" style="max-width: 600px"  >
                                <template #prepend>类别名称</template>
                            </el-input>
                            </el-form>
                            <template #footer>
                                <div class="dialog-footer">
                                    <el-button @click="cancel">取消</el-button>
                                    <el-button type="primary"
                                        @click="changeCategory(chngeId,'edit',{name:changeName})">
                                        确定
                                    </el-button>
                                </div>
                            </template>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="box4">
            <div class="example-pagination-block">
                <el-pagination size="large" background layout="prev, pager, next"
                    :total="Math.ceil(total / showNum) * 10" v-model:current-page="pageIndex" class="mt-4"
                    @change="getCategory()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import request from '../utils/request.js'
const pageIndex = ref(1)
const showNum = ref(10)
const total = ref(0)
const statusName = ref([
    '已下架',
    '已上架'
])
'use strict'
const tableData = ref()
const dialogVisible1 = ref(false)
const dialogVisible2 = ref(false)
const changeName = ref()
const chngeId = ref()
const addName = ref('')
// 下拉框状态，默认下架0
const addStatus = ref(0)
const addSure = async () => {
   
    dialogVisible1.value = false
    await changeCategory('', 'add', {
        name: addName.value,
        statusId: addStatus.value
    })
    addName.value = ''
    addStatus.value = 0
}
const cancel = () => {
    dialogVisible2.value = false
    getCategory()
}
const sure = async (Id, title, value) => {
    dialogVisible2.value = false
    await changeCategory(Id, title, value)
}
const getCategory = async () => {
    try {
        const reslut = await request.get('/getCategory', {
            params: {
                pageIndex: pageIndex.value,
                showNum: showNum.value
            }
        })
        if (reslut.code === 200) {
           // ElMessage.success("数据获取成功")
            tableData.value = reslut.data.tableData
            total.value = reslut.data.total
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
const changeCategory = async (Id, title, value) => {
    try {
        const reslut = await request.post('/changeCategory', {
            Id, title, value
        })
        if (reslut.code === 200) {
            ElMessage.success(reslut.message)
            dialogVisible2.value =false
            getCategory()
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
// 存储所有勾选的行数据
const selectedRows = ref([])

// 选中事件，自动接收勾选的数据数组
const handleSelectionChange = (val) => {
    selectedRows.value = val
}
const batchOn = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的分类')
        return
    }
    // 循环遍历选中项，逐个调用接口
    for (let item of selectedRows.value) {
        await changeCategory(item.category_id, 'status', { statusId: 1 })
    }
    ElMessage.success('批量上架完成')
    getCategory() // 刷新列表
}
// 批量下架 status=0
const batchOff = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的分类')
        return
    }
    for (let item of selectedRows.value) {
        await changeCategory(item.category_id, 'status', { statusId: 0 })
    }
    ElMessage.success('批量下架完成')
    getCategory()
}
const batchdel = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的分类')
        return
    }
    for (let item of selectedRows.value) {
        await changeCategory(item.category_id, 'del', { })
    }
    ElMessage.success('批量下架完成')
    getCategory()
}



const emit = defineEmits(['page'])
onMounted(() => {
    emit('page', 6)
    getCategory()
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

    display: flex;
    justify-content: space-between;
    padding: 20px;
}

.box4 {
    width: 100%;
    padding-top: 40px;

    padding-left: 35%;
}
</style>