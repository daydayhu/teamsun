<template>
  <el-drawer
    title="用户规划"
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
        <el-form-item label="用户名" prop="conf_name"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.conf_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="conf_id"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.conf_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="主组"  prop="umask" :label-width="formLabelWidth">
           <el-select placeholder="请选择主组" v-model="theform.api_group_id" style="width:100%" @change='changeGroup'>
            <el-option
              v-for="list in groupList"
              :key="list.api_group_id"
              :label="list.group_name"
              :value="list.api_group_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组集"   :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.conf_set"
          ></el-input>
        </el-form-item>
        <el-form-item label="主目录"  :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            v-model="theform.conf_dir"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户说明"   :label-width="formLabelWidth">
          <el-input
            placeholder="请输入内容"
            type="textarea"
            v-model="theform.description"
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
    groupList: {
      type: Array
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
        node_canvas_uuid: "",
        conf_name: "",
        conf_id: null,
        conf_set: "",
        conf_dir: "",
        api_group_id:'',
        umask: "",
        description: ""
      },
      rules: {
        conf_name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        umask: [
          { required: true, message: "请选择主组", trigger: "change" }
        ],
        conf_id:[
          { required: true, message: "请输入用户id", trigger: "change" }
        ],
      },
      isToEdit:false,
    };
  },
  watch: {},
  mounted() {
    this.$on('childMethod', function (val) {
      this.theform=val;
      this.isToEdit=true;
    })
  },
  methods: {
    keepInRealTime(){
      if(this.isToEdit==true){ //编辑
        requestMethoduserProgram.editUser(this.theform).then(res => {
          this.alertMess(res)
        });
      }else{                   //创建
        requestMethoduserProgram.addUser(this.theform).then(res => {
          this.alertMess(res)
        });
      }

    },
    changeGroup(){
      for(var i =0;i<this.groupList.length;i++){
        if(this.groupList[i].api_group_id==this.theform.api_group_id){
          this.theform.umask=this.groupList[i].group_name
        }
      }
    },
    onSubmit(formName) {
      this.theform.app_id=parseInt(this.canvasObj.app_id);
      this.theform.ticket_id=parseInt(this.canvasObj.ticket_id);
      this.theform.node_canvas_uuid=this.canvasObj.service_uuid
      this.theform.node_set_id=this.operationSet
      this.$refs[formName].validate(valid => {
        if (valid) {
           this.theform.app_id=parseInt(this.canvasObj.app_id);
          this.theform.ticket_id=parseInt(this.canvasObj.ticket_id);
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
        node_canvas_uuid: "",
        conf_name: "",
        conf_id: null,
        conf_set: "",
        conf_dir: "",
        umask: "",
        description: ""
        },
        this.$emit('requireList');
        this.$emit('closeDialog');
        this.isToEdit=false
    },
    cancelFn() {
      this.theform= {
          app_id: 0,
        ticket_id: 0,
        node_canvas_uuid: "",
        conf_name: "",
        conf_id: null,
        conf_set: "",
        conf_dir: "",
        umask: "",
        description: ""
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
