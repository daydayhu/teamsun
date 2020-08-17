<template>
  <div class="addSystemSecond">
    <systemMemberAddEdit  :app_id="appId" :org_id="orgId"></systemMemberAddEdit>
    <div class="ts-content-form-footer" >
        <div class="btn-c">
          <el-button  size="small" @click="onCancel">取消</el-button>
          <el-button type="primary" size="small" @click="onBack">上一步</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import  Bus  from "@/commons/js/bus";
//引入成员列表组件
import systemMemberAddEdit from '../../components/systemMemberAddEdit'
//引入API
//import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
export default {
  name: "addSystemSecond",
  components: {
    systemMemberAddEdit,
  },
  data() {
    return {
      appId:null,
      orgId:null,
     // title:"",
    };
  },
  created(){
    //改变进度条变化
    this.$emit("changeStep",1);
    console.log("this.$route", this.$route)
    this.appId=Number(this.$route.query.app_id)
    this.orgId=Number(this.$route.query.org_id)
    //this.title=this.$route.query.title
  },
  mounted(){


  },
  methods: {
    //上一步按钮事件
    onBack(){
     // history.back();
     this.$router.replace({
        path: '/applicationCenter/applicationSystem/addSystem/addSystemFirst',
        query:{
          app_id:this.appId,
          operation:'add'
        }
      })
    },
    //取消按钮事件
    onCancel(){
       history.back()
      // this.$router.push({
      //   path: '/applicationCenter/applicationSystem'
      // })
    },
    //确定下一步按钮事件
    onSubmit(){
      history.back()
      // this.$router.push({
      //   path: '/applicationCenter/applicationSystem'
      // })

    },
  }
};
</script>
<style lang="less" scoped>
.addSystemSecond{
  padding: 10px 20px 70px 20px;
  .ts-content-form-footer{
    justify-content: flex-end;
    padding-right: 32px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 10;
  }
}
</style>
