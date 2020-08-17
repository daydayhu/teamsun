import template from './index.vue';
import pageHeader from '@/components/pageHeader.vue';
import enumSearch from '@/components/searchCom/enumSearch.vue';
import Pagination from '@/components/pagination';
//引入转单组件
import orderTransfer from './components/orderTransfer';
//引入复核组件
import orderReview from './components/orderReview';
//引入复核记录组件
import orderReviewComments from './components/orderReviewComments';
//引入ssh组件
import ssh from './components/ssh';
//引入处理记录组件
import processRecord from './components/processRecord';
//订单报告
import checkReport from '../components/checkReport/checkReport.vue';
// 空页面
import EmptyInTable from '@/components/emptyLayout/emptyInTable';
//引入API
import * as requestMethod from '../../../api/applicationCenter/myTask';
import * as appRequestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';
import * as utils from '@/utils/utils.js';
import {
  getSession,
} from '@/commons/js/searchFresh.js';

export default {
  ...template,
  data() {
    return {
      searchNeedData: {
        data: [],
      },
      //任务列表
      taskLoading: false,
      taskList: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1,
      },
      groupUserList: [],
      defaultSearch: {
        isInput: true,
        isSave: true,
        isShuxing: false,
        isShuxingzhi: true,
        shuxing: '状态',
        shuxingzhi: '未处理|待执行|执行中',
        valueType: 3,
      },
      // //转单
      resendDialogVisible: false,
      transferData: {},
      // 复核
      reviewDialogVisible: false,
      reviewData: {},
      //复核意见列表数据
      reviewCommentDialogVisible: false,
      reviewCommentsData: {},
      //ssh数据
      sshDialogVisible: false,
      sshData: {},
      //订单报告
      defaultConfig: {
        exportDrawer: false,
        exportDrawerIframe: false,
        ticket_id: null,
        app_id: null,
      },
      //
      step_type: {
        1: '需求收集',
        2: '需求收集审批',
        3: '资源规划',
        4: '资源规划审批',
        5: '资源部署',
      },
      status: {
        ToBeDeployed: 'el-icon-remove',
        Deploying: 'el-icon-circle-plus',
        FailedDeployment: 'el-icon-error',
        RollBacking: 'el-icon-circle-plus',
        FailedRollback: 'el-icon-error',
        RolledBack: 'el-icon-success',
        SuccessfulDeployment: 'el-icon-success',
        ToBeReviewed: 'el-icon-remove',
        FailedReview: 'el-icon-error',
        Completed: 'el-icon-success',
        1: 'el-icon-remove',
        2: 'el-icon-remove',
        3: 'el-icon-success',
        7: 'el-icon-remove',
        8: 'el-icon-circle-plus',
        9: 'el-icon-success',
      },
      processRecordVisible: false, // 处理记录弹框开关
      currentProcessRecordData: null // 当前处理记录数据
    };
  },
  mounted() {
    this.getGroupUser();
  },
  methods: {
    searchContdition() {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
        getSession('searchFresh').pageSize);
    },
    //搜索事件
    toSearch(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
        getSession('searchFresh').pageSize);
    },
    //获取任务列表
    getDataList(data, pageNo, pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data),
      };
      this.taskLoading = true;
      requestMethod.getTaskListN('get', para).then(res => {
        if (res.code == 200) {
          //测试状态-目前状态字段未定义
          res.data.items.forEach(element => {
            element.status = '复核失败';
          });
          this.taskList = res.data.items;
          this.pagination = res.data.pagination_data;
          console.log('getTaskList', this.taskList);
        } else {
          this.$message.error(res.message);
        }

        this.taskLoading = false;

      }).catch();
    },
    // 交付计划获取交付负责人，复核人
    getGroupUser() {
      appRequestMethod.getGroupUser('get').then(res => {
        if (res.code == 200) {
          this.groupUserList = res.data.items;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取交付人,复核人 name
    get_name(id) {
      if (id) {
        let name;
        let deliver_id, group_id;
        if (id.length === 1) {
          group_id = id[0];
          this.groupUserList.forEach((item, index) => {
            if (item.id == group_id) {
              name = item.name;
            }
          });
        } else if (id.length === 2) {
          let users;
          group_id = id[0];
          deliver_id = id[1];
          this.groupUserList.forEach((item, index) => {
            if (item.id == group_id) {
              users = item.users;
              users.forEach((item, index) => {
                if (item.id == deliver_id) {
                  name = item.name;
                }
              });
            }
          });
        } else if (id.length === 0) {
          name = '--';
        }
        return name;
      } else {
        return '--';
      }

    },
    // 上下分页
    handleCurrentChange(val) {
      this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize);
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val);
    },
    //订单列表中订单编号点击事件
    orderDetail(row) {
      this.$router.push({
        path: '/applicationCenter/applicationSystem/systemOrderDetail/deliverPlan',
        query: {
          from: 'deploy',
          ticket_id: row.ticket_id,
          app_id: row.app_id,
          activeName: 'plan',
          menu_id: this.$route.query.menu_id,
          //step_type: row.step_type_number
        },
      });
    },
    //进度-跳转到部署任务菜单
    onProgress(row) {
      this.$router.push({
        path: '/applicationCenter/deploymentTask',
        query: {
          from: 'mytask',
          ticket_num: row.ticket_number,
        },
      });
    },
    //查看报告
    // onReport(row){
    //   // this.$router.push({
    //   //   path: '/applicationCenter/report',
    //   // })
    //   let url = location.origin + location.pathname + '#/applicationCenter/report'
    //   console.log("onReport", url)
    //   window.open(url)

    // },
    //跳转到报告页面
    onReport(row) {
      window.open(`/apps.html#/report?ticket_id=${row.ticket_id}&app_id=${row.app_id}&ticket_name=${row.ticket_name}`);
      // this.defaultConfig.ticket_id = row.ticket_id
      // this.defaultConfig.app_id = row.app_id
      // this.defaultConfig.exportDrawer = true
      // let that = this
      // setTimeout(() => {
      //   that.defaultConfig.exportDrawerIframe = true
      // }, 260);
    },
    //关闭导出报告抽屉
    handleClose() {
      this.defaultConfig.exportDrawer = false;
      this.defaultConfig.exportDrawerIframe = false;
    },
    //操作栏按钮事件
    onActions(row, item) {
      switch (item.key) {
        case 'handle':
          //处理
          this.onHandle(row, item.key);
          return;
        case 'take':
          //第三步接单
          this.onReceive3(row, item.key);
          return;
        case 'accept_order':
          //接单-第五步
          this.onReceive5(row, item.key);
          //this.handleOperation(row, item.key)
          return;
        case 'transfer':
          //第三步转单
          this.onResend3(row, item.key);
          return;
        case 'passed_order':
          //转单-第五步
          this.onResend5(row, item.key);
          return;
        case 'deploy':
          //部署-1
          this.handleOperation(row, item.key);
          return;
        case 'deploy_to_success':
          //部署成功1
          this.handleOperation(row, item.key);
          return;
        case 'redeploy':
          //重新部署1
          this.handleOperation(row, item.key);
          return;
        case 'terminate_deployment':
          //终止部署1
          this.handleOperation(row, item.key);
          return;
        // case "view_deployment_log":
        //   //查看部署日志-不写
        //   this.receiveDepLog(row)
        //   return;
        // case "view_task_log":
        //   //查看任务日志-不写
        //   this.receiveTaskLog(row)
        //   return;
        case 'rollback':
          //回滚1
          this.handleOperation(row, item.key);
          return;
        case 'ssh':
          //ssh
          this.getSsh(row);
          return;
        case 'confirm':
          //确认-第三步
          this.onConfirm(row, item.key);
          return;
        case 'submit_confirm':
          //提交确认1
          this.handleOperation(row, item.key);
          return;
        case 'submit_review':
          //提交复核
          this.submitReview(row, item.key);
          return;
        // case "view_review_comments":
        //   //查看复核意见-需单独操作
        //   this.reviewComments(row)
        //   return;
        default:
          break;
      }

    },
    //处理按钮
    onHandle(row, key) {
      this.$router.push({
        path: '/applicationCenter/applicationSystem/addOrder/addOrderFirst',
        query: {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          operation: 'edit',
          ticket_type: row.apply_type, //1:快速申请，2:蓝图定义
          step_id: row.ticket_step_id,
          from: 'order',
          ticket_num: row.ticket_number,
        },
      });

    },
    //操作集合处理
    handleOperation(row, key) {
      this.$confirm('确认执行此操作吗?', '提示', {
        type: 'warning',
      }).then(() => {
        let para = {
          node_set_id: row.node_set_id,
          state: row.task_status,
          operate: key,
        };
        this.taskLoading = true;
        requestMethod.taskOperate('post', para).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
              getSession('searchFresh').pageSize);
          } else {
            this.$message.error(res.message);
          }
          this.taskLoading = false;
        });

      }).catch(() => {
      });
    },
    //查看部署日志
    receiveDepLog(row) {},
    //查看任务日志
    receiveTaskLog(row) {},
    //提交确认-第三步
    onConfirm(row, key) {
      this.$confirm('确认执行此操作吗?', '提示', {
        type: 'warning',
      }).then(() => {
        let para = {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          node_id: row.node_id,
          set_id: row.node_set_id,
          body: {
            ticket_step_id: row.ticket_step_id,
          },
        };
        this.taskLoading = true;
        requestMethod.taskComfirm('put', para).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
              getSession('searchFresh').pageSize);
          } else {
            this.$message.error(res.message);
          }
          this.taskLoading = false;
        });

      }).catch(() => {
      });
    },
    //接单-第三步
    onReceive3(row, key) {
      this.$confirm('确认执行此操作吗?', '提示', {
        type: 'warning',
      }).then(() => {
        let para = {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          node_id: row.node_id,
          set_id: row.node_set_id,
          body: {
            ticket_step_id: row.ticket_step_id,
          },
        };
        this.taskLoading = true;
        requestMethod.taskTake('put', para).then(res => {
          if (res.code == 200) {
            this.$message.success(res.message);
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
              getSession('searchFresh').pageSize);
          } else {
            this.$message.error(res.message);
          }
          this.taskLoading = false;
        });

      }).catch(() => {
      });

    },
    //接单第五步
    onReceive5(row, key) {
      let para = {
        node_set_id: row.node_set_id,
        state: row.task_status,
        operate: key,
      };
      this.taskLoading = true;
      requestMethod.passOrder('post', para).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message);
          this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
            getSession('searchFresh').pageSize);
        } else {
          this.$message.error(res.message);
        }
        this.taskLoading = false;
      });

    },
    //-------------------------转单功能---------------------------
    //转单-阶段3
    onResend3(row, key) {
      //设置转单表单数据
      this.transferData = {
        node_name: row.node_name,
        node_set_name: row.node_set_name,
        app_id: row.app_id,
        ticket_id: row.ticket_id,
        node_id: row.node_id,
        set_id: row.node_set_id,
        ticket_step_id: row.ticket_step_id,
        group_id: row.devilery_user[0],
        step: row.step_type,
        userLabel: '交付负责人',
        // current_state: row.task_status,
        operate: key,
      },
        this.resendDialogVisible = true;
    },
    //转单-第五阶段
    onResend5(row, key) {
      let group_id, userLabel, is_delivery;
      //如果是待部署阶段
      if (row.task_status == 'ToBeDeployed') {
        group_id = row.devilery_user[0];
        userLabel = '交付负责人';
        is_delivery = 1;
      } else {
        group_id = row.review_user[0];
        userLabel = '复核人';
        is_delivery = 0;
      }
      //
      // //当是待部署时为交付负责人
      // if (this.transferData.current_state == "ToBeReviewed") {
      //   is_delivery = 0;
      // } else if (this.transferData.current_state == "ToBeDeployed") {
      //   //当为待复核时是-复核人
      //   is_delivery = 1;
      // }
      //设置转单表单数据
      this.transferData = {
        node_name: row.node_name,
        node_set_name: row.node_set_name,
        app_id: row.app_id,
        ticket_id: row.ticket_id,
        node_id: row.node_id,
        set_id: row.node_set_id,
        ticket_step_id: row.ticket_step_id,
        group_id: group_id,
        userLabel: userLabel,
        step: row.step_type,
        current_state: row.task_status,
        operate: key,
        is_delivery: is_delivery,
      },
        this.resendDialogVisible = true;
    },
    //转单成功处理
    transferSuccess() {
      this.resendDialogVisible = false;
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
        getSession('searchFresh').pageSize);
    },
    //转单取消处理
    transferCancel() {
      this.resendDialogVisible = false;
    },

    //-------------------------处理记录---------------------------
    showProcessRecordDialog(data) {
      if (data) {
        this.currentProcessRecordData = data
      }
      this.processRecordVisible = true;
    },
    closeProcessRecordDialog() {
      this.processRecordVisible = false;
    },

    //-------------------------ssh功能---------------------------
    //ssh
    ssh(row) {
      //设置ssh数据
      this.sshData = {
        node_set_id: row.node_set_id,
        app_id: row.app_id,
        ticket_id: row.ticket_id,
      };
      this.sshDialogVisible = true;
    },
    //ssh提交
    getSsh(row) {
      let para = {
        node_set_id: row.node_set_id,
        app_id: row.app_id,
        ticket_id: row.ticket_id,
      };
      requestMethod.getsshUrl('get', para).then(res => {
        if (res.code == 200) {
          //成功时
          let url = this.baseConfig.SSH_URL + '?ssh=' + res.data.ssh;
          window.open(
            url,
            'Derek',
            'height=880,width=1040,status=no,toolbar=no,menubar=no,location=no',
          );
        } else {
          this.$message.error(res.message);
        }
      }).catch();
    },
    //ssh成功处理
    sshSuccess() {
      this.sshDialogVisible = false;
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
        getSession('searchFresh').pageSize);
    },
    //ssh取消处理
    sshCancel() {
      this.sshDialogVisible = false;
    },
    //-------------------------复核功能---------------------------
    //提交复核
    submitReview(row, key) {
      //设置复核数据
      this.reviewData = {
        node_set_id: row.node_set_id,
        ticket_step_id: row.ticket_step_id,
        current_state: row.task_status,
        operate: key,
      };
      this.reviewDialogVisible = true;
    },
    //复核成功处理
    reviewSuccess() {
      this.reviewDialogVisible = false;
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo,
        getSession('searchFresh').pageSize);
    },
    //复核取消处理
    reviewCancel() {
      this.reviewDialogVisible = false;
    },
    //-------------------------复核意见查看功能---------------------------
    //查看复核意见
    reviewComments(row) {
      //设置复核意见数据
      this.reviewCommentsData = {
        ticket_step_id: row.ticket_step_id,
        node_set_id: row.node_set_id,
      };
      this.reviewCommentDialogVisible = true;
    },
    //复核意见关闭处理
    reviewCommentCancel() {
      this.reviewCommentDialogVisible = false;
    },
    //
    formatStepType(step_type) {
      return this.step_type[step_type];
    },
    //格式化icon
    formateIcon(key) {
      return this.status[key];
    },
    // //scope.row.handle_status.key==''||scope.row.handle_status.key=='Completed'
    // formatReview(actions) {
    //   actions.some(e => {
    //     if (e.key == 'view_review_comments') {
    //       return true
    //     }
    //   })
    // }
    //
    formateName(str, len) {
      // str.substr(0, len)
      //str=str+"..."
      // return str.substr(0, len)
      if (str && str.length > len) {
        return str.substr(0, len) + '...';
      } else {
        return str;
      }
    },
  },
  components: {
    pageHeader,
    Pagination,
    enumSearch,
    orderTransfer,
    orderReview,
    orderReviewComments,
    ssh,
    checkReport,
    EmptyInTable,
    processRecord
  },
};
