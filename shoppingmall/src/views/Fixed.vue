<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:34:39
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-22 10:19:41
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <navbar></navbar>
            </el-aside>
            <el-container>
                <el-header>
                    <Head :page="page" ></Head>
                </el-header>
                <el-main><router-view @page="getPage"></router-view></el-main>
            </el-container>
        </el-container>
    </div>
</template>


<script setup>
import navbar from '../components/navbar.vue';
import Head from '../components/head.vue';
import {ref} from 'vue'
const page= ref()
const getPage = (num)=>{
 page.value =num
}
</script>

<style scoped></style>