/*
 * @Description: 
 * @Autor: lvrong
 * @Date: 2026-05-27 09:31:58
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-26 09:02:31
 */
import { createRouter, createWebHistory } from 'vue-router'

// 1. 定义路由表：URL 与组件的映射关系
const routes = [
    //首页
    {
        path: '/',
        component: () => import('../views/Fixed.vue'),
        children: [
            { path: '/', component: () => import('../views/home.vue') },

            // 订单、售后、设置等页面
            { path: '/order', component: () => import('../views/order.vue') },
            //商品
            { path: '/goods', component: () => import('../views/goods.vue') },
            //订单详情
            { path: '/orderItem/:order_id', component: () => import('../views/order_item.vue') },
            //用户
            { path: '/user', component: () => import('../views/user.vue') },
            { path: '/category', component: () => import('../views/category.vue') },
            { path: '/comment', component: () => import('../views/comment.vue') },
            { path: '/addGoods', component: () => import('../views/addGood.vue') },


        ]
    },
    //登录
    {
        path: '/login',
        component: () => import('../views/login.vue')
    },
]

// 2. 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})

//导航守卫：全局登录控制
router.beforeEach((to, from) => {
    const token = localStorage.getItem('token')
    const isLogin = !!token && token !== ''
    if (to.path === '/login') {
        return true
    }
    if (!isLogin) {
        alert('请先登录后再访问');
        return '/login'
    }
    return true
})
// 3. 导出路由实例
export default router