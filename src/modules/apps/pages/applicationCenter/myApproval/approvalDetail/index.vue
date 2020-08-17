<template>
  <div class="approvalDetail">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="审批详情" back @handleBack="goBack" :rightWidth="8">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="item in breadCrumbData"
            :key="item.name"
            :to="{path:item.path}"
          >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>

     <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logo"></el-avatar>
        </div>
      </el-col>
      <el-col :span="21">
        <el-row type="flex" justify="space-between">
          <div class="ts-base-title">
            <h3>{{approvalDetailData.title}}</h3>
          </div>
        </el-row>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">审批编号</span>
          <span class="ts-base-value">{{ approvalDetailData.flow_sn }}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">申请者</span>
          <span class="ts-base-value">{{approvalDetailData.create_user_name }}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">状态</span>
          <span class="ts-base-value">{{approvalDetailData.approval_status.value}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">申请时间</span>
          <span class="ts-base-value">{{approvalDetailData.create_time}}</span>
        </el-col>
      </el-col>
    </el-row>
    <!-------------------------------引入详情头部公共组件----------------------------->
    <!-- <detailTitle :title="approvalDetailData.title" v-model="approvalDetailData" :avatarSrc="logo">
      <template v-slot:content>
        <el-row type="flex" justify="space-between">
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">审批编号</div>
                <div class="detail_title_item detail_title_label">申请时间</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ approvalDetailData.flow_sn }}</div>
                <div class="detail_title_item">{{ approvalDetailData.create_time }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">申请者</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ approvalDetailData.create_user_name }}</div>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <el-row type="flex" justify="space-between">
              <el-col :span="8">
                <div class="detail_title_item detail_title_label">状态</div>
              </el-col>
              <el-col>
                <div class="detail_title_item">{{ approvalDetailData.approval_status.value }}</div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </detailTitle> -->
    <el-card>
      <el-tabs v-model="activeName" @tab-click="selectedTab">
        <!--------------------------------审批历史-------------------------------->
        <el-tab-pane label="审批历史" name="approval">
          <el-row class="approval">
            <!--------------------  审批历史组件  -------------------->
              <approvalHistory
                :instance_id="Number($route.query.instance_id)"
              ></approvalHistory>
          </el-row>
        </el-tab-pane>
        <!--------------------------------审批流程----------------------------->
        <el-tab-pane label="审批流程" name="flow">
            <!--------------------  审批流程图组件  -------------------->
            <approvalFlowChart
              :instance_id="Number($route.query.instance_id)"
            ></approvalFlowChart>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue";
//引入公共详情头部组件
import detailTitle from "@/components/detailTitle.vue";
//引入审批历史和审批流程图
import approvalHistory from "./approvalHistory"
import approvalFlowChart from "./approvalFlowChart"
//引入API
import * as requestMethod from "@/modules/apps/api/applicationCenter/myApproval.js"
import * as requestFlow from "@/modules/apps/api/applicationCenter/flowApproval.js"

export default {
  name: "approvalDetail",
  components: {
    pageHeader,
    detailTitle,
    approvalHistory,
    approvalFlowChart
  },
  data() {
    return {
      logo:require('@/commons/images/approvalFlowsDetail.png'),
      pageTitle: "",
      //面包屑数据
      breadCrumbData: [
        {
          name: "我的审批",
          path: "/applicationCenter/myApproval"
        },
        {
          name: "审批详情",
          path: ""
        }
      ],
      instance_id:null,
      //详情数据
      approvalDetailData: {
          flow_sn:null,
          approval_status:{
              value:null
          }
      },
      activeName: "approval",
      height:null,
      flow:[],
      //审批
      approvalList: []
    };
  },
  mounted() {
    //this.pageTitle=this.$route.query.title
  },
  created(){
      this.getFlowDetail()
      if(this.$route.query.from=='myOrder'){
        this.breadCrumbData=[
         {
          name: "我的订单",
          path: "/applicationCenter/myOrder"
        },
        {
          name: "审批详情",
          path: ""
        }
        ]
      }
  },
  methods: {
    //返回点击事件
    goBack() {
      console.log("返回");
      history.back()
    },
    //tab事件
    selectedTab(val) {},
    //获取当前审批记录详情
    getFlowDetail() {
        requestMethod.getFlowDetail("get",this.$route.query.instance_user_id).then(res=>{
            if(res.code == 200) {
                this.approvalDetailData.approval_status = res.data.approval_status
                this.approvalDetailData.title = res.data.title
                this.approvalDetailData.flow_sn = res.data.flow_sn
                this.approvalDetailData.create_user_name = res.data.create_user_name
                this.approvalDetailData.create_time = res.data.create_time
            }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.approvalDetail {
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

</style>
