import template from "./index.vue";
import pageHeader from "@/components/pageHeader.vue";
import enumSearch from "@/components/searchCom/enumSearch.vue";
import Pagination from "@/components/pagination";
import deployProcess from "./components/deployProcess.vue";
import deployLog from "./../components/deployLog.vue";
import orderTransfer from './../components/orderTransfer.vue'
import orderReviewComments from "./../myTask/components/orderReviewComments";
import orderReview from "./../myTask/components/orderReview";
import EmptyInTable from "@/components/emptyLayout/emptyInTable"
import { getSession } from "@/commons/js/searchFresh.js";
//引入API
import * as appRequestMethod from "@/modules/apps/api/applicationCenter/applicationSystem.js";
import * as requestMethod from "../../../api/applicationCenter/deploymentTask";
import * as taskRequestMethod from '@/modules/apps/api/applicationCenter/myTask.js';
import { values } from "lodash";
export default {
  ...template,
  data() {
    return {
      taskLoading: false,
      taskList: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      logData: {},
      logFlag:{},
      reviewData: {},
      reviewCommentsData: {},
      deployProcessVisible: false,
      deployLogVisible: false,
      reviewDialogVisible: false,
      reviewCommentDialogVisible: false,
      dialogFormVisible:false,
      defaultSearch:{
        isInput: true,
        isSave: true,
        isShuxing: false,
        isShuxingzhi: true,
        shuxing: "状态",
        shuxingzhi: "待部署|部署中|部署失败|回滚中|回滚失败|已回滚|部署成功|待复核|复核失败",
        valueType: 3
      },
      from:'',
      ticket_number:'',
      groupUserList:[],
      orderInfo:{}
    };
  },
  components: {
    pageHeader,
    Pagination,
    enumSearch,
    deployProcess,
    deployLog,
    orderReviewComments,
    orderReview,
    EmptyInTable,
    orderTransfer
  },
  filters:{
    dateFormate:function(value){
      if(!value) return ''
      return value.substring(value.indexOf(' '));
    },
    dateFormate2:function(value){
      if(!value) return ''
      return value.substring(0, value.indexOf(' '))+'...';
    }
  },
  created(){
    this.wsReceive();
    this.getGroupUser();
    this.from = this.$route.query.from
    this.ticket_number = this.$route.query.ticket_num
    if(this.from==="delivery" ||this.from==="mytask"){
      this.defaultSearch ={
        isInput: true,
        isSave: true,
        isShuxing: false,
        isShuxingzhi: false,
        shuxing: "订单编号",
        shuxingzhi: this.ticket_number,
        valueType: 1
      }
    }
  },

  methods: {
    filterActions (row){
      let arr = [];
      row.actions.forEach(e=>{
        if( e.key !==  "view_deployment_log" && e.key !== "view_task_log" && e.key !==  "view_review_comments" && e.key !== "confirm"){
          arr.push(e)
        }  
      })
      return arr;     
    },
    searchContdition() {
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
    },
    //搜索事件
    toSearch(val) {
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
    },
    // 上下分页
    handleCurrentChange(val) {
      this.getDataList(
        getSession("searchFresh").keyword,
        val,
        getSession("searchFresh").pageSize
      );
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        val
      );
    },
     //部署任务列表中订单编号点击事件
     orderDetail(row) {
      this.$router.push({
        path: "/applicationCenter/applicationSystem/systemOrderDetail/developTask",
        query: {
          from:'deploy',
          ticket_id: row.ticket_id,
          app_id: row.app_id,
          activeName: "task",
          menu_id: this.$route.query.menu_id,
          step_type: 5
        }
      });
    },

    //部署任务列表中的处理按钮
    onHandle(row) {
      //ticket_type:1,//1:快速申请，2:蓝图定义
      this.$router.push({
        path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
        query: {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          operation: "edit",
          ticket_type: row.apply_type, //1:快速申请，2:蓝图定义
          step_id: row.ticket_step_id,
          from: "deploy",
          ticket_num: row.ticket_number,
          ticket_name:row.ticket_name
        }
      });
    },
    // 获取部署任务列表
    getDataList(data, pageNo, pageSize) {
      let that = this;
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data),
        is_full: 1
      };
      this.taskLoading = true;
      requestMethod
        .getDeploymentTaskList("get", para)
        .then(res => {
          if (res.code == 200) {
            let channels = [];
            this.taskList = res.data.items;
            this.pagination = res.data.pagination_data;
            this.taskList.forEach(item=>{
              if(item.status){
                if(item.status.key === 'Deploying' || item.status.key === 'RollBacking'){
                  let channel = `channel:app:progress:${item.sst_uuid}`
                    channels.push(channel)
                  }
                }
            });
            that.wsSend(channels)
          } else {
            this.$message.error(res.message);
          }
          this.taskLoading = false;
        })
        .catch();
    },
    //点击订单编号后按钮，查看部署进展
    viewDeployProcess(row) {
      this.deployProcessVisible = true;
      this.dataInfo = {
        app_id: row.app_id,
        ticket_id: row.ticket_id
      }

    },

    //关闭弹框
    childClose() {
      this.deployProcessVisible = false;
      this.deployLogVisible = false;
      this.reviewCommentDialogVisible = false;
      this.reviewDialogVisible = false;
    },

    //点击查看日志
    viewLog(row, type) {
      this.deployLogVisible = true;
      this.logData.log_type = type === "task" ? 2 : 1;
      this.logData.service_set_task_id = row.service_set_task_id;
    },
    //提交复核
    submitReview(row, key) {
      this.reviewData = {
        service_set_task_id: row.service_set_task_id,
        ticket_step_id: row.ticket_step_id,
        current_state: row.status.key,
        operate: key
      };
      this.reviewDialogVisible = true;
    },
    //提交复核成功
    handleSuccess(){
      this.reviewDialogVisible = false;
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
    },

    //查看复核意见
    reviewComments(row) {
      this.reviewCommentsData = {
        ticket_step_id: row.ticket_step_id,
        service_set_task_id: row.service_set_task_id
      };
      this.reviewCommentDialogVisible = true;
    },

    //部署，终止， 回滚，重新部署，部署成功，提交确认。 // SSH,转单，复核，查看部署日志 不通过操作集接口。
    operateSet(row, key) {
      let service_set_task_id = row.service_set_task_id;
      if (Object.keys(row.status).length > 0) {
        let state = row.status.key;
        let param = {
          service_set_task_id: service_set_task_id,
          state: state,
          operate: key
        };
        appRequestMethod.operateSet("post", param).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getDataList(
              getSession("searchFresh").keyword,
              getSession("searchFresh").pageNo,
              getSession("searchFresh").pageSize
            );
          } else {
            this.$message.error(res.message);
          }
        });
      } else {
        this.$message.error("缺少状态值！");
        return;
      }
    },
    //操作栏按钮事件
    onActions(row, key) {
      switch (key) {
        case "deploy":
        case "deploy_to_success":
        case "redeploy":
        case "terminate_deployment":
        case "rollback":
        case "submit_confirm":
          this.operateSet(row, key);
          break;
        case "ssh":
          this.getSsh(row);
          break;
        case "view_deployment_log":
          this.viewLog(row, "deploy");
          break;
        case "view_task_log":
          this.viewLog(row, "task");
          break;
        case "submit_review":
          this.submitReview(row, key);
          break;
        case "view_review_comments":
          this.reviewComments(row);
          break;
        case "accept_order":
          this.onAcceptOrder(row, key);
          break;
        case "passed_order":
          this.orderTransfer(row, key)
          return;
        case "handle":
          this.onHandle(row)
          return;
        default:
          break;
      }
    },
     //socket接收消息
     wsReceive() {
      let that = this;
      that.global.ws.onmessage = function(res) {
        let receiveData = JSON.parse(res.data);
        if (receiveData.msg_type == "subscribe") {
          that.taskList.forEach((item, index) => {
            if (item.sst_uuid == receiveData.data.uuid) {
              item.task_info.task_progress = +receiveData.data.task_progress;
              if (
                receiveData.data.task_status === "success" ||
                receiveData.data.task_status === "fail"
              ) {
                that.getDataList(
                  getSession("searchFresh").keyword,
                  getSession("searchFresh").pageNo,
                  getSession("searchFresh").pageSize
                );
              }
            }
          });
        }
      };
    },
    // socket发送消息
    wsSend(channel) {
      let that = this;
      let sendData = {
        msg_type: "subscribe",
        data: { channels: channel }
      };
      console.log(JSON.stringify(sendData));
      if (that.global.ws && that.global.ws.readyState == 1) {
        that.global.ws.send(JSON.stringify(sendData));
      }
    },
    //打开日志弹框时，更新当前页面进度条
    updateTaskStaus(receiveData) {
      this.taskList.forEach(item => {
        if (item.sst_uuid == receiveData.data.uuid) {
          item.task_info.task_progress = +receiveData.data.task_progress;
          if (
            receiveData.data.task_status === "success" ||
            receiveData.data.task_status === "fail"
          ) {
            this.getDataList(
              getSession("searchFresh").keyword,
              getSession("searchFresh").pageNo,
              getSession("searchFresh").pageSize
            );
          }
        }
      });
    },
    //记录日志打开次数
    updateLogFlag(service_set_task_id){
      this.logFlag[service_set_task_id] = true
    },

    //ssh提交
    getSsh(row) {
      let para = {
        app_id:row.app_id,
        ticket_id: row.ticket_id,
        service_set_task_id: row.service_set_task_id,
      };
      taskRequestMethod
        .getsshUrl("get", para)
        .then(res => {
          if (res.code == 200) {
            //成功时
            let url = this.baseConfig.SSH_URL + "?ssh=" + res.data.ssh+"&location="+res.data.location;
            window.open(
              url,
              "Derek",
              "height=880,width=1040,status=no,toolbar=no,menubar=no,location=no"
            );
          } else {
            this.$message.error(res.message);
          }
        })
        .catch();
    },
    // 交付计划获取交付负责人，复核人
    getGroupUser(){
      appRequestMethod.getGroupUser('get').then(res => {
        if(res.code == 200){
          this.groupUserList = res.data.items
        }else {
          this.$message.error(res.message);
        }
      })
    },

    // 获取交付人,复核人 name
    get_name(id) {
      if(id){
        let name;
      let deliver_id, group_id;
      if (id.length === 1) {
        group_id = id[0]
        this.groupUserList.forEach((item, index) => {
          if (item.id == group_id) {
            name = item.name;
          }
        })
      } else if (id.length === 2) {
        let users;
        group_id = id[0];
        deliver_id = id[1];
        this.groupUserList.forEach((item, index) => {
          if (item.id == group_id) {
            users = item.users;
            users.forEach((item, index) => {
              if (item.id == deliver_id) {
                name = item.name
              }
            })
          }
        })
      } else if (id.length === 0) {
        name = '--';
      }
      return name;
      }else{
        return '--';
      }

    },
    // 接单操作---第五步
    onAcceptOrder(row, key){
      let para = {
        node_set_id: row.node_set_id,
        state: row.task_status_type.type,
        operate: key
      }
      appRequestMethod.passOrder('post', para).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message)
            this.getTicketDeliverPlan();
        } else {
          this.$message.error(res.message)
        }
      })

    },
    // 转单操作----第五步
    orderTransfer(row, key){
      this.dialogFormVisible = true
      let body = {};
      let is_delivery;
      let group_id;
      let trans_type;
      if(row.task_status_type){
        if(row.task_status_type.type === 'ToBeDeployed'){
          is_delivery = 1;
          group_id = row.deliver_user[0];
          trans_type = 1
        }else if(row.task_status_type.type === 'ToBeReviewed'){
          is_delivery = 0;
          group_id = row.review_user[0];
          trans_type = 2;
        }
      }
      body = {
        transfer_to: null,
        ticket_step_id: +this.orderInfo.ticket_step_id,
        current_state:row.task_status_type.type,
        operate: key,
        is_delivery: is_delivery
      }
      let params = {
        app_id: this.orderInfo.app_id,
        ticket_id: this.orderInfo.ticket_id,
        node_id:row.node_id,
        set_id:row.node_set_id,
        product:row.node_name,
        opertation:row.node_set_name,
        body:body,
        groupUserList: this.groupUserList,
        group_id: group_id,
        trans_type:trans_type,
      }
      this.dataInfo = params;
    },
  },
};
