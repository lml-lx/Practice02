/*
 * @Description: 
 * @Autor: lvrong
 * @Date: 2026-06-02 15:21:16
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-17 00:01:09
 */
// stores/user.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

//注意：这里的user是唯一的
export const useUserStore = defineStore('user', () => {
    // 1.State - 状态
    const token = ref(localStorage.getItem('token') || '')
    const User = ref(JSON.parse(localStorage.getItem('User')) || '')

    // 2.Getters - 计算属性
    // !!token.value 将token转换为布尔值，如果token存在，则返回true，否则返回false
    const isLoggedIn = computed(() => !!token.value)

    // 3.Actions - 方法
    // 登录
    const login = (newToken, newUser) => {
        token.value = newToken
        User.value = newUser

        // 同步到 localStorage
        localStorage.setItem('token', newToken)
        localStorage.setItem('User', JSON.stringify(newUser) )
    }

    // 退出
    const logout = () => {
        token.value = ''
        User.value = ''

        localStorage.removeItem('token')
        localStorage.removeItem('User')
    }

    //所有的状态、计算属性、方法都返回出去
    return {
        token,
        User,
        isLoggedIn,
        login,
        logout,
    }
})