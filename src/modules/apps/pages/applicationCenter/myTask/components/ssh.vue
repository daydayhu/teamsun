<template>
  <div class="orderTransfer">
    <el-dialog
      title="ssh"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      width="40%"
      @close="closeDialog"
    >
      <div class="form">
        <el-form id="sshForm" :model="sshForm" label-position="right" label-width="100px">
          <el-form-item label="云主机">
            <el-select id="app_ssh_dev" v-model="sshForm.dev" placeholder="请选择云主机">
              <el-option
                v-for="(item,index) in sshList"
                :key="index"
                :label="item.vm"
                :value="item.node_set_id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button id="app_ssh_onCancel" @click="closeDialog">取 消</el-button>
        <el-button id="app_ssh_onSubmit" type="primary" @click="onSubmit()">确 定</el-button>
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
    sshDialogVisible: Boolean,
    //相关所需参数
    sshData: Object
  },
  data() {
    return {
      //转单
      dialogVisible: this.sshDialogVisible,
      dialogLoading: false,
      sshForm: {
        dev: null
      },
      //ssh列表
      sshList: []
    };
  },
  created() {
    this.getsshList();
  },
  mounted() {},
  methods: {
    //取消转单时
    onCancel() {
      this.dialogVisible = false;
    },
    //关闭时
    closeDialog() {
      this.$emit("closeDialog");
    },
    //获取ssh列表
    getsshList() {
      let para = {
        node_set_id: this.sshData.node_set_id
      };
      requestMethod
        .taskVms("get", para)
        .then(res => {
          if (res.code == 200) {
            //当只有一个云主机时
            if (res.data.items.length === 1) {
              this.sshForm.dev = res.data.items[0].node_set_id;
              this.onSubmit();
            } else {
              //当多个云主机时：
              this.sshList = res.data.items;
            }
            console.log("sshList", this.sshList);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch();
    },
    //ssh提交
    onSubmit() {
      console.log("this.sshForm", this.sshForm);
      let para = {
        app_id:this.sshData.app_id,
        ticket_id: this.sshData.ticket_id,
        node_set_id: this.sshForm.dev,
      };
      this.dialogLoading = true;
      requestMethod
        .getsshUrl("get", para)
        .then(res => {
          if (res.code == 200) {
            //成功时
            let url = this.baseConfig.SSH_URL + "?ssh=" + res.data.ssh +"&location="+res.data.location;
            window.open(
              url,
              "Derek",
              "height=880,width=1040,status=no,toolbar=no,menubar=no,location=no"
            );
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
