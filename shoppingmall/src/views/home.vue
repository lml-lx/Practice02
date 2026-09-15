<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-06-16 09:01:49
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-07-01 00:04:29
 * @FilePath: \VUE\代码\shixun\shoppingmall\src\views\home.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="box1">
        <!--销量 -->
        <div class="sales-card" v-for="item in data" :key="data.index">
            <!-- 标题栏 -->
            <div class="card-header">
                <h2 class="title">{{ item.title }}</h2>
                <el-tag size="small" effect="light">今日</el-tag>
            </div>

            <!-- 今日销量 0 -->
            <div class="today-sales">{{ item.today }}</div>

            <!-- 昨日 & 涨幅 -->
            <div class="compare-row">
                <span class="yesterday">昨日 {{ item.yesterday }}</span>
                <span
                    :class="{ dod_up: (item.today - item.yesterday) / item.yesterday > 0, dod_down: (item.today - item.yesterday) / item.yesterday <= 0 }">
                    涨幅 <span v-if="item.yesterday === 0 && item.today === 0"> 0</span>
                    <span v-else-if="item.yesterday === 0">--</span>
                    <span v-else> {{ ((Number(item.today)  - Number(item.yesterday)) /
                       Number(item.yesterday)  * 100).toFixed(2) }}</span>
                    %
                    <el-icon v-if="(item.today - item.yesterday) / item.yesterday > 0">
                        <Top />
                    </el-icon>
                    <el-icon v-if="(item.today - item.yesterday) / item.yesterday < 0">
                        <Bottom />
                    </el-icon>
                </span>
            </div>

            <!-- 月度销量 -->
            <div class="month-row">
                <span class="month-label">本月{{ item.title }}</span>
                <span class="month-value">{{ item.month }}</span>
            </div>
        </div>

    </div>
    <div class="box2">
        <v-chart :option="chart1" auto-resize style="width:100%;height:300px;" />
    </div>
    <div class="box3">
        <div class="box4">
            <h2 style="margin-top: 30px;">用户类型分布</h2>
            <v-chart :option="chartOption" auto-resize
                style="width:100%;height:310px;transform:scale(0.8);transform-origin:center; " />
        </div>
        <div class="box5">
            <h2 style="margin-top: 30px;">商品库存</h2>
            <v-chart :option="chartOption2" auto-resize style="width:100%;height:310px;" />
        </div>
    </div>

</template>
<script setup>
import request from '../utils/request';
import { ElMessage } from 'element-plus';
import { ref, reactive } from "vue"
import { ArrowDown, Top, Bottom } from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
// 1. 导入需要的图表类型
import { BarChart, PieChart, LineChart } from 'echarts/charts'
// 2. 导入所有用到的组件
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent, // 图例
    ToolboxComponent // 工具箱
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue';
// 一次性全部注册
use([
    BarChart,
    PieChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    ToolboxComponent,
    CanvasRenderer,
    LineChart
])

const chartOption = computed(() => {
    return {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '2%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: userNum.value
            }
        ]
    }
});
const chartOption2 = computed(() => {
    return {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: goodNames.value
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: stock.value,
                type: 'line',
                areaStyle: {}
            }
        ]
    }
});
const chart1 = computed(() => {
    return {
        title: {
            text: '各类别销量'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['昨日', '今日']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: catName.value
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '昨日',
                type: 'line',

                data: yesterdaySales.value
            },
            {
                name: '今日',
                type: 'line',

                data: todaySale.value
            }
        ]
    }
});
//今日，昨日,本月的渲染所需要的所有数据
const data = ref([])
//获取今日，昨日,本月的商品数量和订单数量

const getData1 = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showOrderPart')
        if (reslut.code === 200) {
            // ElMessage.success("数据获取成功")
            /*  console.log(reslut.data.goods);
             console.log(reslut.data.order); */
            data.value.push(reslut.data.goods)
            data.value.push(reslut.data.order)
            console.log(data.value[0].title);

        } else {
            // ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
//今日,昨日，本月新增用户

const getData2 = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showUserPart')
        if (reslut.code === 200) {
            // ElMessage.success("数据获取成功")
            /*  console.log(reslut.data.goods);
             console.log(reslut.data.order); */
            data.value.push(reslut.data.adduser)
        } else {
            // ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
//今日，昨日，本月商品收藏量
const getData3 = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showGoodPart')
        if (reslut.code === 200) {
            ElMessage.success("数据获取成功")
            /*  console.log(reslut.data.goods);
             console.log(reslut.data.order); */
            data.value.push(reslut.data.collect)
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
// 各类别今日，昨日销量
const catName = ref([])
const yesterdaySales = ref([])
const todaySale = ref([])

const getCategorySale = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showCategorySale')
        if (reslut.code === 200) {
            // ElMessage.success("数据获取成功")
            // console.log(reslut.data.catName);
            // console.log(reslut.data.yesterdaySales);
            catName.value = reslut.data.catName
            yesterdaySales.value = reslut.data.yesterdaySales
            todaySale.value = reslut.data.todaySale
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
const goodNames = ref([])
const stock = ref([])
const getGoodsStock = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showGoodsStock')
        if (reslut.code === 200) {
            // ElMessage.success("数据获取成功")
            goodNames.value = reslut.data.goodNames
            stock.value = reslut.data.stock

        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
const userNum = ref([])
const getUserNum = async () => {
    try {
        //调用后端注册接口
        //注册是post请求，请求体为json格式
        const reslut = await request.get('/showUserNum')
        if (reslut.code === 200) {
            // ElMessage.success("数据获取成功")
            userNum.value = reslut.data.userNum
        } else {
            ElMessage.error(reslut.message || "数据获取失败")
        }
    } catch (error) {
        console.log('数据获取出错：', error);
        ElMessage.error('数据获取失败,请稍后再试')
    }
}
const emit = defineEmits(['page'])
onMounted(() => {
    emit('page', 1)
    getData1()
    getData2()
    getData3()
    getCategorySale()
    getGoodsStock()
    getUserNum()
})
</script>
<style scoped>
.box1 {
    display: flex;
    justify-content: space-between;
}

.sales-card {
    /* 固定卡片尺寸 */
    width: 300px;
    height: 180px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 16px;
    padding: 12px 16px;
    font-family: system-ui, -apple-system, sans-serif;
    /* 纵向自动分配空间，防止内容挤压溢出 */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title {
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    color: #333;
}

.today-sales {
    font-size: 48px;
    font-weight: 500;
    line-height: 1;
}

.compare-row {
    display: flex;
    align-items: center;
    gap: 20px;
    font-size: 16px;
}

.yesterday {
    color: #444;
}

.dod_down {
    color: #c03127;
    display: flex;
    align-items: center;
    gap: 4px;
}

.dod_up {
    color: #27c066;
    display: flex;
    align-items: center;
    gap: 4px;
}

.month-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
    padding-top: 6px;
    border-top: 1px solid #e4e7ed;
}

.box2 {
    width: 100%;
    height: 300px;
    background: #ffffff;
    margin-top: 25px;
}

.box3 {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.box4 {
    width: 35%;
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ffffff;


}

.box5 {
    width: 63%;
    margin-top: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #ffffff;
}
</style>