/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 08:34:39
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-06-16 08:58:02
 * @FilePath: \VUE\代码\shixun\shoppingmall\vite.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': { // 匹配所有以 /api 开头的请求
        target: 'http://localhost:3000', // 后端IP地址
        changeOrigin: true, //允许跨域
        rewrite: (path) => {
          console.log(path)
          const newPath = path.replace(/^\/api/, '')
          return newPath
        }
      }
    }
  }
})