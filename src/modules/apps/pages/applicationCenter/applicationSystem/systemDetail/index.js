import template from "./index.vue";
//引入编辑应用系统组件(新建和编辑共用了一个组件，后续所需参数在props中继续增加)-样式之后再修改
import systemAddEdit from "../components/systemAddEdit";
//引入成员列表组件(新建和编辑共用了一个组件，后续所需参数在props中继续增加)-样式之后再修改
import systemMemberAddEdit from "../components/systemMemberAddEdit";
//引入API
import * as requestMethod from "../../../../api/applicationCenter/applicationSystem";
//
import approvalFlowChart from "../../myApproval/approvalDetail/approvalFlowChart.vue";
import displayStep from "../../myOrder/components/step.vue";
//生成模板
import orderTemplate from "../../myOrder/components/template.vue";
//引入部署视图组件
import deployView from "./components/deploymentView.vue";
import AppDeployView from "./components/appDeployView";
import deployArch from "./components/deploymentViewArch.vue";
//引入虚拟机和裸机组件
import vmTabPane from "./components/vmTabPane.vue"
import opsTabPane from "./components/opsTabPane.vue"

import setAccount from "./components/setAccount.vue"
import deployUnitSet from "./components/deployUnitSet.vue"
//引入应用系统架构图组件
import applicationArchitecture from "./components/applicationArchitecture.vue";
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue";
//引入公共详情头部组件
import detailTitle from "@/components/detailTitle.vue";
//引入导入报告
import exportReport from "./components/exportReport";
import TagInDetails from "@/components/tagManagement/tagInDetails";
import TagInDelete from "@/components/tagManagement/tagInDelete";
import checkReport from "../../components/checkReport/checkReport.vue";
export default {
  ...template,
  name: "systemDetail",
  data() {
    return {
      logo: require("@/commons/images/g_app_detail.svg"),
      isArch: true,
      //面包屑数据
      breadCrumbData: [{
          name: "应用系统",
          path: "/applicationCenter/applicationSystem"
        },
        {
          name: "应用系统详情",
          path: ""
        }
      ],
      //appId
      appId: null,
      orgId: null,
      //详情数据
      systemDetailData: {
        app_name: "测试名称",
        bus_name: "xxxx",
        app_base_level: [],
        app_base_type: "业务类型系统",
        app_base_env: "生产环境"
      },
      //编辑应用系统抽屉
      editSystemVisible: false,
      //tab切换
      activeName: "list",
      //订单
      orderTableLoading: false,
      orderTableData: [],
      can_modify: false,
      service_name: "",
      drawerTag: null,
      // 模板
      templateDialogVisible: false,
      templateData: {},
      // 标签
      tagInDetails: {
        show: false
      },
      tagList: [], //this.$route.query.tagDetailsList,
      // 标签删除
      tagInDelete: {
        show: false
      },
      //查看报告
      defaultConfig: {
        exportDrawer: false,
        exportDrawerIframe: false,
        ticket_id: null,
        app_id: null
      },
      //设置账号弹窗
      showSetAccountDialog:false,
      showDeployUnitDialog:false,
      deployUnitSetConfig:{},
      userAccountSetConfig:{},
      tabTemplate:null,
      dataType:"",
      status: {
        0: "el-icon-circle-plus",
        1: "el-icon-error",
        2: "el-icon-error",
        3: "el-icon-remove",
        4: "el-icon-circle-plus",
        10: "el-icon-success"
      },
    };
  },
  components: {
    approvalFlowChart,
    deployView,
    pageHeader,
    systemAddEdit,
    systemMemberAddEdit,
    applicationArchitecture,
    detailTitle,
    deployArch,
    exportReport,
    displayStep,
    orderTemplate,
    TagInDetails,
    TagInDelete,
    checkReport,
    vmTabPane,
    opsTabPane,
    setAccount,
    deployUnitSet,
    AppDeployView
  },
  created() {
    this.activeName = this.$route.query.selectedTab;
    //根据路由获取appId
    this.appId = parseInt(this.$route.query.app_id);
  },
  mounted() {
    //根据appId获取应用系统详情
    this.getSystemDetail(this.appId);
    //获取订单列表详情
    this.getOrderList(this.appId);
    this.getCanvasData();
    this.getTagList();
  },
  methods: {
    //应用架构图是否可编辑
    getCanvasData() {
      let param = {
        //app_id: 10,
        app_id: this.appId
      };
      requestMethod.getAppsArch("get", param).then(res => {
        if (res.code === 200) {
          this.can_modify = res.data.can_modify;
        }
      });
    },
    //获取数据详情
    getSystemDetail(app_id) {
      requestMethod.getSystemDetail("get", app_id).then(res => {
        if (res.code === 200) {
          this.systemDetailData = res.data.app_info;
          this.orgId = res.data.app_info.org_id;
          this.service_name = res.data.app_name;
          console.log("getSystemDetail", res.data);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    //返回点击事件
    goBack() {
      this.$router.push({
        path: "/applicationCenter/applicationSystem"
      });
    },
    //tab切换事件
    selectedTab(val) {
      console.log(val.name);
      switch (val.name) {
          case "vm":
              this.tabTemplate = this.$refs.vmTab
              this.dataType = "vm"
          break;
          case "ops":
              this.tabTemplate = this.$refs.opsTab
              this.dataType = "ops"
          break;
      }
    },
    //编辑应用系统抽屉事件
    beforeCloseEditSystem(done) {
      done();
    },
    //编辑应用系统点击事件
    onEditSystem() {
      this.editSystemVisible = true;
    },
    //子组件编辑按钮提交触发事件
    handelSubmitSystemEdit() {
      console.log("submitSystemEdit");
      this.editSystemVisible = false;
      //刷新数据
      this.getSystemDetail(this.appId);
    },
    //子组件取消按钮提交触发事件
    handelCancelSystemEdit() {
      console.log("cancelSystemEdit");
      this.editSystemVisible = false;
    },
    //----------------------------------订单模块------------------------------
    //创建订单
    // addOrder() {
    //   this.$router.push({
    //     path: '/applicationCenter/applicationSystem/addOrder/addOrderFirst',
    //     query: {
    //       isAdd: true
    //     }
    //   })
    // },
    // //申请服务
    // applyService() {
    //   this.$router.push({
    //     path: '/applicationCenter/serviceCatalog'
    //   })

    // },
    //订单列表获取
    getOrderList(app_id) {
      this.orderTableLoading = true;
      requestMethod.getSystemOrderList("get", app_id).then(res => {
        if (res.code === 200) {
          res.data.items.forEach((item, index) => {
            item.active = item.ticket_step_type.indexOf(item.step_type);
            if (item.active == -1) {
              item.step_type = "";
            }
          });
          this.orderTableData = res.data.items;
          console.log("getOrderList", this.orderTableData);
        } else {
          this.$message.error(res.message);
        }
        this.orderTableLoading = false;
      });
    },
    //订单列表中订单编号点击事件
    orderDetail(row) {
      this.$router.push({
        path: "/applicationCenter/applicationSystem/systemOrderDetail/deplomentView",
        query: {
          from: 'system',
          ticket_id: row.ticket_id,
          app_id: row.app_id,
          activeName: "view",
          menu_id: this.$route.query.menu_id,
          step_type: row.step_type
        }
      });
    },
    //处理操作集
    onHandle(row, key) {
      // console.log(key);
      // console.log(3333);
      // key = 'export_id';
      switch (key) {
        //编辑
        case "edit_id":
          this.onEditOrder(row);
          return;
          //删除
        case "del_id":
          this.onDeleteOrder(row);
          return;
          //撤销
        case "revoke_id":
          this.onCancelOrder(row);
          return;
          //处理
        case "handle_id":
          this.onHandelOrder(row);
          return;
          //导出报告
        case "export_id":
          this.onExport(row, key);
          return;
          //生成模板
          case "template_id":
            this.onTemplate(row);
            return;
        default:
          break;
      }
    },
    //导出报告按钮
    onExport(row, key) {
      window.open(`/apps.html#/report?ticket_id=${row.ticket_id}&app_id=${row.app_id}&ticket_name=${row.ticket_name}`)
      // this.defaultConfig.ticket_id = row.ticket_id;
      // this.defaultConfig.app_id = row.app_id;
      // this.defaultConfig.exportDrawer = true;
      // let that = this;
      // setTimeout(() => {
      //   that.defaultConfig.exportDrawerIframe = true;
      // }, 260);
    },
    //关闭导出报告抽屉
    handleClose() {
      this.defaultConfig.exportDrawer = false;
      this.defaultConfig.exportDrawerIframe = false;
    },

    setDrawerTag(row, key) {
      this.drawerTag = key;
    },
    //订单列表中编辑按钮
    onEditOrder(row) {
      //ticket_type:1,//1:快速申请，2:蓝图定义
      this.$router.push({
        path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
        query: {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          operation: "edit",
          ticket_type: row.apply_type, //1:快速申请，2:蓝图定义
          service_name: this.service_name,
          from: "app",
          ticket_name:row.ticket_name
        }
      });
      // //当是快速服务申请时
      // if (row.apply_type === 1) {
      //   this.$router.push({
      //     path:
      //       "/applicationCenter/serviceCatalog/applyService/applyServicePrev",
      //     query: {
      //       app_id: this.appId,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      //   //当是蓝图定义时
      // } else if (row.apply_type === 2) {
      //   this.$router.push({
      //     path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
      //     query: {
      //       app_id: this.appId,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      // }
    },
    //订单列表中的处理按钮 需求收集审批-处理操作 资源规划-处理，资源规划审批-处理， 资源部署-处理
    onHandelOrder(row) {
      //ticket_type:1,//1:快速申请，2:蓝图定义
      this.$router.push({
        path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
        query: {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          operation: "edit",
          ticket_type: row.apply_type, //1:快速申请，2:蓝图定义
          step_id: row.ticket_step_id,
          from: "app",
          ticket_num: row.ticket_number,
          ticket_name:row.ticket_name
        }
      });
      // //当是快速服务申请时
      // if (row.apply_type === 1) {
      //   this.$router.push({
      //     path:
      //       "/applicationCenter/serviceCatalog/applyService/applyServicePrev",
      //     query: {
      //       app_id: this.appId,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      //   //当是蓝图定义时
      // } else if (row.apply_type === 2) {
      //   this.$router.push({
      //     path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
      //     query: {
      //       app_id: this.appId,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      // }
    },
    //订单列表中删除按钮
    onDeleteOrder(row) {
      this.$confirm("确认删除该订单吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          this.orderTableLoading = true;
          requestMethod.orderDelete("delete", row.ticket_id).then(res => {
            if (res.code == 200) {
              if (res.status) {
                this.$message.success(res.message);
                this.getOrderList(this.appId);
              } else {
                this.$message.warning(res.message);
              }
            } else {
              this.$message.error(res.message);
            }
            this.orderTableLoading = false;
          });
        })
        .catch(() => {});
    },
    //订单列表中撤销按钮
    onCancelOrder(row) {
      this.$confirm("确认撤销该订单吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          this.orderTableLoading = true;
          requestMethod
            .orderCancel("post", {
              app_id: this.appId,
              ticket_id: row.ticket_id
            })
            .then(res => {
              if (res.code == 200) {
                if (res.status) {
                  this.$message.success(res.message);
                  this.getOrderList(this.appId);
                } else {
                  this.$message.warning(res.message);
                }
              } else {
                this.$message.error(res.message);
              }
              this.orderTableLoading = false;
            });
        })
        .catch(() => {});
    },
    //生成模板按钮
    onTemplate(row) {
      this.templateData = {
        app_id: row.app_id,
        ticket_id: row.ticket_id
      };
      this.templateDialogVisible = true;
    },
    //生成模板成功处理
    templateSuccess() {
      this.templateDialogVisible = false;
      this.getOrderList(this.appId);
    },
    //生成模板取消处理
    templateCancel() {
      this.templateDialogVisible = false;
    },
    //格式化icon
    formateIcon(key) {
      return this.status[key];
    },
    //格式化订单状态
    formatStatus(row) {
      switch (row) {
        case 0:
          return "设计中";
        case 2:
          return "已驳回";
        case 3:
          return "未处理";
        case 4:
          return "处理中";
        case 10:
          return "完成";
        default:
          break;
      }
    },
    addTag() {
      this.tagInDetails = {
        show: true,
        app_id: String(this.appId)
      };
    },
    closeDialog() {
      this.tagInDetails.show = false;
      this.tagInDelete.show = false;
    },
    removeTags() {
      this.tagInDelete = {
        show: true,
        app_id: String(this.appId)
      };
    },
    getTagList() {
      let para = {
        obj_id: this.appId,
        obj_type: "app_system",
        tag_category: 7
      };
      requestMethod.getBatchTagList("get", para).then(res => {
        if (res.code === 200) {
          this.tagList = res.data.items;
        }else {
          this.tagList = []
        }
      });
    },
    //展示设置账号弹窗
    showSetAccount() {
        if(this.tabTemplate.config.node_ids.length == 0) {
            this.$message.warning("请选择主机")
            return
        }
        this.showSetAccountDialog = true
        this.userAccountSetConfig = this.tabTemplate.config
    },
    //展示关联部署单元弹窗
    showDeployUnit() {
        if(this.tabTemplate.config.obj_ids.length == 0) {
            this.$message.warning("请选择主机")
            return
        }
        this.showDeployUnitDialog = true
        this.deployUnitSetConfig = this.tabTemplate.config
    }
  }
};
