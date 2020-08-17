<template>
  <div class="report" id="demo">
    <el-button @click="testDownd">下载</el-button>
    <div class="form" v-for="(item,index) in reportData" :key="index">
      <div class="base_card_title">
        <h3>{{item.reportName}}</h3>
      </div>
      <div class="content">
        <component :is="item.key"></component>
      </div>
    </div>
  </div>
</template>

<script>
    import htmlToPdf from '@/utils/htmlToPdf';
    //引入基本信息
    // import baseInfo from "./components/baseInfo.vue";
    //引入订单信息
    // import ticket from "./components/order.vue";
    //引入应用架构图
    // import frame from "./components/frame.vue";
    //引入部署视图
    // import arrangeView from "./components/view.vue";
    //引入参数
    // import paramView from "./components/param.vue";
    //引入交付计划
    import deliverPlan from "./components/deliverPlan.vue";
    //引入API
    export default {
        name: "report",
        components: {
            // baseInfo,
            // ticket,
            // frame,
            // arrangeView,
            // paramView,
            deliverPlan
        },
        data() {
            return {
                reportData: [
                    // {
                    //   reportName: "基本信息",
                    //   key: "baseInfo",
                    //   data: []
                    // },
                    // {
                    //   reportName: "应用架构",
                    //   key: "frame",
                    //   data: []
                    // },
                    // {
                    //   reportName: "订单信息",
                    //   key: "ticket",
                    //   data: []
                    // },
                    // {
                    //   reportName: "部署视图",
                    //   key: "arrangeView",
                    //   data: []
                    // },
                    // {
                    //   reportName: "参数",
                    //   key: "paramView",
                    //   data: []
                    // },
                    {
                        reportName: "交付计划",
                        key: "deliverPlan",
                        data: []
                    }
                ]
            };
        },
        mounted() {
            // this.handleDown();

        },
        methods: {
            testDownd(){
                this.handleDown();
            },
            handleDown(){
                htmlToPdf.downloadPDF( document.querySelector('#demo'),'我的合同');
            },
        }
    };
</script>

<style lang="less" scoped>
  .report {
    background-color: #fff;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 20px;
    overflow-y: scroll;
    .form {
      width: 60%;
    }
    .base_card_title {
      padding-left: 0px;
    }
    .content {
      padding: 20px;
    }
  }
</style>
