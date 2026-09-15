<template>
    <div class="box">
        <div class="box1">
            <div style="width: 50%;">
                <el-input v-model="input" clearable :clear-icon="CloseBold" placeholder="请输入评价内容或其他关键字搜索..."
                    style="max-width: 600px" @clear="handleClear" @keyup.enter="selectComment()">
                    <template #append>
                        <el-button :icon="Search" @click="selectComment()" />
                    </template>
                </el-input>
            </div>
        </div>


        <el-table :data="showtable" style="width: 100% ">
            <el-table-column label="评价ID" prop="comment_id" width="130px"></el-table-column>
            <el-table-column label="评论用户" prop="user_name" width="130px"></el-table-column>
            <el-table-column label="商品ID" prop="good_id" width="130px"></el-table-column>
            <el-table-column label="星级" width="280px">
                <template #default="scope">
                    <el-rate v-model="scope.row.star" disabled show-score text-color="#ff9900"
                        score-template="{value} points" />
                </template>
            </el-table-column>
            <el-table-column label="评价内容" prop="content" show-overflow-tooltip></el-table-column>
            <el-table-column label="是否已回复">
                <template #default="scope">
                    <el-tag :type="scope.row.is_reply ? 'primary' : 'warning'">
                        <span>
                            {{ scope.row.is_reply ? '已回复' : '待回复' }}
                        </span>
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="openReply(scope.row)" v-if="!scope.row.is_reply" plain>
                        回复
                    </el-button>
                    <el-button type="info" @click="openViewReply(scope.row)" v-if="scope.row.is_reply" plain>
                        查看回复
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <!-- 回复评论弹窗 -->
        <el-dialog v-model="replyDialog" title="回复用户评价" width="500px">
            <el-form label-width="80px">
                <el-form-item label="评论用户">
                    <el-input v-model="currentComment.user_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户评价">
                    <el-input v-model="currentComment.content" disabled type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="我的回复">
                    <el-input v-model="replyContent" type="textarea" :rows="5" placeholder="请输入回复内容"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="replyDialog = false">取消</el-button>
                <el-button type="primary" @click="submitReply">提交回复</el-button>
            </template>
        </el-dialog>

        <!-- 查看回复弹窗（新增评论用户、回复管理员字段） -->
        <el-dialog v-model="viewDialog" title="回复详情" width="520px">
            <el-form label-width="100px">
                <el-form-item label="评论用户">
                    <el-input v-model="viewComment.user_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户评价内容">
                    <el-input v-model="viewComment.content" disabled type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-divider />
                <el-form-item label="回复管理员">
                    <el-input v-model="viewReply.admin_name" disabled></el-input>
                </el-form-item>
                <el-form-item label="管理员回复">
                    <el-input v-model="viewReply.reply_content" disabled type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="回复时间">
                    <el-input v-model="viewReply.reply_time" disabled></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="viewDialog = false">关闭</el-button>
            </template>
        </el-dialog>
        <div class="box4">
            <div class="example-pagination-block">
                <el-pagination size="large" background layout="prev, pager, next"
                    :total="Math.ceil(total / showNum) * 10" v-model:current-page="pageIndex" class="mt-4"
                    @change="getUser()" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, renderSlot } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { CloseBold } from '@element-plus/icons-vue'
import request from '../utils/request'
import { useUserStore } from '../stores/user';
import dayjs from 'dayjs'

const userStore = useUserStore()
// 评论列表
const commentList = ref([])
// 回复弹窗
const replyDialog = ref(false)
const currentComment = ref({})
const replyContent = ref('')
// 查看回复弹窗
const viewDialog = ref(false)
const viewComment = ref({})
const viewReply = ref({})

// 获取全部评论
const getCommentList = async () => {
    const res = await request.get('/getCommentList',{
        params:{
            pageIndex: pageIndex.value,
            showNum: showNum.value
        }
    })
    if (res.code === 200) {
        total.value = res.data.total
        commentList.value = res.data.tableData
        showtable.value = commentList.value
    }
}

// 打开回复弹窗
const openReply = (row) => {
    currentComment.value = row
    replyContent.value = ''
    replyDialog.value = true
}

// 提交回复
const submitReply = async (user_id) => {
    if (!replyContent.value.trim()) {
        return ElMessage.warning('请输入回复内容')
    }
    const res = await request.post('/replyComment', {
        comment_id: currentComment.value.comment_id,
        admin_id: userStore.User.user_id, // 实际项目从登录token获取当前登录管理员ID
        reply_content: replyContent.value,
        user_id: currentComment.value.user_id
    })
    if (res.code === 200) {
        ElMessage.success('回复成功')
        replyDialog.value = false
        getCommentList()
    }
}

// 打开查看回复弹窗
const openViewReply = async (row) => {
    viewComment.value = row
    const res = await request.get('/getReplyByCommentId', {
        params: { comment_id: row.comment_id }
    })
    if (res.code === 200 && res.data.length > 0) {
        viewReply.value = res.data[0]
        viewReply.value.reply_time = dayjs(viewReply.value.reply_time).format('YYYY-MM-DD')
        viewDialog.value = true
    }
}
const input = ref()
const showtable = ref()
const selectComment = () => {
    showtable.value = commentList.value.filter(item => {
        return item.content.includes(input.value)
    })
}
const handleClear = () => {
    selectComment()
}
const pageIndex = ref(1)
const showNum = ref(10)
const total = ref(0)

const emit = defineEmits(['page'])
onMounted(() => {
    getCommentList()
    emit('page', 8)
})

</script>
<style scoped>
.box {
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: start;
}
.box1 {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.box4 {
    width: 100%;
    padding-top: 40px;
    padding-left: 35%;
}
</style>