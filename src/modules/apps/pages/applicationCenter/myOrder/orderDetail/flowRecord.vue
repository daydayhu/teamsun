<template>
  <div>
    <el-table
      ref="flowTable"
      :data="flowTableData"
      style="width: 100%"
      v-loading="flowTableLoading"
    >
      <template slot="empty">
        <empty-in-table v-if="flowTableData.length<1&&!flowTableLoading"></empty-in-table>
      </template>
      <el-table-column prop="step_type" label="阶段">
        <template slot-scope="scope">{{scope.row.step_type.value}}</template>
      </el-table-column>
      <el-table-column prop="create_time" label="完成时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-for="(value,key) in scope.row.action" :key="key">
            <el-popover
              v-if="key=='approval_hostory'"
              placement="right"
              width="500"
              :close-delay="200"
              trigger="click"
            >
              <approvalFlowChart :instance_id="scope.row.instance_id"></approvalFlowChart>
              <el-button slot="reference" type="text" size="small" :disabled="false">{{value}}</el-button>
            </el-popover>
            <el-button
              v-else
              @click="handleOperate(scope.row,key)"
              type="text"
              size="small"
              :disabled="false"
            >{{value}}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :paginationData="pagination"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    ></pagination>
    <!--------------------------------- 查看报告 ----------------------------------->
    <checkReport :defaultConfig="defaultConfig" @handleClose="handleClose"></checkReport>
    <!--------------------------------- 审批历史 ----------------------------------->
    <!-- <approvalFlowChart :instance_id="instance_id"></approvalFlowChart> -->
  </div>
</template>
<script>
import * as requestMethod from "../../../../api/applicationCenter/myOrder";
import checkReport from "../../components/checkReport/checkReport.vue";
import approvalFlowChart from "../../myApproval/approvalDetail/approvalFlowChart.vue";
import Pagination from "@/components/pagination";
import { getSession } from "@/commons/js/searchFresh.js";
export default {
  components: {
    checkReport,
    approvalFlowChart,
    Pagination,
  },
  data() {
    return {
      activeName: "flow",
      flowTableData: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1,
      },
      flowTableLoading: true,
      defaultConfig: {
        exportDrawer: false,
        exportDrawerIframe: false,
        ticket_id: null,
        app_id: null,
      },
      instance_id: null,
    };
  },
  created() {
    this.getDataList(
      getSession("searchFresh").pageNo,
      getSession("searchFresh").pageSize
    );
  },
  methods: {
    //获取流程记录数据
    getDataList(pageNo, pageSize) {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        per_page: pageSize,
        current_page: pageNo,
      };
      this.flowTableLoading = true;
      requestMethod.getOrderFlowRecord("get", param).then((res) => {
        if (res.code === 200) {
          this.flowTableData = res.data.items;
          this.pagination = res.data.pagination_data;
        } else {
          this.$message.error(res.message);
        }
        this.flowTableLoading = false;
      });
    },
    // 上下分页
    handleCurrentChange(val) {
      this.getDataList(val, getSession("searchFresh").pageSize);
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDataList(getSession("searchFresh").pageNo, val);
    },
    //处理操作事件
    handleOperate(row, key) {
      switch (key) {
        case "report":
          this.onExport(row);
          return;
        case "approval_hostory":
          this.onApproval(row);
          return;
        default:
          break;
      }
    },
    //导出报告按钮
    onExport(row) {
      this.defaultConfig.ticket_id = row.ticket_id;
      this.defaultConfig.app_id = row.app_id;
      this.defaultConfig.exportDrawer = true;
      let that = this;
      setTimeout(() => {
        that.defaultConfig.exportDrawerIframe = true;
      }, 260);
    },
    //关闭导出报告抽屉
    handleClose() {
      this.defaultConfig.exportDrawer = false;
      this.defaultConfig.exportDrawerIframe = false;
    },
    //审批历史
    onApproval(row) {},
  },
};
</script>
<style lang="less" scoped>
</style>
