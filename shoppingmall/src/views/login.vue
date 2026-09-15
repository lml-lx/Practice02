<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 09:02:13
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-17 15:14:27
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\login.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box">


        <!--  <div class="login-container">
        <el-card class="login-card">
            <h1 class="login-title">登录</h1>

            <el-form @submit.prevent="handleLogin">
                <el-form-item>
                    <el-input placeholder="用户名" v-model="form.username" clearable />
                </el-form-item>

                <el-form-item>
                    <el-input type="password" v-model="form.password" placeholder="密码" show-password />
                </el-form-item>

                <el-form-item>
                    <el-checkbox>记住我</el-checkbox>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" native-type="submit" class="login-btn">
                        登录
                    </el-button>
                </el-form-item>

                <div class="register-link">
                    还没有账号？
                    <el-link type="primary" @click="router.push('/register')">
                        立即注册
                    </el-link>
                </div>
            </el-form>
        </el-card>
   </div> -->
        <div class='login-container'>
            <p class="login-title" style="margin-top: 40px; font-family:' Microsoft YaHei', 'PingFang SC'
                , 'Helvetica Neue' , Helvetica, Arial, sans-serif;">登录</p>
            <span>你好，欢迎来到购物商城后台</span>
            <el-form @submit.prevent="handleLogin">

                <div class="input1">
                    <el-input v-model="form.username" style="max-width: 250px" placeholder="请输入用户名">
                        <template #prepend><el-icon>
                                <UserFilled />
                            </el-icon></template>
                    </el-input>
                </div>
                <div class="mt-4 input1">
                    <el-input type="password" v-model="form.password" style="max-width: 250px" placeholder="请输入密码">
                        <template #prepend><el-icon>
                                <Lock />
                            </el-icon></template>
                    </el-input>
                </div>
                <el-button type="primary" native-type="submit" class="login-btn" >登录</el-button>
            </el-form>
            
        </div>

    </div>


</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import request from '../utils/request';
import { useUserStore } from '../stores/user';
const userStore = useUserStore()

import { Search, UserFilled, Lock } from '@element-plus/icons-vue'


const router = useRouter()
//表单数据
const form = reactive({
    username: '',
    password: ''
})
const handleLogin = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.post('/login', {
            username: form.username,
            password: form.password,
            roleNum: 1
        })
        if (reslut.code === 200) {
            ElMessage.success("登录成功")
            userStore.login(reslut.data.token, reslut.data.user)
            router.push('/')
        } else {
            ElMessage.error(reslut.message || "登录失败")
        }
    } catch (error) {
        console.log('登录出错：', error);
        ElMessage.error('登录失败,请稍后再试')
    }
}
</script>

<style scoped>
.box {
    width: 100vw;
    height: 100vh;
    background: url('../../public/bg.png') no-repeat;
    background-size: cover;
}

.login-container {
    width: 340px;
    height: 400px;
    padding: 10px;
    background-color: rgba(253, 254, 254, 0.8);
    border-radius: 15px;
    margin-left: 900px;
    margin-top: 220px;
}

.input1 {
    border-radius: 15px;
    margin-top: 28px;

}
.login-btn{
    width: 280px;
    margin-top: 30px;
}
span{
    font-size: 12px;
    font-family:  sans-serif;

}
p{
    font-size: 32px;
    color: rgb(6, 6, 6);
}
</style>
