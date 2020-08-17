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
            <el-table :data="tableData" border :span-method="objectSpanMethod" style="width: 100%">
                <el-table-column prop="name" label="主机名称"  width="180"> </el-table-column>
                <el-table-column  label="权限使用人员及描述" > 
                   <template slot-scope="scope">
                      <span v-if="scope.row.login_auth!=undefined">{{ scope.row.login_auth.value }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="host_name" label="主机用户名" > </el-table-column>
                <el-table-column prop="login_type" label="远程登录方式"> </el-table-column>
                <el-table-column  label="权限人员" prop="login_auth_user" > 
                </el-table-column>
                <el-table-column label="操作" width="120">
                     <template slot-scope="scope">
                      <el-button @click="editFourA(scope.$index)" type="text" size="small" v-if="phaseState!='2' && phaseState!='4'&& isEditable==true">编辑</el-button>
                      <el-button @click="deleteFourA(scope.row)" type="text" size="small" v-if="phaseState!='2' && phaseState!='4'&& isEditable==true">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
          </div>
          <div class="createBox" @click='openDrawer' v-if="phaseState!='2' && phaseState!='4' && isEditable==true"><i class='el-icon-circle-plus'></i>添加</div>
        </el-collapse-item>
    </el-collapse>
    <addFourA
      ref="addBackup"
      v-if="isShow"
      :is-show="isShow"
      :canvasObj='canvasObj'
      :operationSet='operationSet'
      :choiceData='choiceData'
      @closeDialog="closeDialog"
      @requireList="getfourAList"
    ></addFourA>
  </div>
</template>
<script>
import addFourA from "../formComponents/compontents/addFourA";
import * as requestMethod from "@/modules/apps/api/serviceCatalog/openstack/fourA.js";
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
      tableData: [
      ],
       activeNames:'',
       isShow: false,
       choiceData:[],
       theList:[],
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
    this.getfourAList();
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
    editFourA(index){
      
      this.isShow = true;
      this.$nextTick(() => {
        this.$refs.addBackup.$emit('childMethod',this.theList[index]);
      });
    },
    deleteFourA(val){
      this.$confirm(`确定删除${val.name}吗？该操作不可恢复`, "提示", {
        type: "warning"
      }).then(() => {
        requestMethod.deleteFourA(val.api_auth_id).then(res=>{
          if(res.code==200){
            this.$notify.success({
              title: '成功',
              message: `${res.message}`,
              position: 'bottom-right',
              duration:3000
            });
            this.getfourAList()
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
    getfourAList(){
      var obj={
        node_canvas_uuid:this.canvasObj.service_uuid,
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id,
        node_set_id:this.operationSet
      }
      this.choiceData=[]
      requestMethod.requireFourAList(obj).then(res=>{
        if(res.code==200){
           for(var i=0;i<res.data.items.length;i++){
             this.choiceData.push(res.data.items[i].ticket_obj_id)
           }
           this.theList=res.data.items;
           this.tableData=this.dealData(res.data.items);
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
    dealData(data){
      let arr=[];
      let spanNum=0;
      for(var i =0;i<data.length;i++){
        let sj=data[i].items;
        for(let j=0;j<sj.length;j++){
          let obj={
            spanNum:j===0?sj.length:0,
            name: data[i].name,
            login_auth:sj[j].login_auth,
            host_name: sj[j].host_name,
            login_type:sj[j].login_type,
            login_auth_user:sj[j].login_auth_user,
            api_auth_id:data[i].api_auth_id
          }
          arr.push(obj)
        }
      }
      return arr;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 5) {
          if (row.spanNum>0) {
            return {
              rowspan: row.spanNum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
   closeDialog(res, obj) {
      this.isShow = false;
    },
    openDrawer(){ 
      this.isShow = true
    }
  },
  components:{addFourA}
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
  /deep/ .el-table td{
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
  }
  /deep/ .el-table th{
    border-right: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
  }
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