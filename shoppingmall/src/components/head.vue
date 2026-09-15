<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 11:23:02
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-24 23:03:23
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\components\head.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
   
        <div class="box">
            <el-page-header :icon="House" @click="backHome">

                <template #content>
                    <div class="flex items-center">
                        <span v-if="page == 1">首页</span>
                        <span v-if="page == 2">订单管理</span>
                        <span v-if="page == 3">商品管理</span>
                        <span v-if="page == 4">订单详情</span>
                        <span v-if="page == 5">用户管理</span>
                        <span v-if="page == 6">分类管理</span>
                        <span v-if="page == 7">商品管理</span>
                        <span v-if="page == 8">评论管理</span>
                    </div>
                </template>
                <template #extra>
                    <div class="flex items-center" v-if="userStore.isLoggedIn">
                        <el-avatar :size="32" class="mr-3" :src="`/api/head_img/${userStore.User.avatar}`" />
                        <span class="text-large font-600 mr-3"> </span>
                        <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                            {{ userStore.User.username }}
                        </span>

                        <el-tag>管理员</el-tag>
                    </div>
                    <div v-else>
                        <a href="/login">请先登录！</a>
                    </div>
                </template>


            </el-page-header>
        </div>
   


</template>


<script setup>
import { House } from '@element-plus/icons-vue'
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
const backHome = () => {
    router.push('/')
}
const props = defineProps(['page'])
console.log(props.page);

</script>

<style scoped>
.box {
    padding-top: 15px;
    
}

a {
    color: rgb(94, 6, 161);
    text-decoration: none;
    cursor: pointer;
}
</style>