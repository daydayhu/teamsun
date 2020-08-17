import template from "./index.vue";
import pageHeader from "@/components/pageHeader.vue";
import enumSearch from "@/components/searchCom/enumSearch.vue";
import Pagination from "@/components/pagination";
import displayStep from "./components/step.vue";
import orderTemplate from "./components/template.vue";
import checkReport from "../components/checkReport/checkReport.vue";
//
import approvalFlowChart from "../myApproval/approvalDetail/approvalFlowChart.vue";
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
//引入API
import * as requestMethod from "../../../api/applicationCenter/myOrder";
import { getSession } from "@/commons/js/searchFresh.js";
export default {
  ...template,
  data() {
    return {
      searchNeedData: {
        data: []
      },
      //订单
      active: 0,
      orderTableLoading: false,
      orderTableData: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      //
      status: {
        0: "el-icon-circle-plus",
        1: "el-icon-error",
        2: "el-icon-error",
        3: "el-icon-remove",
        4: "el-icon-circle-plus",
        10: "el-icon-success"
      },
      // 模板
      templateDialogVisible: false,
      templateData: {},
      defaultConfig: {
        exportDrawer: false,
        exportDrawerIframe: false,
        ticket_id: null,
        app_id: null
      }
    };
  },
  mounted() {
    // this.getDataList(
    //   getSession("searchFresh").keyword,
    //   getSession("searchFresh").pageNo,
    //   getSession("searchFresh").pageSize
    // );
  },
  methods: {
    toSearch(val) {
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
    },
    searchContdition() {
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
    },
    //获取订单列表
    getDataList(data, pageNo, pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.orderTableLoading = true;
      requestMethod.getOrderList("get", para).then(res => {
        if (res.code == 200) {
          res.data.items.forEach((item, index) => {
            item.active = item.ticket_step_type.indexOf(item.step_type);
            if (item.active == -1) {
              item.step_type = "";
            }
          });
          this.orderTableData = res.data.items;
          console.log("this.orderTableData", this.orderTableData);
          this.pagination = res.data.pagination_data;
        } else {
          this.$message.error(res.message);
        }
        this.orderTableLoading = false;
      });
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
    //订单列表中订单编号点击事件
    orderDetail(row) {
      this.$router.push({
        path: "/applicationCenter/myOrder/orderDetail/deplomentView",
        query: {
          from:'myOrder',
          ticket_id: row.ticket_id,
          app_id: row.app_id,
          activeName: "view",
          menu_id: this.$route.query.menu_id,
          step_type: row.step_type_number
        }
      });
    },
    //处理操作集
    handleOperate(row, key) {
      switch (key) {
        case "edit_id":
          this.onEdit(row);
          return;
        case "del_id":
          this.onDelete(row);
          return;
        case "revoke_id":
          this.onCancel(row);
          return;
        case "handle_id":
          this.onHandle(row);
          return;
        case "export_id":
          this.onExport(row);
          return;
        case "template_id":
          this.onTemplate(row);
          return;
        default:
          break;
      }
    },
    //导出报告按钮
    onExport(row) {
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
    //订单列表中编辑按钮
    onEdit(row) {
      //ticket_type:1,//1:快速申请，2:蓝图定义
      this.$router.push({
        path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
        query: {
          app_id: row.app_id,
          ticket_id: row.ticket_id,
          operation: "edit",
          ticket_type: row.apply_type, //1:快速申请，2:蓝图定义
          step_type: row.step_type_number,
          from:"order",
          ticket_name:row.ticket_name
        }
      });
      // if (row.apply_type === 1) {
      //   this.$router.push({
      //     path:
      //       "/applicationCenter/serviceCatalog/applyService/applyServicePrev",
      //     query: {
      //       app_id: row.app_id,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      //   //当是蓝图定义时
      // } else if (row.apply_type === 2) {
      //   this.$router.push({
      //     path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
      //     query: {
      //       app_id: row.app_id,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      // }
    },
    //订单列表中撤销按钮orderCancel
    onCancel(row) {
      this.$confirm("确认撤销该订单吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.orderTableLoading = true;
          requestMethod
            .orderCancel("post", {
              app_id: row.app_id,
              ticket_id: row.ticket_id
            })
            .then(res => {
              if (res.code == 200) {
                if (res.status) {
                  this.$message.success(res.message);
                  this.getDataList(
                    getSession("searchFresh").keyword,
                    getSession("searchFresh").pageNo,
                    getSession("searchFresh").pageSize
                  );
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
    //订单列表中删除按钮
    onDelete(row) {
      this.$confirm("确认删除该订单吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.orderTableLoading = true;
          requestMethod.orderDelete("delete", row.ticket_id).then(res => {
            if (res.code == 200) {
              if (res.status) {
                this.$message.success(res.message);
                this.getDataList(
                  getSession("searchFresh").keyword,
                  getSession("searchFresh").pageNo,
                  getSession("searchFresh").pageSize
                );
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
    //订单列表中的处理按钮
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
          from: "order",
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
      //       app_id: row.app_id,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      //   //当是蓝图定义时
      // } else if (row.apply_type === 2) {
      //   this.$router.push({
      //     path: "/applicationCenter/applicationSystem/addOrder/addOrderFirst",
      //     query: {
      //       app_id: row.app_id,
      //       ticket_id: row.ticket_id,
      //       operation: "edit"
      //     }
      //   });
      // }
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
      this.getDataList(
        getSession("searchFresh").keyword,
        getSession("searchFresh").pageNo,
        getSession("searchFresh").pageSize
      );
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
        case 1:
          return "已撤销";
        case 2:
          return "已驳回";
        case 3:
          return "未处理";
        case 4:
          return "处理中";
        case 10:
          return "已完成";
        default:
          break;
      }
    }
  },
  components: {
    pageHeader,
    Pagination,
    enumSearch,
    approvalFlowChart,
    displayStep,
    orderTemplate,
    checkReport,
    EmptyInTable
  }
};
