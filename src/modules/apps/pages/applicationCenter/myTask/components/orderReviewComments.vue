<template>
  <div class="orderReviewComments">
    <el-drawer
      title="复核记录"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      size="50%"
      @close="closeDialog"
    >
      <div class="form">
        <el-timeline>
          <el-timeline-item
            placement="top"
            v-for="(item, index) in reviewCommentsList"
            :key="index"
            :icon="item.is_approved?'el-icon-check':'el-icon-close'"
            :type="item.is_approved?'success':'danger'"
            size="large"
            :timestamp="item.create_time"
          >
            <el-card>
              <div class="title">
                <b class="left">{{item.reviewer_name}}</b>
                <span>{{item.review_type===1?'手动复核':'自动复核'}}</span>
                <b :class="item.is_approved?'rightY':'rightN'">{{item.is_approved?'已完成':'复核失败'}}</b>
              </div>
              <div class="content">{{item.comments}}</div>
               <!----------------------------- 复核数据输出 ------------------------->
           <orderReviewOut v-if="is_check_data" :orderReviewOutData="{tableData:item.review_data_info}"></orderReviewOut>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onCancel">关闭</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myTask";
//引入复核数据输出
import orderReviewOut from "./orderReviewOut"
export default {
  name: "orderReviewComments",
  components: {
    orderReviewOut
  },
  props: {
    //相关所需参数
    reviewCommentDialogVisible: Boolean,
    reviewCommentsData: Object
  },
  data() {
    return {
      dialogVisible: this.reviewCommentDialogVisible,
      dialogLoading: false,
      //复核意见
      reviewCommentsList: []
    };
  },
  created() {
    this.getDataList(this.reviewCommentsData.ticket_step_id, this.reviewCommentsData.service_set_task_id);
  },
  methods: {
    //关闭时
    onCancel() {
      this.dialogVisible = false;
    },
    //关闭时
    closeDialog() {
      this.$emit("closeDialog");
    },
    //获取复核详情
    getDataList(ticket_step_id, service_set_task_id) {
      this.dialogLoading = true;
      requestMethod
        .taskReviewComments("get", ticket_step_id, service_set_task_id)
        .then(res => {
          if (res.code == 200) {
            this.reviewCommentsList = res.data.items;
            this.is_check_data=res.data.is_check_data;
            console.log("reviewCommentsList", this.reviewCommentsList);
          } else {
            this.$message.error(res.message);
          }
          this.dialogLoading = false;
        })
        .catch();
    }
  }
};
</script>

<style lang="less" scoped>
.orderReviewComments {
  .form {
    padding: 10px 30px;
    max-height: 600px;
    overflow: auto;
    .title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      .rightY {
        color: #67c23a;
      }
      .rightN {
        color: #f56c6c;
      }
    }
  }
}
</style>
