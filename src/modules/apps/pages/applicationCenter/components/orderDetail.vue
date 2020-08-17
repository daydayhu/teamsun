<template>
  <div class="orderDetail">
    <!-------------------------------详情头部----------------------------->
    <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logo"></el-avatar>
        </div>
      </el-col>
      <el-col :span="21">
        <el-row type="flex" justify="space-between">
          <div class="ts-base-title">
            <h3>{{orderDetailData.ticket_name}}</h3>
          </div>
        </el-row>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">订单编号</span>
          <span class="ts-base-value">{{orderDetailData.ticket_number }}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">应用系统</span>
          <span class="ts-base-value">{{orderDetailData.app_name }}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">状态</span>
          <span class="ts-base-value">{{orderDetailData.step_status}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">创建人</span>
          <span class="ts-base-value">{{orderDetailData.user_name}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">创建时间</span>
          <span class="ts-base-value">{{orderDetailData.create_time}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">备注</span>
          <span class="ts-base-value">{{orderDetailData.remarks}}</span>
        </el-col>

      </el-col>
    </el-row>
    <div class="ts-content">
      <!-- <div class="select_box">
        <ul>
          <li @click="selectedTab(item.name)" v-for="(item,index) in selectList" :key="index">{{item.name}}</li>
        </ul>
      </div> -->
      <el-tabs v-model="activeName" @tab-click="selectedTab">
        <el-tab-pane v-for="(item) in selectList" :key="item.id" :label="item.name" :name="item.id">
        </el-tab-pane>
        <router-view></router-view>
      </el-tabs>
    </div>
  </div>
</template>

<script>
//引入公共详情头部组件
import detailTitle from "@/components/detailTitle.vue";
import deployView from "../applicationSystem/systemDetail/components/deploymentView.vue";
import approval from "./orderComponents/deliverPlan.vue";
import fileList from "./orderComponents/fileList.vue";


//引入API
import * as requestMethod from "../../../api/applicationCenter/applicationSystem";
export default {
  name: "orderDetail",
  components: {
    detailTitle,
    deployView,
    approval,
    fileList
  },
  // props: {
  //   ticket_id: Number
  // },
  data() {
    return {
      logo: require('@/commons/images/g_app_orderDetail.svg'),
      selectList: [{ name: '部署视图', id: "view" }, { name: '交付计划', id: "plan" }, { name: '部署任务', id: "task" }, { name: '附件', id: "file" },{ name: '流程记录', id: "flow"}],// { name: '审批历史', id: "approval" }
      isArch: false,
      //orderId
      orderId: null,
      //详情数据
      orderDetailData: {},
      //审批历史数据
      historyData: [],
      activeName: "view",
      //审批
      approvalList: [],
      //附件
      fileTableData: [
      ],
      fileTableLoading: false,
      from:null,
      step_type:null,
    };
  },
  created() {
    this.activeName = this.$route.query.activeName
    this.from=this.$route.query.from

  },
  mounted() {
    this.getOrderDetail(this.$route.query.ticket_id);
    // this.getOrderHistory();
    //this.getFileList();
  },
  watch: {
    $route(to, from) {
      this.activeName = this.$route.query.activeName
      console.log(to.path);
    }
  },
  methods: {
    selectedTab(val) {
      console.log(val);
      let routeName
      switch (val.name) {
        case 'file':
          if(this.from=="myOrder"){
            routeName="orderDetailFileList"
          }else{
            routeName="sysOrderDetailFileList"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "file", menu_id: this.$route.query.menu_id ,from:this.from, step_type: this.$route.query.step_type} })
          break;
        case 'approval':
          if(this.from=="myOrder"){
            routeName="orderDetailDeliverPlan"
          }else{
            routeName="sysOrderDetailDeliverPlan"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "approval", menu_id: this.$route.query.menu_id ,from:this.from, step_type: this.$route.query.step_type} })
          break;
        case 'view':
          if(this.from=="myOrder"){
            routeName="orderDetailBCanvas"
          }else{
            routeName="sysOrderDetailBCanvas"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "view", menu_id: this.$route.query.menu_id ,from:this.from, step_type: this.$route.query.step_type} })
          break;
        case 'plan':
          if(this.from=="myOrder"){
            routeName="orderDetailJCanvas"
          }else{
            routeName="sysOrderDetailJCanvas"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "plan", menu_id: this.$route.query.menu_id,from:this.from,step_type: this.$route.query.step_type } })
          break;
        case 'task':
          if(this.from=="myOrder"){
            routeName="developTask"
          }else{
            routeName="sysDevelopTask"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "task", menu_id: this.$route.query.menu_id ,from:this.from,step_type: this.$route.query.step_type} })
          break;
        case 'flow':
          if(this.from=="myOrder"){
            routeName="flowRecord"
          }else{
            routeName="sysFlowRecord"
          }
          this.$router.replace({ name: routeName, query: { ticket_id: this.$route.query.ticket_id, app_id: this.$route.query.app_id, activeName: "flow", menu_id: this.$route.query.menu_id ,from:this.from,step_type: this.$route.query.step_type} })
          break;
      }
    },
    //获取订单详情
    getOrderDetail(ticket_id) {
      requestMethod.getOrderDetail("get", ticket_id).then(res => {
        if (res.code === 200) {
          this.orderDetailData = res.data.item;
          this.step_type=res.data.step_type_num
          console.log("getOrderDetail", res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.orderDetail {
  @detail-overview();
  .approval {
    margin: 20px;
    .title {
      display: flex;
      justify-content: space-between;
    }
    .content {
      margin-top: 10px;
      font-size: 12px;
      color: #4f4f4f;
    }
  }
}
.select_box {
  width: auto;
  height: auto;
  ul {
    width: 100%;
    border-bottom: 2px solid #ebeef5;
    overflow: hidden;
  }
  li {
    width: auto;
    height: 30px;
    text-align: center;
    line-height: 30px;
    float: left;
    border-bottom: 2px solid #306bff;
    padding-bottom: 6px;
    margin-right: 40px;
  }
}
</style>
