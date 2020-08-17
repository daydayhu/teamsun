<template>
  <div class="orderReview">
    <el-drawer
      title="提交复核"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      size="50%"
      @close="closeDialog"
    >
      <div class="form">
        <el-form :model="reviewForm" label-position="right" label-width="100px">

            <!----------------------------- 复核数据输出 ------------------------->
           <orderReviewOut v-if="is_check_data" :orderReviewOutData="orderReviewOutData"></orderReviewOut>
           <br>

          <el-form-item label="复核结果">
            <el-radio-group
              id="app_orderReview_is_approved"
              v-model="reviewForm.is_approved"
              size="small"
            >
              <el-radio-button :label="true">同意</el-radio-button>
              <el-radio-button :label="false">不同意</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="复核意见">
            <el-input
              id="app_orderReview_comments"
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
              maxlength="200"
              show-word-limit
              v-model="reviewForm.comments"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawer_footer">
        <el-button id="app_orderReview_onCancel" @click="onCancel()">取 消</el-button>
        <el-button id="app_orderReview_onSubmit" type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myTask";
import { getSession } from "@/commons/js/searchFresh.js";
//引入复核数据输出
import orderReviewOut from "./orderReviewOut"
export default {
  name: "orderReview",
  components: {
    orderReviewOut
  },
  props: {
    //是否显示
    reviewDialogVisible: Boolean,
    //相关所需参数
    reviewData: Object
  },
  data() {
    return {
      //复核
      dialogVisible: this.reviewDialogVisible,
      dialogLoading: false,
      //数据输出
      orderReviewOutData:{},
      reviewForm: {
        review_data: "",
        comments: "",
        is_approved: true
      },
      //
      is_check_data:false,
    };
  },
  mounted() {
    this.getDataList(this.reviewData.service_set_task_id)
  },
  methods: {
    //关闭时
    closeDialog() {
      this.$emit("closeDialog");
    },
    //取消复核时
    onCancel() {
      this.dialogVisible = false;
    },
    //获取复核输出列表
    getDataList(service_set_task_id) {
      requestMethod.getReviewCommentsOut('get', service_set_task_id).then(res => {
          if (res.code == 200) {
            this.is_check_data=res.data.is_check_data
            this.orderReviewOutData={
              tableData:res.data.review_data,
              review_data_id:res.data.review_data_id
            }
            console.log("tableData", this.orderReviewOutData)
          } else {
            this.$message.error(res.message)
          }
        })
        .catch()
    },
    //复核提交
    onSubmit() {
      let para = {
        service_set_task_id: this.reviewData.service_set_task_id,
        ticket_step_id: this.reviewData.ticket_step_id,
        comments: this.reviewForm.comments,
        is_approved: this.reviewForm.is_approved,
        review_data_ids: this.orderReviewOutData.review_data_id,
        current_state: this.reviewData.current_state,
        operate: this.reviewData.operate
      };
      this.dialogLoading = true;
      requestMethod
        .taskReview("post", para)
        .then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            //复核成功时
            this.$emit("handleSuccess");
            // this.$emit(
            //   "getDataList",
            //   getSession("searchFresh").keyword,
            //   getSession("searchFresh").pageNo,
            //   getSession("searchFresh").pageSize
            // );
          } else {
            this.$message.error(res.message);
          }
          this.$emit("closeDialog");
        })
        .catch();
    }
  }
};
</script>

<style lang="less" scoped>
.orderReview {
  .form {
    padding: 0px 24px;
  }
  /deep/.el-radio-button__inner {
    width: 120px;
  }
}
</style>
