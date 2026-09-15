<template>
    <div style="padding: 40px 200px;">
        <el-card title="新增商品">
            <el-form :model="goodsForm" label-width="100px">
                <el-form-item label="商品名称">
                    <el-input v-model="goodsForm.good_name" placeholder="请输入商品名称"></el-input>
                </el-form-item>

                <!-- 新增：商品分类下拉选择 -->
                <el-form-item label="商品类别">
                    <el-select v-model="goodsForm.category_id" placeholder="请选择分类">
                        <span v-for="item in catData">
                            <el-option :label="item.cat_name" :value="item.category_id"></el-option>
                        </span>
                    </el-select>
                </el-form-item>

                <el-form-item label="商品封面图">
                    <el-upload :auto-upload="false" :show-file-list="false" @change="handleCoverFile">
                        <el-button>选择图片</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="商品描述">
                    <el-input v-model="goodsForm.good_desc" :rows="3" type="textarea"></el-input>
                </el-form-item>

                <el-divider>商品SKU规格</el-divider>
                <el-table :data="skuList" border>
                    <el-table-column label="规格名称">
                        <template #default="scope">
                            <el-input v-model="scope.row.sku_name"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格售价">
                        <template #default="scope">
                            <el-input v-model.number="scope.row.sku_price"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="库存数量">
                        <template #default="scope">
                            <el-input v-model.number="scope.row.stock"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="danger" @click="skuList.splice(scope.$index, 1)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button style="margin-top:10px" @click="skuList.push({ sku_name: '', sku_price: 0, stock: 0 })">
                    添加一条规格
                </el-button>

                <el-form-item style="margin-top:30px;text-align:center;margin-left: 30%;">
                    <el-button @click="$router.back()">取消</el-button>
                    <el-button type="primary" @click="submitAdd">提交保存</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import request from '../utils/request'
const router = useRouter()
// 表单
const goodsForm = ref({
    good_name: '',
    category_id: '', // 分类ID
    good_desc: ''
})
const coverFile = ref(null) 
const skuList = ref([
    { sku_name: '', sku_price: 0, stock: 0 }
])
//保存商品图片
const handleCoverFile = (file) => {
    coverFile.value = file.raw
}
//提交添加
const submitAdd = async () => {
    const formData = new FormData()
    formData.append('good_name', goodsForm.value.good_name)
    formData.append('category_id', goodsForm.value.category_id) 
    formData.append('good_desc', goodsForm.value.good_desc)
    if (coverFile.value) {
        formData.append('cover_img', coverFile.value)
    }
    formData.append('skuList', JSON.stringify(skuList.value))

    try {
        const res = await request.post('/addGoodsWithSku', formData)
        if (res.code === 200) {
            ElMessage.success('新增成功')
            router.push('/goods')
        }
    } catch {
        ElMessage.error('新增失败')
    }
}
//获得类别表数据
const catData = ref()
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
onMounted(() => {
    getPartCategory()
})
</script>