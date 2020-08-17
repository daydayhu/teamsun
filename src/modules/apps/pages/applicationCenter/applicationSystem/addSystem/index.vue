<template>
  <div class="addSystem ">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader :title="title" back :rightWidth="8" :breadCrumb="breadCrumbData" @handleBack="goBack" >
      <!-- <template v-slot:right>
        <el-steps class="ts-custom-steps"  :active="active"  finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="成员管理"></el-step>
        </el-steps>
      </template> -->
      <template v-slot:right>
        <Steps :stepsList="[
                    {step: 1,name:'基本信息',},
                    {step: 2,name:'成员管理'},
                    ]"
               :step="Number(active) + 1">
        </Steps>
      </template>
    </pageHeader>
    <div class="ts-content-form">
      <div  class="header">
        <span v-if="active===0" >基本信息</span>
        <span v-if="active===1" >成员管理</span>
      </div>
        <router-view @changeStep="stepChange" @changeTitle="changeTitle"></router-view>
    </div>
  </div>
</template>

<script>
//import  Bus  from "@/commons/js/bus";
import pageHeader from "@/components/pageHeader.vue"
export default {
  name: "addSystem",
  components: {
    pageHeader,
  },
  data() {
    return {
      active: 0,
      //面包屑数据
      breadCrumbData:[{
          name:"应用系统",
          path:"/applicationCenter/applicationSystem"
        },{
          name:"新建应用系统",
          path:""
        }],
        title:"新建应用系统",
      };
  },
  mounted(){
    // //监听并触发step变化
    // Bus.$on("addSystemStepChange",e=>{
    //   this.active=e
    // })
  },
  methods: {
    //返回按钮点击事件
    goBack() {
      history.back()
      // this.$router.push({
      //   path: '/applicationCenter/applicationSystem'
      // })
    },
    //监听步骤条变化
    stepChange(val) {
      this.active = val;
    },
    //监听title变化
    changeTitle(val){
      console.log("changeTitle",val)
      this.title=val
    }
  },
  // beforeDestroy(){
  //   Bus.$off('addSystemStepChange')

  // }
};
</script>

<style lang="less" scoped>
.addSystem{


}

</style>
