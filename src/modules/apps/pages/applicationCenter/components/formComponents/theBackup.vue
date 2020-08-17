<template>
  <div class="content">
    <el-collapse v-model="activeNames" style="padding:15px 20px;">
        <el-collapse-item name="1" v-if="baseInfo.indexOf(phaseState)>-1 || (phaseState=='2' && baseInfo.indexOf('1')>-1) || (phaseState=='4' && baseInfo.indexOf('3')>-1)">
          <template slot="title">
            <div class="formTit">
              基本信息
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="target_hostname" label="主机名称"  width="180"> </el-table-column>
                <el-table-column label="备份类型"  width="120">
                  <template slot-scope="scope">
                      <span v-if="scope.row.backup_type!=undefined">{{ scope.row.backup_type.value }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="backup_name" label="备份对象"  width="120"> </el-table-column>
                <el-table-column  label="备份策略" > 
                   <template slot-scope="scope">
                      <span v-if="scope.row.backup_policy!=undefined">{{ scope.row.backup_policy.value }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="backup_time" label="执行时间"  width="100"> </el-table-column>
                <el-table-column prop="backup_dir" label="源日志清理策略(周)"  width="180"> </el-table-column>
                <el-table-column prop="backup_days" label="保存期限"  width="80"> </el-table-column>
                <el-table-column prop="heal_policy" label="本地备份文件治理策略(月)"> </el-table-column>
                <el-table-column prop="log_policy" label="归档日志清理策略" > </el-table-column>
                <el-table-column prop="source_logging_mode" label="源日志模式" > </el-table-column>
                <el-table-column prop="hot_backup_days" label="带库存保存期限(天)"  width="150"> </el-table-column>
                <el-table-column label="操作" width="120">
                     <template slot-scope="scope">
                      <el-button v-if="phaseState!='2' && phaseState!='4' && isEditable==true" @click="editBackup(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button @click="deleteBackup(scope.row)" v-if="phaseState!='2' && phaseState!='4' && isEditable==true" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div class="createBox" @click='openDrawer' v-if="phaseState!='2' && phaseState!='4' && isEditable==true"><i class='el-icon-circle-plus'></i>添加</div>
        </el-collapse-item>
    </el-collapse>
    <addBackup
      ref="addBackup"
      v-if="isShow"
      :is-show="isShow"
      :canvasObj='canvasObj'
      @closeDialog="closeDialog"
      @requireList="getBackupList"
    ></addBackup>
  </div>
</template>
<script>
import * as requestMethodBackup from "@/modules/apps/api/serviceCatalog/openstack/theBackup.js";
import addBackup from "../formComponents/compontents/addBackup";
export default {
  name: "theBackup",
  props: {
    phaseState: {
      type: String
    },
    canvasObj:{
      type:Object
    },
    isEditData:{
      type:Object
    },
    isEditable:{
      type:Boolean
    }
  },
  data() {
    return {
      tableData: [],
       activeNames:'',
       isShow: false,
       baseInfo:[]
    };
  },
  mounted() {
    if (typeof this.isEditData != 'object') {
           var thedata=JSON.parse(this.isEditData)
    }else{
      var thedata=this.isEditData
    }
    if(JSON.stringify(thedata) == "{}"){
      thedata.base_info=[1,3,5];
    }
    this.baseInfo=thedata.base_info.map(String);
    //this.baseInfo=['1','5','3'];
    this.getBackupList();
  },
  watch: {
  },
  methods: {
    forComponentContent() {
      var obj={
        flag:true,
        mess:""
      }
      return obj
    },
    editBackup(val){
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.addBackup.$emit('childMethod',val);
      });
    },
    deleteBackup(val){
      this.$confirm(`确定删除${val.target_hostname}吗？该操作不可恢复`, "提示", {
        type: "warning"
      }).then(() => {
        requestMethodBackup.deleteBackup(val.backup_id).then(res=>{
          if(res.code==200){
            this.$notify.success({
              title: '成功',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
            this.getBackupList()
          }else{
            this.$notify.error({
              title: '失败',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
          }
        })
      }).catch(() => {});
    },
   getBackupList(){
      var obj={canvas_uuid:this.canvasObj.service_uuid}
      //var obj={canvas_uuid:'EFCF2A8F-F381-4A1B-89AC-EECCE752CD96'}
      requestMethodBackup.requireBackupList(obj).then(res=>{
        if(res.code==200){
           this.tableData=res.data.items
        }else{
            this.$notify.error({
              title: '失败',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            })
        }
      })
   },
   closeDialog(res, obj) {
      this.isShow = false;
    },
    openDrawer(){
        this.isShow = true
    }
  },
  components:{addBackup}
};
</script>
<style lang="less" scoped>
.content {
   .el-table {           
      /deep/ .el-table__empty-block {
        margin-top: inherit;
      }
   }
   /deep/ .el-table--border{
        border-bottom: 1px solid #EBEEF5;
    }
  position: relative;
  /deep/ .el-collapse-item__arrow {
    position: absolute;
    left: 45px;
  }
  /deep/ .el-collapse-item {
    border: 0px !important;
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: 0px;
  }
  /deep/ .el-collapse-item__header {
    background: #fff !important;
    border-bottom: 1px solid #e7edf3;
  }
  .formTit {
    padding-left: 60px;
    padding-right: 20px;
    font-size: 14px;
    width: 100%;
    //background: rgba(48, 107, 255, 0.03);
    .line {
      float: right;
      margin-right: 200px;
      height: 1px;
      background: #333;
      margin-top: 25px;
      display: none;
      width: calc(100% - 290px);
    }
  }
  .formBody {
    
    margin: 0 auto;
    margin-top: 20px;
    width: 96%;
  }
  .createBox{
      cursor: pointer;
      color: rgb(64, 158, 255);
      font-size: 12px;
      border: 1px dashed #ccc;
      text-align: center;
      height: 32px;
      line-height: 32px;
      margin-bottom: 10px;
      margin-top: 20px;
      width: 96%;
      margin-left:2%;
  }
}
</style>
