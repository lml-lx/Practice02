<template>
    <!-- 侧边容器 -->
    <div class="sidebar">
        <!-- 顶部标题 -->
        <div class="sidebar-header">
            <el-icon color="#409EFF" size="35">
                <Shop />
            </el-icon>
            <h2>品购优选<br>后台</h2>
        </div>

        <!-- 导航菜单 -->
        <el-menu :default-active="activeMenu" class="sidebar-menu" background-color="#fff" text-color="#333"
            active-text-color="#409EFF" router>
            <el-menu-item index="/">
                <template #icon><el-icon>
                        <House />
                    </el-icon></template>
                <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/user">
                <template #icon><el-icon>
                        <Ticket />
                    </el-icon></template>
                <span>用户管理</span>
            </el-menu-item>

            <el-menu-item index="/category">
                <template #icon><el-icon>
                        <QuestionFilled />
                    </el-icon></template>
                <span>分类管理</span>
            </el-menu-item>
            <el-menu-item index="/goods">
                <template #icon><el-icon>
                        <Goods />
                    </el-icon></template>
                <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="/order">
                <template #icon><el-icon>
                        <Document />
                    </el-icon></template>
                <span>订单管理</span>
                <!-- 角标 -->
                <!-- <el-badge value="6" class="badge"></el-badge> -->
            </el-menu-item>
            <!-- 当前激活菜单 -->
            <el-menu-item index="/comment" class="active-item">
                <template #icon><el-icon>
                        <DataAnalysis />
                    </el-icon></template>
                <span>评论管理</span>
            </el-menu-item>
<!-- 
            <el-menu-item index="/app">
                <template #icon><el-icon>
                        <Connection />
                    </el-icon></template>
                <span>售后处理</span>
            </el-menu-item> -->
            <!-- <el-menu-item index="/setting">
                <template #icon><el-icon>
                        <Setting />
                    </el-icon></template>
                <span>设置</span>
            </el-menu-item>
 -->

        </el-menu>

        <!-- 底部客服区域 -->
        <div class="sidebar-footer">
            <div class="service-illust"></div>
      <!--       <el-button type="primary" class="service-btn">
                <el-icon>
                    <ChatDotRound />
                </el-icon>
                在线支持
            </el-button> -->
            <el-image style="width: 100px; height: 100px" src="https://s1.aigei.com/prevfiles/0d5d386c2f5f45c98a312a1239165d2f.gif?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:1vvl_lWlsN9n1UDCSn0k-hKP9VQ=" fit="fit" />
            <div class="logout" @click="handleLogout" v-if="userStore.isLoggedIn">
                <el-icon>
                    <DArrowLeft />
                </el-icon>
                <span>退出登录</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
// 导入图标
import {
    ShoppingCart, House, Document, Goods, DataAnalysis, Ticket,
    Connection, Shop, PriceTag, Setting, QuestionFilled, ChatDotRound, DArrowLeft
} from '@element-plus/icons-vue'

const router = useRouter()
// 当前激活菜单，和路由index对应
const activeMenu = ref('/')

// 退出登录
const handleLogout = () => {
    userStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.sidebar {
    width: 200px;
    height: 100%;
    background: #ffffff;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 30px 24px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar-header h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.sidebar-menu {
    flex: 1;
    border-right: none;
}

:deep(.el-menu-item) {
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    gap: 10px;
}

:deep(.el-menu-item.is-active) {
    background-color: #ecf5ff !important;
    border-right: 4px solid #409EFF;
}

.badge {
    margin-left: auto;
}

.sidebar-footer {
    padding: 20px 24px;
    border-top: 1px solid #eee;
}

.service-illust {
    width: 100%;
    height: 190px;
    background: url('') no-repeat center;
    background-size: contain;
    margin-bottom: 16px;
}

.service-btn {
    width: 100%;
    height: 52px;
    font-size: 16px;
    margin-bottom: 20px;
}

.logout {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #666;
    cursor: pointer;
    padding: 10px;
}

.logout:hover {
    color: #409EFF;
}
</style>