<template>
  <el-drawer
    title="备份策略"
    :visible.sync="isVisible"
    :append-to-body="false"
    :modal-append-to-body="false"
    @closed ="cancelFn"
    size="35%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div style="width:90%;margin:0 auto;">
      <el-form ref="theform" :model="theform" :rules="rules" :label-position="labelPosition">
        <el-form-item label="主机名称" prop="target_hostname" :label-width="formLabelWidth">
          <el-select placeholder="请选择主机名称" v-model="theform.target_hostname" style="width:100%" @change="getnodeId">
            <el-option
              v-for="list in hostList"
              :key="list.hostname"
              :label="list.hostname"
              :value="list.hostname"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="备份类型"
          :label-width="formLabelWidth"
          class="ts-form-label ts-mt36"
          prop="backup_type"
        >
          <el-select placeholder="请选择备份类型" v-model="theform.backup_type" style="width:100%">
            <el-option
              v-for="list in backupTypeList"
              :key="list.value"
              :label="list.label"
              :value="list.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备份对象" :label-width="formLabelWidth" prop="backup_name">
          <el-input placeholder="请输入内容" v-model="theform.backup_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="备份策略" :label-width="formLabelWidth" prop="backup_policy">
          <el-select placeholder="请选择数备份策略" v-model="theform.backup_policy" style="width:100%">
            <el-option
              v-for="list in backupPolicyList"
              :key="list.value"
              :label="list.label"
              :value="list.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行时间" prop="backup_time" :label-width="formLabelWidth">
          <el-time-picker arrow-control placeholder="选择时间" v-model="theform.backup_time" value-format="yyyy-MM-dd HH:mm:ss"></el-time-picker>
        </el-form-item>
        <el-form-item label="落地目录" prop="backup_dir" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.backup_dir" clearable></el-input>
        </el-form-item>
        <el-form-item label="源日志模式" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.source_logging_mode" clearable></el-input>
        </el-form-item>
        <el-form-item label="源日志清理策略(周)" :label-width="formLabelWidth" prop="backup_days">
          <el-input placeholder="请输入内容" v-model="theform.backup_days" clearable></el-input>
        </el-form-item>
        <el-form-item label="本地文档治理策略(月)" prop="heal_policy" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.heal_policy" clearable></el-input>
        </el-form-item>
        <el-form-item label="归档日志清理策略" prop="log_policy" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.log_policy" clearable></el-input>
        </el-form-item>
        <el-form-item label="带库存保存期限(天)" :label-width="formLabelWidth" prop="hot_backup_days">
          <el-input-number v-model="theform.hot_backup_days" :min="1" label="描述文字"></el-input-number>
        </el-form-item>
      </el-form>

    </div>
     <div class="drawer_footer">
        <el-button @click="cancelFn()">取 消</el-button>
        <el-button
          type="primary"
          v-if='isToEdit==false'
          @click="onSubmit('theform',false)"
          :loading="submitLoading"
        >{{ submitLoading ? '提交中 ...' : '继续添加' }}</el-button>
        <el-button
          type="primary"
          @click="onSubmit('theform',true)"
          :loading="submitLoading"
        >{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
  </el-drawer>
</template>
<script>
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/theBackup.js";
export default {
  props: {
    isShow: {
      type: Boolean
    },
    canvasObj: {
      type: Object
    }
  },
  created() {},
  data() {
    return {
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "right",
      submitLoading: false,
      backupTypeList: [
        {
          value: 1,
          label: "数据库"
        },
        {
          value: 2,
          label: "应用程序"
        },
        {
          value: 3,
          label: "日志"
        },
        {
          value: 4,
          label: "数据文件"
        },
        {
          value: 5,
          label: "其他类型"
        }
      ],
      backupPolicyList: [
        {
          value: 1,
          label: "每天全备"
        },
        {
          value: 2,
          label: "每周全备"
        },
        {
          value: 3,
          label: "每天增"
        }
      ],
      theform: {
        app_id: null,
        ticket_id: null,
        target_node_id:null,
        target_hostname: "",
        canvas_uuid: "",
        backup_type: 1,
        backup_policy: 1,
        backup_days: 0,
        hot_backup_days: 0,
        backup_dir: "",
        heal_policy: "",
        log_policy: "",
        backup_name: "",
        backup_time: null,
        source_logging_mode:''
      },
      hostList: [],
      rules: {
        target_hostname: [
          { required: true, message: "请选择主机名称", trigger: "change" }
        ],
        backup_type: [ 
          { required: true, message: "请选择备份类型", trigger: "change" }
        ],
        backup_policy: [
          { required: true, message: "请选择备份对象", trigger: "change" }
        ],
        backup_days: [
          { required: true, message: "请填写时间", trigger: "change" }
        ],
        hot_backup_days: [
          { required: true, message: "请填写带库存保存时间", trigger: "change" }
        ],
        backup_dir: [
          { required: true, message: "请填写落地目录", trigger: "change" }
        ],
        heal_policy: [
          { required: true, message: "请填写治理策略", trigger: "change" }
        ],
        log_policy: [
          { required: true, message: "请填写日志清理", trigger: "change" }
        ],
        backup_name: [
          { required: true, message: "请填写备份对象", trigger: "change" }
        ],
        backup_time: [
          { required: true, message: "请填写备份时间", trigger: "change" }
        ]
      },
      isToEdit: false
    };
  },
  watch: {},
  mounted() {
    this.getHostList();
    this.$on("childMethod", function(val) {
      this.theform = val;
      this.theform.backup_type=val.backup_type.key;
      this.theform.backup_policy=val.backup_policy.key;
      this.isToEdit = true;
    });
    this.theform.canvas_uuid=this.canvasObj.service_uuid
    //this.theform.canvas_uuid = "EFCF2A8F-F381-4A1B-89AC-EECCE752CD96";
  },
  methods: {
    getnodeId(){
      for(var i=0;i<this.hostList.length;i++){
        if(this.hostList[i].hostname==this.theform.target_hostname){
          this.theform.target_node_id=this.hostList[i].node_id
        }
      }
    },
    keepInRealTime(isFlag) {
      if (this.isToEdit == true) {//编辑
        requestMethod.editBackup(this.theform.backup_id,this.theform).then(res => {
          this.alertMess(res,isFlag);
        });
      } else {//创建
        requestMethod.addBackup(this.theform).then(res => {
          this.alertMess(res,isFlag);
        });
      }
    },
    getHostList() {
      requestMethod
        .requireHostList(  //170,20
         this.canvasObj.app_id,this.canvasObj.ticket_id
        )
        .then(res => {
          if (res.code == 200) {
            this.hostList = res.data.items;
          } else {
            this.$notify.error({
              title: "失败",
              message: `${res.message}`,
              position: "bottom-right",
              duration: 3000
            });
          }
        });
    },
    onSubmit(formName,isFlag) { //isFlag 为true确定，为false继续添加
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.theform.app_id=parseInt(this.canvasObj.app_id);
          this.theform.ticket_id=parseInt(this.canvasObj.ticket_id);
          this.keepInRealTime(isFlag);
        } else {
          return false;
        }
      });
    },
    alertMess(res,isFlag) {
      if (res.code == 200) {
        this.$notify.success({
          title: "成功",
          message: `${res.message}`,
          position: "bottom-right",
          duration: 3000
        });
        this.$emit('requireList');
        if(isFlag){
          this.$emit("closeDialog");
        }else{
          this.theform={
            app_id: null,
            ticket_id: null,
            target_node_id:null,
            target_hostname: "",
            canvas_uuid: this.canvasObj.service_uuid,
            backup_type: 1,
            backup_policy: 1,
            backup_days: 0,
            hot_backup_days: 0,
            backup_dir: "",
            heal_policy: "",
            log_policy: "",
            backup_name: "",
            backup_time: null,
            source_logging_mode:''
          }
        }
        this.isToEdit = false;
      } else {
        this.$notify.error({
          title: "失败",
          message: `${res.message}`,
          position: "bottom-right",
          duration: 3000
        });
      }

    },
    cancelFn() {
      this.isToEdit = false;
      this.theform={
        app_id: null,
        ticket_id: null,
        target_node_id:null,
        target_hostname: "",
        canvas_uuid: "",
        backup_type: 1,
        backup_policy: 1,
        backup_days: 0,
        hot_backup_days: 0,
        backup_dir: "",
        heal_policy: "",
        source_logging_mode:'',
        log_policy: "",
        backup_name: "",
        backup_time: null
      }
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less" scoped>
// 可公共form底部操作按钮
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
