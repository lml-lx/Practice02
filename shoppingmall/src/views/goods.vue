<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-20 00:17:58
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 08:40:50
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\goods.vue
 * @Description: 商品管理页面，新增规格添加/编辑完整功能
-->
<template>
    <div class="box">
        <div class="box1">
            <div style="width: 50%;">
                <el-input v-model="input" clearable :clear-icon="CloseBold" placeholder="请输入商品名称或其他关键字搜索..."
                    style="max-width: 600px" @clear="handleClear" @keyup.enter="selectGoods()">
                    <template #append>
                        <el-button :icon="Search" @click="selectGoods()" />
                    </template>
                </el-input>
            </div>
            <div>
                <el-button color="#626aef" plain @click="$router.push('/addGoods')"><el-icon>
                        <Plus />
                    </el-icon>添加</el-button>
                <el-button @click="batchOn()" type="primary" plain>上架所选商品</el-button>
                <el-button @click="batchOff()" type="warning" plain>下架所选商品</el-button>
                <el-button @click="batchdel()" type="danger" plain>删除所选商品</el-button>
            </div>
        </div>
        <div>
            <el-table :data="showtable" style="width: 100%" @selection-change="handleSelectionChange" size="large">
                <el-table-column type="selection" width="55" />
                <el-table-column label="商品图片" width="120">
                    <template #default="scope">
                        <el-avatar shape="square" :size="50" :src="`/api/images/${scope.row.cover_img}`"
                            v-if="scope.row.cover_img" />
                        <span v-else>暂无图片</span>
                    </template>
                </el-table-column>
                <el-table-column property="good_name" label="商品名称" width="180" />
                <el-table-column property="stock" label="库存" width="120" />
                <el-table-column label="规格" width="190" show-overflow-tooltip=false>
                    <template #default="scope">
                        <span v-if="scope.row.sku_id">{{ scope.row.sku_name }}</span>
                        <span v-else>默认规格</span>
                        <el-button link type="primary" size="small" @click="openSkuDialog(scope.row.good_id)">
                            更多
                        </el-button>
                        <!-- 规格弹窗主弹窗 -->
                        <div>
                            <el-dialog v-model="dialogVisible" modal-penetrable title="商品规格" width="900px"
                                append-to-body :modal="false" :close-on-click-modal="false">
                                <el-table :data="skuData" style="width: 100%">
                                    <el-table-column prop="sku_id" label="ID" width="120" />
                                    <el-table-column label="规格图片" width="120">
                                        <template #default="scope">
                                            <el-avatar shape="square" :size="50"
                                                :src="`/api/images/${scope.row.sku_img}`" v-if="scope.row.sku_img" />
                                            <span v-else>暂无图片</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="sku_name" label="规格名" width="120" />
                                    <el-table-column prop="stock" label="库存" width="120" />
                                    <el-table-column prop="sku_price" label="价格|¥" width="120">
                                    </el-table-column>
                                    <el-table-column fixed="right" label="操作" min-width="120">
                                        <template #default="scope">
                                            <el-button link type="primary" size="small"
                                                @click="delGoodsSKU(scope.row.sku_id)">
                                                删除
                                            </el-button>
                                            <el-button link type="primary" size="small"
                                                @click="openEditSku(scope.row)">编辑</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button @click="dialogVisible = false">取消</el-button>
                                        <el-button type="primary" @click="openAddSku">添加规格</el-button>
                                    </div>
                                </template>
                            </el-dialog>
                            <!-- 新增/编辑规格共用表单弹窗 -->
                            <el-dialog v-model="skuFormVisible" title="规格表单" width="600px"  append-to-body
                                :modal="false" :close-on-click-modal="false">
                                <el-form ref="skuFormRef" :model="skuForm" label-width="100px">
                                    <el-form-item label="规格名称">
                                        <el-input v-model="skuForm.sku_name" placeholder="请输入规格名称" />
                                    </el-form-item>
                                    <el-form-item label="库存">
                                        <el-input-number v-model="skuForm.stock" :min="0" />
                                    </el-form-item>
                                    <el-form-item label="售价">
                                        <el-input v-model="skuForm.sku_price" placeholder="0.00" />
                                    </el-form-item>
                                    <el-form-item label="规格图片">
                                        <input type="file" accept="image/*" @change="handleSkuImgChange" />
                                        <el-avatar v-if="skuImgPreview" :size="80" shape="square"
                                            :src="`/api/images/${skuImgPreview}`" style="margin-top:10px" />
                                    </el-form-item>
                                </el-form>
                                <template #footer>
                                    <el-button @click="skuFormVisible = false">取消</el-button>
                                    <el-button type="primary" @click="submitSku">{{ isEdit ? '保存修改' : '新增规格'
                                    }}</el-button>
                                </template>
                            </el-dialog>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column property="good_desc" label="简介" width="240" show-overflow-tooltip />
                <el-table-column label="状态" width="150">
                    <template #default="scope">
                        <el-tooltip :content="'商品状态: ' + `${Number(scope.row.status) == 1 ? '上架' : '下架'}`"
                            placement="top">
                            <el-switch v-model="scope.row.status"
                                style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" :active-value="1"
                                :inactive-value="0"
                                @change="(val) => changeGoods(scope.row.good_id, 'status', { statusId: val ? 1 : 0 })"
                                :disabled="getCatStatus(scope.row.category_id) === 0 ? true : false">
                                <template #active-action>
                                    <span class="custom-active-action">T</span>
                                </template>
                                <template #inactive-action>
                                    <span class="custom-inactive-action">F</span>
                                </template>
                            </el-switch>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column property="create_time" label="添加日期" width="120" />
                <el-table-column label="操作" min-width="220" fixed="right">
                    <template #default="scope">
                        <el-button type="danger" size="small" @click="changeGoods(scope.row.good_id, 'del', '')" plain>
                            删除
                        </el-button>
                        <el-button size="small" plain color="#626aef" @click="openEditDialog(scope.row)">
                            编辑
                        </el-button>
                        <el-dialog v-model="dialogVisible2" :modal="false" modal-penetrable title="编辑商品">
                            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" label-width="auto">
                                <el-form-item label="商品图">
                                    <input type="file" @change="onFileChange($event)" />
                                </el-form-item>
                                <el-form-item label="商品名称">
                                    <el-input v-model="ruleForm.good_name" placeholder="请输入商品名称"></el-input>
                                </el-form-item>
                                <el-form-item label="商品简介">
                                    <el-input v-model="ruleForm.good_desc" type="textarea" rows="3"
                                        placeholder="请输入商品简介"></el-input>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <div class="dialog-footer">
                                    <el-button @click="cancel">取消</el-button>
                                    <el-button type="primary" @click="submitEdit">确定</el-button>
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
                    @change="getGoods()" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { CloseBold } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import request from '../utils/request.js'
const dialogVisible = ref(false)
const input = ref()
const value = ref('1')
const pageIndex = ref(1)
const showNum = ref(6)
const total = ref(0)
const tableData = ref()
const showtable = ref()
const selectGoods = () => {
    showtable.value = tableData.value.filter(item => {
        return item.good_name.includes(input.value)
    })
}
const handleClear = () => {
    selectGoods()
}
const selectedRows = ref([])
const handleSelectionChange = (val) => {
    selectedRows.value = val
}
const getGoods = async () => {
    try {
        const reslut = await request.get('/getGoods', {
            params: {
                pageIndex: pageIndex.value,
                showNum: showNum.value
            }
        })
        if (reslut.code === 200) {
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
const skuData = ref([])
// 当前操作商品ID
const currentGoodId = ref(0)
// 规格表单弹窗
const skuFormVisible = ref(false)
// 是否编辑模式
const isEdit = ref(false)
// 规格表单数据
const skuForm = ref({
    sku_id: null,
    good_id: 0,
    sku_name: '',
    stock: 0,
    sku_price: '',
    sku_img: ''
})
// 规格图片临时文件、预览
const  skuImgFile = ref(null)
const skuImgPreview = ref('')
// 打开规格总弹窗，加载规格列表
const openSkuDialog = async (goodId) => {
    currentGoodId.value = goodId
    dialogVisible.value = true
    await getGoodsSKU(goodId)
}
// 获取当前商品规格
const getGoodsSKU = async (goodId) => {
    try {
        const reslut = await request.get('/getGoodsSKU', {
            params: { good_id: goodId }
        })
        if (reslut.code === 200) {
            skuData.value = reslut.data.skuData
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('规格获取出错：', error);
        ElMessage.error('规格数据获取失败')
    }
}
// 打开新增规格表单
const openAddSku = () => {
    isEdit.value = false
    skuForm.value = {
        sku_id: null,
        good_id: currentGoodId.value,
        sku_name: '',
        stock: 0,
        sku_price: '',
        sku_img: ''
    }
    skuImgFile.value = null
    skuImgPreview.value = ''
    dialogVisible.value = false
    skuFormVisible.value = true

}
// 打开编辑规格，回填数据
const openEditSku = (row) => {
    dialogVisible.value = false
    isEdit.value = true
    skuForm.value = { ...row }
    skuImgFile.value = null
    skuImgPreview.value = row.sku_img
    dialogVisible.value = false
    skuFormVisible.value = true

}
// 规格图片选择
const handleSkuImgChange = (e) => {
    if (e.target.files[0]) {
        skuImgFile.value = e.target.files[0]
        skuImgPreview.value = '' 
    }
}
// 提交新增/编辑规格
const submitSku = async () => {
    const formData = new FormData()
    formData.append('good_id', skuForm.value.good_id)
    formData.append('sku_name', skuForm.value.sku_name)
    formData.append('stock', skuForm.value.stock)
    formData.append('sku_price', skuForm.value.sku_price)
    // 编辑携带sku_id
    if (isEdit.value) {
        formData.append('sku_id', skuForm.value.sku_id)
    }
    // 有新图片上传
    if (skuImgFile.value) {
        formData.append('sku_img', skuImgFile.value)
    }
    let res
    if (isEdit.value) {
        // 编辑接口
        res = await request.post('/editGoodsSKU', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    } else {
        // 新增接口
        res = await request.post('/addGoodsSKU', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    }
    if (res.code === 200) {
        ElMessage.success(isEdit.value ? '规格修改成功' : '规格新增成功')
        skuFormVisible.value = false
        // 刷新规格列表
        await getGoodsSKU(currentGoodId.value)
        // 刷新商品主列表
        getGoods()
    } else {
        ElMessage.error(res.message)
    }
}
//商品表删除，修改状态
const changeGoods = async (good_id, title, value) => {
    try {
        const reslut = await request.post('/changeGoods', {
            good_id, title, value
        })
        if (reslut.code === 200) {
            ElMessage.success(reslut.message)
            getGoods()
        } else {
            ElMessage.error(reslut.message || "操作失败")
        }
    } catch (error) {
        console.log('操作出错：', error);
        ElMessage.error('操作失败,请稍后再试')
    }
}

const batchOn = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的商品')
        return
    }
    await ElMessageBox.confirm('确定批量上架？', '提示', { type: 'warning' })
    for (let item of selectedRows.value) {
        if(getCatStatus(item.category_id)===1){
            await changeGoods(item.good_id, 'status', { statusId: 1 })
            ElMessage.success('批量上架完成')
        }else{
            ElMessage.error(item.good_name+'的类别已下架')
        }
        
    }
   
    getGoods()
}
const batchOff = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的商品')
        return
    }
    await ElMessageBox.confirm('确定批量下架？', '提示', { type: 'warning' })
    for (let item of selectedRows.value) {
        await changeGoods(item.good_id, 'status', { statusId: 0 })
    }
    ElMessage.success('批量下架完成')
    getGoods()
}
const batchdel = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先勾选要操作的商品')
        return
    }
    await ElMessageBox.confirm('确定删除，不可恢复！', '危险操作', { type: 'error' })
    for (let item of selectedRows.value) {
        await changeGoods(item.good_id, 'del', {})
    }
    ElMessage.success('批量删除完成')
    getGoods()
}
const ruleForm = ref({})
const dialogVisible2 = ref(false)
const  selectFile = ref(null)
const openEditDialog = (row) => {
    ruleForm.value = { ...row }
    selectFile.value = null
    dialogVisible2.value = true
}
const cancel = () => {
    dialogVisible2.value = false
    ruleForm.value = {}
    selectFile = null
}
const onFileChange = (e) => {
    if (e.target.files.length > 0) {
        selectFile.value = e.target.files[0]
    }
}
//修改商品内容
const submitEdit = async () => {
    const formData = new FormData()
    formData.append('good_id', ruleForm.value.good_id)
    formData.append('good_name', ruleForm.value.good_name)
    formData.append('good_desc', ruleForm.value.good_desc)
    if (selectFile.value) {
        formData.append('good_img', selectFile.value)
    }
    const res = await request.post('/editGoods', formData, {
        headers: { "Content-Type": 'multipart/form-data' }
    })
    if (res.code === 200) {
        ElMessage.success('修改成功')
        dialogVisible2.value = false
        getGoods()
    } else {
        ElMessage.error(res.message)
    }
}
////删除规格
const delGoodsSKU = async (sku_id) => {
    await ElMessageBox.confirm('确定删除该规格？', '提示', { type: 'warning' })
    const res = await request.post('/delGoodsSKU', { sku_id })
    if (res.code === 200) {
        ElMessage.success('删除成功')
        await getGoodsSKU(currentGoodId.value)
        getGoods()
    } else {
        ElMessage.error(res.message)
    }
}
//类别数据
const catData = ref([])
const getPartCategory = async () => {
    try {
        const reslut = await request.get('/getPartCategory')
        if (reslut.code === 200) {
            catData.value = reslut.data
            console.log(catData.value);

        }
    } catch {
        ElMessage.error('失败')
    }
}
//查找对应商品类别的状态
const getCatStatus = (category_id) => {
    const target = catData.value.find(item => item.category_id === category_id)
    return target.cat_status
}

const emit = defineEmits(['page'])
onMounted(async() => {
    emit('page', 7)
    await getPartCategory()
    getGoods()
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
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box4 {
    width: 100%;
    padding-top: 40px;
    padding-left: 35%;
}
</style>