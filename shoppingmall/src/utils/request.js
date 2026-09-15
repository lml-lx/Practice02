import axios from 'axios'

// 创建实例
const request = axios.create({
    baseURL: '/api', // 所有请求自动加上api前缀
    timeout: 10000
})

// 请求拦截器（发送请求自动携带token）
request.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// 响应拦截器（统一处理错误）
request.interceptors.response.use(
    response => response.data,
    error => {
        console.log(error);
    }
)

export default request