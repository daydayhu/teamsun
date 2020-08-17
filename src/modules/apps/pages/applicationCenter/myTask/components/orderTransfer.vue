<template>
  <div class="orderTransfer">
    <el-dialog
      title="转单处理"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      width="40%"
      @close="closeDialog"
    >
      <div class="form">
        <el-form id="resendForm" :model="resendForm" label-position="right" label-width="140px">
          <el-form-item label="产品">{{resendForm.node_name}}</el-form-item>
          <el-form-item label="操作">{{resendForm.node_set_name}}</el-form-item>
          <el-form-item :label="resendForm.user.label">
            <el-select
              id="app_orderTransfer_user"
              v-model="resendForm.user.key"
              placeholder="请选择转单人"
            >
              <el-option
                v-for="(item,index) in resendUser"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button id="app_orderTransfer_onCancel" @click="onCancel()">取 消</el-button>
        <el-button id="app_orderTransfer_onSubmit" type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myTask";
export default {
  name: "orderTransfer",
  components: {},
  props: {
    //是否显示
    resendDialogVisible: Boolean,
    //相关所需参数
    transferData: Object
  },
  data() {
    return {
      //转单
      dialogVisible: this.resendDialogVisible,
      dialogLoading: false,
      resendForm: {
        node_name: "主产品",
        node_set_name: "申请虚拟机",
        user: {
          key: null,
          label: ""
        }
      },
      //转单人列表
      resendUser: []
    };
  },
  mounted() {
    if (this.resendDialogVisible) {
      //获取转单人列表
      this.getResendUser();
      //设置转单表单数据
      this.resendForm = {
        node_name: this.transferData.node_name,
        node_set_name: this.transferData.node_set_name,
        user: {
          key: null,
          label: this.transferData.userLabel
        }
      };
    }
  },
  methods: {
    //取消转单时
    onCancel() {
      this.dialogVisible = false;
    },
    //关闭时
    closeDialog() {
      this.$emit("closeDialog");
    },
    //获取转单人列表
    getResendUser() {
      let para = {
        group_id: this.transferData.group_id
      };
      requestMethod
        .taskTransferUsers("get", para)
        .then(res => {
          if (res.code == 200) {
            this.resendUser = res.data.items[0].users;
            console.log("taskTransferUsers", this.resendUser);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch();
    },

    //转单提交
    onSubmit() {
      console.log("this.resendForm", this.resendForm);
      if (this.resendForm.user.key == null) {
        this.$message.warning("请选择转单人");
        return;
      }
      let para;
      if (this.transferData.step == 3) {
        para = {
          app_id: this.transferData.app_id,
          ticket_id: this.transferData.ticket_id,
          //  instance_id: this.transferData.instance_id,
          node_id: this.transferData.node_id,
          set_id: this.transferData.set_id,
          body: {
            transfer_to: this.resendForm.user.key,
            ticket_step_id: this.transferData.ticket_step_id
            // current_state: this.transferData.current_state,
            //  operate: this.transferData.operate,
            //  is_delivery: is_delivery
          }
        };
      } else {
        para = {
          app_id: this.transferData.app_id,
          ticket_id: this.transferData.ticket_id,
          // instance_id: this.transferData.instance_id,
          node_id: this.transferData.node_id,
          set_id: this.transferData.set_id,
          body: {
            transfer_to: this.resendForm.user.key,
            ticket_step_id: this.transferData.ticket_step_id,
            current_state: this.transferData.current_state,
            operate: this.transferData.operate,
            is_delivery: this.transferData.is_delivery
          }
        };
      }
      //     }
      console.log("para", para);
      this.dialogLoading = true;
      requestMethod
        .taskTransfer("put", para)
        .then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            //转单成功时
            this.$emit("handleSuccess");
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
.orderTransfer {
  .form {
    display: flex;
    justify-content: center;
    padding: 0px 30px;
  }
}
</style>
