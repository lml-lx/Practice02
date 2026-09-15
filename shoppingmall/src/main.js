/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:34:39
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-16 09:56:28
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
//引入路由文件
import router from './router/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css' // 引入样式
import { createPinia } from 'pinia'
//createApp(App).mount('#app')
import './assets/global.css'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)//挂载pinia
app.use(router)//挂载路由
app.use(ElementPlus); //挂载element-plus
app.mount('#app')