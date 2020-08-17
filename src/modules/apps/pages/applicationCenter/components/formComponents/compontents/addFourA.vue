<template>
  <el-drawer
    title="4A"
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
        <el-form-item label="主机名称" prop="ticket_obj_id"  :label-width="formLabelWidth">
         <el-select :disabled="isToEdit" placeholder="请选择主机名称"  v-model="theform.ticket_obj_id" style="width:100%">
            <el-option
              v-for="list in hostList"
              :key="list.ticket_obj_id"
              :label="list.name"
              :disabled="list.disabled"
              :value="list.ticket_obj_id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class='thetable'>
          <table>
              <thead>
                <tr>
                  <th>权限使用人员及描述 <span>*</span></th>
                  <th>主机用户名</th>
                  <th>主机账户密码</th>
                  <th>远程登录方式</th>
                 <th>权限人员</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                  <tr v-for="(list,index) in theform.items" :key="index">
                      <td>
                        <el-select style="width:120px" placeholder="请选择权限人员及描述"  v-model="list.login_auth">
                            <el-option 
                              v-for="list in authList" 
                              :key="list.value"
                              :label="list.label"
                              :value="list.value"></el-option>
                        </el-select>
                      </td>
                      <td>
                          <el-input placeholder="请输入用户名" style="width:140px" v-model='list.host_name'></el-input>
                      </td>

                      <td>
                          <el-input placeholder="请输入密码" style="width:140px" v-model='list.host_pwd'></el-input>
                      </td>
                       <td>
                         <el-input placeholder="请输入远程登录方式" style="width:140px" v-model='list.login_type'></el-input>
                      </td>
                      <td>
                        <el-input placeholder="请输入" style="width:140px" v-model='list.login_auth_user'></el-input>
                      </td>
                      <td>
                          <i class="el-icon-delete" style='color:#409eff;cursor:pointer' @click="deleteUser(index,list.host_name)"></i>
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
      <div class="createBox" @click='addUser'><i class='el-icon-circle-plus'></i>添加</div>

    </div>
    <div class="drawer_footer">
       <el-button @click="cancelFn()">取 消</el-button>
       <el-button
          type="primary"
          @click="onSubmit('theform',false)"
          v-if='isToEdit==false'
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
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/fourA.js";
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
    choiceData:{
      type:Array
    },
  },
  created() {},
  data() {
    return {
      authList:[
      {value:1,label:'应用运维-高级'},
      {value:2,label:'应用运维-普通'},
      {value:3,label:'中间件运维-高级'},
      {value:4,label:'数据库运维-高级'},
      {value:5,label:'数据库运维-普通'},
      {value:6,label:'系统运维-高级'},
      ],
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "right",
      submitLoading: false,
      theform: {
        app_id: null,
        ticket_id:null,
        node_canvas_uuid:null,
        node_set_id: null,
        ticket_obj_id: "",
        items: [{
         login_auth: null,
         host_name: "",
         host_pwd: "",
         login_type: "ssh/sftp",
         login_auth_user: ""
        }]
      },
      rules: {
        ticket_obj_id: [{ required: true, message: "请选择主机名称", trigger: "change" }]
      },
      hostList:[],
      isToEdit:false,
    };
  },
  watch: {},
  mounted() {
    this.getHostList();
    this.$on('childMethod', function (val) {
      this.theform=val;
      this.isToEdit=true;
      for(var i=0;i<this.theform.items.length;i++){
        this.theform.items[i].login_auth=this.theform.items[i].login_auth.type
      }
    })
  },
  methods: {
    onSubmit(formName,isFlag) { //isFlag 为true确定，为false继续添加
      this.$refs[formName].validate(valid => {
        if (valid) {
          for(var i=0;i<this.theform.items.length;i++){
            if(!this.theform.items[i].login_auth){
              this.$notify.warning({
                title: '警告',
                message: `请选择权限使用人员及描述`,
                position: 'bottom-right',
                duration:3000
              });
              return 
            }
            /* if(!this.theform.items[i].host_name){
              this.$notify.warning({
                title: '警告',
                message: `主机用户名不能为空`,
                position: 'bottom-right',
                duration:3000
              });
                return
            }
            if(!this.theform.items[i].host_pwd){
              this.$notify.warning({
                title: '警告',
                message: `主机账户密码不能为空`,
                position: 'bottom-right',
                duration:3000
              });
              return
            } */
          }
          this.theform.app_id=this.canvasObj.app_id;
          this.theform.ticket_id=this.canvasObj.ticket_id;
          this.theform.node_canvas_uuid=this.canvasObj.service_uuid
          this.theform.node_set_id=this.operationSet
          this.keepInRealTime(isFlag)
        } else {
          return false;
        }
      });
    },
    keepInRealTime(isFlag){
      if(this.isToEdit==true){ //编辑
        delete this.theform.name
        requestMethod.addFourA(this.theform).then(res => {
          this.alertMess(res,isFlag)
        });
      }else{                   //创建
        requestMethod.addFourA(this.theform).then(res => {
          this.alertMess(res,isFlag)
        });
      }
    },
    alertMess(res,isFlag){
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
        if(isFlag){
           this.$emit('closeDialog');
        }else{
        this.theform={
          app_id: null,
          ticket_id:null,
          node_canvas_uuid:null,
          node_set_id: null,
          ticket_obj_id: "",
          items: [{
            login_auth: null,
            host_name: "",
            host_pwd: "",
            login_type: "ssh/sftp",
            login_auth_user: ""
          }]
        },
        this.isDataChoice();
        
        }
        
        this.$emit('requireList');
        this.isToEdit=false
    },
    isDataChoice(){
      var obj={
        node_canvas_uuid:this.canvasObj.service_uuid,
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id,
        node_set_id:this.operationSet
      }
      var choiceDataSJ=[]
      requestMethod.requireFourAList(obj).then(res=>{
        if(res.code==200){
           for(var i=0;i<res.data.items.length;i++){
             choiceDataSJ.push(res.data.items[i].ticket_obj_id)
           }
           var obj={
            app_id:this.canvasObj.app_id,
            ticket_id:this.canvasObj.ticket_id,
          }
          requestMethod.requireHostList(obj).then(res=>{
            if(res.code==200){
              this.hostList=res.data.items;
              for(var i=0;i<this.hostList.length;i++){
                if(choiceDataSJ.indexOf(this.hostList[i].ticket_obj_id)>-1){
                  this.hostList[i].disabled=true
                }else{
                  this.hostList[i].disabled=false
                }
              }
            }
          })
        }
      })
    },
    deleteUser(index,val){
      this.$confirm(`确定删除${val}吗？该操作不可恢复`, "提示", {
        type: "warning"
      }).then(() => {
        this.theform.items.splice(index,1)
      }).catch(() => {});
    },
    getHostList(){
      var obj={
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id,
      }
      requestMethod.requireHostList(obj).then(res=>{
        if(res.code==200){
           this.hostList=res.data.items;
           for(var i=0;i<this.hostList.length;i++){
             if(this.choiceData.indexOf(this.hostList[i].ticket_obj_id)>-1){
                  this.hostList[i].disabled=true
                }else{
                  this.hostList[i].disabled=false
                }
           }
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
    addUser(){
      var theobj={
         login_auth: null,
         host_name: "",
         host_pwd: "",
         login_type: "ssh/sftp",
         login_auth_user: ""
      }
      this.theform.items.push(theobj)
    },

    cancelFn() {
      this.$emit("closeDialog");
    }
  }
};
</script>

<style lang="less" scoped>
// 可公共form底部操作按钮
.thetable{
    width:90%;
    margin:0 auto;
    overflow-x: auto;
    table {
          font-size: 14px;
          color: #19223b;
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
          position: relative;
          span{
            color: #f56c6c;
          }
        }
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
      margin-left:10%;
  }
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
