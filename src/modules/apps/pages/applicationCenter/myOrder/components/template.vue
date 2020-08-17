<template>
  <div class="orderTemplate">
    <el-dialog
      title="生成应用模板"
      :visible.sync="dialogVisible"
      v-loading="dialogLoading"
      width="40%"
      @close="closeDialog"
    >
      <div class="form">
        <el-form :model="tempForm" label-position="right" label-width="100px">
          <el-form-item label="模板名称">
            <el-input id="app_orderTemplate_name"  placeholder="请输入内容" v-model="tempForm.template_name"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input id="app_orderTemplate_comments" type="textarea" :rows="6" maxlength="200" show-word-limit placeholder="请输入内容" v-model="tempForm.description"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button id="app_orderTemplate_onCancel" @click="onCancel()">取 消</el-button>
        <el-button id="app_orderTemplate_onSubmit" type="primary" @click="onSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myOrder";
export default {
  name: "orderTemplate",
  components: {},
  props: {
    //是否显示
    templateDialogVisible: Boolean,
    //相关所需参数
    templateData:{
      type:Object,
    }
  },
  data() {
    return {
      dialogVisible: this.templateDialogVisible,
      dialogLoading: false,
      tempForm: {
        app_id:null,
        ticket_id:null,
        template_name: "",
        description: "",
      }
    };
  },
  created() {
    console.log("tamp",this.templateData)
    this.tempForm.app_id=this.templateData.app_id;
    this.tempForm.ticket_id=this.templateData.ticket_id
  },
  methods: {
    //关闭时
    closeDialog() {
      this.$emit("closeDialog");
    },
    //取消时
    onCancel() {
      this.dialogVisible = false;
    },
    //提交-orderTemplate
    onSubmit() {
      console.log("para", this.tempForm);
      this.dialogLoading = true;
      requestMethod
        .orderTemplate("post", this.tempForm)
        .then(res => {
          this.dialogLoading = true;
          if (res.code == 200) {
            this.$message.success(res.message);
            //复核成功时
            this.$emit("handleSuccess");
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
.orderTemplate {

}
</style>
