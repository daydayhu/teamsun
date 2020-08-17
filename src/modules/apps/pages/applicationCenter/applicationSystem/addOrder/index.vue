<template>
  <div class="addOrder">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader :title="pageTitle" back :rightWidth="14" @handleBack="goBack">

      <!--<template v-slot:right>-->
        <!--<el-steps :active="active" finish-status="success">-->
          <!--<el-step title="基本信息"></el-step>-->
          <!--<el-step title="部署视图"></el-step>-->
          <!--<el-step title="交付计划"></el-step>-->
        <!--</el-steps>-->
      <!--</template>-->

      <template v-slot:right>
        <Steps :stepsList="[
                    {step: 1,name:'基本信息',},
                    {step: 2,name:'部署视图'},
                    {step: 3,name:'交付计划'}]"
               :step="Number(active) + 1">
        </Steps>
      </template>

    </pageHeader>
    <div class="info" v-if="active==0&&(operation=='add'||step==1)">
      <el-alert
        title="  点击【下一步：部署视图】时，对订单进行保存；订单状态为“设计”，在【我的订单】和【应用系统详情】中可见。"
        show-icon
        type="ts-description"
      ></el-alert>
      <br />
    </div>
    <router-view @changeStep="addOrderStepChange" @changeTitle="changeTitle" @changeTicketStep="changeTicketStep"></router-view>
  </div>
</template>

<script>
import pageHeader from "@/components/pageHeader.vue";
export default {
  name: "addOrder",
  components: {
    pageHeader
  },
  data() {
    return {
      //页面标题-注意！默认值不可以改变，为蓝图订单创建时的默认值
      pageTitle: "订单需求收集",
      //蓝图定义阶段标题
      stepPageTitle: {
        1: "订单需求收集",
        2: "订单需求审批",
        3: "资源规划",
        4: "资源规划审批",
        5: "资源部署",
      },
      // //从哪个页面跳转而来的所有可能情况
      // from:{
      //   'service':'/applicationCenter/serviceCatalog',
      //   'order':'/applicationCenter/myOrder',
      //   'app':'/applicationCenter/applicationSystem'
      // },
      // //当前从哪个页面跳转而来
      // currentFrom:'',
      active: 0,
      ticket_type: null,
      operation:'',
      step:1,
      currentFrom:''
    };
  },
  created() {
     //获取订单类型：1:快速申请，2:蓝图定义
     this.ticket_type=this.$route.query.ticket_type
     this.operation = this.$route.query.operation
     //判断从哪个订单跳转而来：service：服务目录/order：我的订单/app：应用系统详情
    this.currentFrom=this.$route.query.from
  },

  methods: {
    //返回按钮点击事件
    goBack() {
      // if(this.currentFrom === "service" && this.operation ==="add" && this.active === 0){
      //   this.$router.push({
      //     path: '/applicationCenter/serviceCatalog?menu_id=1026'
      //   });
      // }else if(this.currentFrom === "service" && this.operation ==="add" && this.active !== 0){
      //   this.$router.push({
      //     path: '/applicationCenter/myOrder?menu_id=1044'
      //   });
      // }else{
      //   history.back()
      // }
       history.back()


    },
    //监听步骤条变化
    addOrderStepChange(val) {
      this.active = val;
    },
    //监听标题变化
    changeTitle(val, ticket_name) {
      if(this.operation === "add" && this.step === 1){
        if(this.ticket_type==1){
          this.pageTitle = '申请'+val;
        }else{
          this.pageTitle = this.stepPageTitle[val];
        }
      }else{
        if(this.ticket_type==1){
          this.pageTitle = '申请'+val+'（'+ticket_name + '）';
        }else{
          this.pageTitle = this.stepPageTitle[val]+'（'+ticket_name + '）';
        }
      }

    },
    //监听订单阶段变化
    changeTicketStep(val){
      this.step=val

    }
  }
};
</script>

<style lang="less" scoped>
</style>
