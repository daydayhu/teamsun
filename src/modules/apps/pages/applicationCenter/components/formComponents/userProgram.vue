<template>
  <div class="content">
    <el-collapse v-model="activeNames" style="padding:15px 20px;">
        <el-collapse-item name="1" v-if="groupPlan.indexOf(phaseState)>-1 || (phaseState=='2' && groupPlan.indexOf('1')>-1) || (phaseState=='4' && groupPlan.indexOf('3')>-1)">
          <template slot="title">
            <div class="formTit">
              组规划
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody">
            <el-table :data="tableDataGroup" border style="width: 100%">
                <el-table-column prop="group_name" label="组名"  width="120"> </el-table-column>
                <el-table-column prop="group_id" label="组ID" > </el-table-column>
                <el-table-column prop="remarks" label="组说明" > </el-table-column>
                <el-table-column label="操作" width="120">
                     <template slot-scope="scope">
                      <el-button @click="editGroup(scope.row)" v-if="phaseState!='2' && phaseState!='4' && isEditable==true" type="text" size="small">编辑</el-button>
                      <el-button @click="deleteGroup(scope.row)" type="text" size="small" v-if="phaseState!='2' && phaseState!='4' && isEditable==true">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div class="createBox" v-if="phaseState!='2' && phaseState!='4' && isEditable==true" @click='openDrawerGroup'><i  class='el-icon-circle-plus'></i>添加</div>
        </el-collapse-item>
        <el-collapse-item name="2" v-if="userPlan.indexOf(phaseState)>-1 || (phaseState=='2' && userPlan.indexOf('1')>-1) || (phaseState=='4' && userPlan.indexOf('3')>-1)">
          <template slot="title">
            <div class="formTit">
              用户规划
              <div class="line"></div>
            </div>
          </template>
          <div class="formBody">
            <el-table :data="tableDataUser" border  style="width: 100%">
                <el-table-column prop="conf_name" label="用户名"  width="120"> </el-table-column>
                <el-table-column prop="conf_id" label="用户ID" > </el-table-column>
                <el-table-column prop="umask" label="主组" > </el-table-column>
                <el-table-column prop="conf_set" label="组集"> </el-table-column>
                <el-table-column prop="conf_dir" label="主目录" > </el-table-column>
                <el-table-column prop="description" label="用户说明" > </el-table-column>
                <el-table-column  label="操作" width="120"> 
                  <template slot-scope="scope">
                      <el-button v-if="phaseState!='2' && phaseState!='4' && isEditable==true" @click="editUser(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button v-if="phaseState!='2' && phaseState!='4' && isEditable==true" @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div class="createBox"  @click='openDrawerUser' v-if="phaseState!='2' && phaseState!='4' && isEditable==true"><i class='el-icon-circle-plus'></i>添加</div>
        </el-collapse-item>
    </el-collapse>
     <addUser
      ref="addUser"
      v-if="isShowUser"
      :is-show="isShowUser"
      :canvasObj='canvasObj'
      :operationSet='operationSet'
      :groupList='tableDataGroup'
      @closeDialog="closeDialogUser"
       @requireList="getUserGroupList"
    ></addUser>
    <addUserGroup
      ref="addUserGroup"
      v-if="isShowGroup"
      :canvasObj='canvasObj'
      :is-show="isShowGroup"
      :operationSet='operationSet'
      @closeDialog="closeDialogGroup"
      @requireList="getUserGroupList"
    ></addUserGroup>
  </div>
</template>
<script>
import addUser from "../formComponents/compontents/addUser";
import addUserGroup from "../formComponents/compontents/addUserGroup";
import * as requestMethoduserProgram from "@/modules/apps/api/serviceCatalog/openstack/userProgram.js";
export default {
  name: "theBackup",
  props: {
    phaseState: {
      type: String
    },
    canvasObj:{
      type:Object
    },
    operationSet:{
      type:Number
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
        tableDataGroup: [],
        tableDataUser: [],
       activeNames:'',
       isShowUser: false,
       isShowGroup:false,
       groupPlan:[],
       userPlan:[]
    };
  },
  mounted() {
    //双保险
    if (typeof this.isEditData != 'object') {
           var thedata=JSON.parse(this.isEditData)
    }else{
      var thedata=this.isEditData
    }
    if(JSON.stringify(thedata) == "{}"){
      thedata.group_plan=[1,3,5];
      thedata.user_plan=[1,3,5];
    }
    this.groupPlan=thedata.group_plan.map(String);
    this.userPlan=thedata.user_plan.map(String);
    this.getUserGroupList()
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
    editGroup(val){
      this.isShowGroup = true;
      this.$nextTick(() => {
        this.$refs.addUserGroup.$emit('childMethod',val);
      });
    },
    editUser(val){
      this.isShowUser = true;
      this.$nextTick(() => {
        this.$refs.addUser.$emit('childMethod',val);
      });
    },
    openDrawerGroup(){
      this.isShowGroup = true;
    },
    deleteGroup(val){
      this.$confirm(`确定删除${val.group_name}吗？该操作不可恢复`, "提示", {
        type: "warning"
      }).then(() => {
        //var obj={api_group_id:val.api_group_id}
        requestMethoduserProgram.deleteGroup(val.api_group_id).then(res=>{
          if(res.code==200){
            this.$notify.success({
              title: '成功',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
            this.getUserGroupList()
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
    deleteUser(val){
      this.$confirm(`确定删除${val.conf_name}吗？该操作不可恢复`, "提示", {
        type: "warning"
      }).then(() => {
        //var obj={api_user_id:val.conf_id}
        requestMethoduserProgram.deleteUser(val.api_user_id).then(res=>{
          if(res.code==200){
            this.$notify.success({
              title: '成功',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
            this.getUserGroupList()
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
    getUserGroupList(){
      var obj={
        node_canvas_uuid:this.canvasObj.service_uuid,
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id,
        node_set_id:this.operationSet
      }
      requestMethoduserProgram.requireUserAndGroupList(obj).then(res=>{
        if(res.code==200){
           this.tableDataGroup=res.data.group_list;
           this.tableDataUser=res.data.user_list;
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
    closeDialogUser(res, obj) {
      this.isShowUser = false;
    },
    openDrawerUser(){
        this.isShowUser = true
    },
    closeDialogGroup(res, obj) {
      this.isShowGroup = false;
    },
    
  },
  components:{addUser,addUserGroup}
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
    table {
          font-size: 14px;
          color: #19223b;
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          border-spacing: 0;
        }

        table thead {
          background: rgba(25, 34, 59, 0.03);
          border-radius: 4px;
          height: 30px;
          line-height: 30px;
        }
        table thead tr th {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #666;
          text-align: center;
          height: 30px;
          border-right: 2px solid #fff;
          line-height: 30px;
        }
        /* table tbody tr {
          padding: 20px 0px;
          border-bottom: 1px solid rgba(216, 222, 233, 1);
        } */
        table tbody tr td {
          text-align: center;
          color: #666;
          font-size: 12px;
          padding: 10px 10px;
        }
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
