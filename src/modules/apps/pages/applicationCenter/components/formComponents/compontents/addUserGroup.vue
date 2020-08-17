<template>
  <el-drawer
    title="用户组"
    :visible.sync="isVisible"
    :append-to-body="false"
    :modal-append-to-body="false"
    @closed="cancelFn"
    size="35%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div style="width:90%;margin:0 auto;">
      <el-form ref="theform" :model="theform" :rules="rules" :label-position="labelPosition">
        <el-form-item label="组名" prop="group_name"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.group_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="组ID" prop="group_id"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.group_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="组说明"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            ype="textarea"
            v-model="theform.remarks"
          ></el-input>
        </el-form-item>
      </el-form>

    </div>
    <div class="drawer_footer">
        <el-button @click="cancelFn()">取 消</el-button>
        <el-button
          type="primary"
          @click="onSubmit('theform')"
          :loading="submitLoading"
        >{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
  </el-drawer>
</template>
<script>
import * as requestMethoduserProgram from "@/modules/apps/api/serviceCatalog/openstack/userProgram.js";
export default {
  props: {
    isShow: {
      type: Boolean
    },
    canvasObj:{
      type:Object
    },
    operationSet:{
      type:Number
    },
  },
  created() {},
  data() {
    return {
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "right",
      submitLoading: false,
      theform: {
        app_id: 0,
        ticket_id: 0,
        node_canvas_uuid: null,
        group_name: "",
        group_id: null,
        remarks: "",
        node_set_id:null
      },
      rules: {
        group_name: [{ required: true, message: "请输入组名", trigger: "blur" }],
        group_id: [{ required: true, message: "请输入组ID", trigger: "blur" }]
      },
      isToEdit:false,
    };
  },
  watch: {},
  mounted() {
    this.$on('childMethod', function (val) {
      this.theform=val;
      delete this.theform.host_name;
      this.isToEdit=true;
    })
  },
  methods: {
    keepInRealTime(){
      if(this.isToEdit==true){ //编辑
        requestMethoduserProgram.editGroup(this.theform).then(res => {
          this.alertMess(res)
        });
      }else{                   //创建
        requestMethoduserProgram.addGroup(this.theform).then(res => {
          this.alertMess(res)
        });
      }

    },
    onSubmit(formName) {
      this.theform.app_id=parseInt(this.canvasObj.app_id);
      this.theform.ticket_id=parseInt(this.canvasObj.ticket_id);
      this.theform.node_canvas_uuid=this.canvasObj.service_uuid
      this.theform.node_set_id=this.operationSet
      this.$refs[formName].validate(valid => {
        if (valid) {
           this.theform.app_id=this.canvasObj.app_id;
          this.theform.ticket_id=this.canvasObj.ticket_id;
          this.keepInRealTime()
        } else {
          return false;
        }
      });
    },
    alertMess(res){
      if(res.code==200){
          this.$notify.success({
            title: '成功',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
        }else{
          this.$notify.error({
            title: '失败',
            message: `${res.message}`,
            position: 'bottom-right',
            duration:3000
          });
        }
        this.theform= {
          app_id: 0,
          ticket_id: 0,
          node_canvas_uuid: null,
          group_name: "",
          group_id: null,
          remarks: "",
          node_set_id:null
        },
        this.$emit('requireList');
        this.$emit('closeDialog');
        this.isToEdit=false
    },
    cancelFn() {
      this.theform= {
          app_id: 0,
          ticket_id: 0,
          node_canvas_uuid: null,
          group_name: "",
          group_id: null,
          remarks: "",
          node_set_id:null
        },
        this.isToEdit=false;
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-input-group__append {
  background-color: none;
  color: #909399;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  border-left: 0px;
  padding: 0px 5px;
  width: 1px;
  white-space: nowrap;
}
/deep/.el-table th，/deep/.el-table tr {
  height: 38px;
}
</style>
