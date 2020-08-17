<template>
  <div>
    <el-table :data="historyData">
      <template slot="empty">
          <empty-in-table v-if="historyData.length<1"></empty-in-table>
      </template>
      <el-table-column prop="flow_sn" label="审批编号">
        <template slot-scope="scope">
          <el-button type="text" @click="approvalHistory(scope.row)">{{scope.row.flow_sn}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="审批主题"></el-table-column>
      <el-table-column label="报告">
        <template slot-scope="scope">
          <el-button type="text" @click="checkReport(scope.row)">查看报告</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="instance_status" label="状态">
        <template slot-scope="scope">
          <p>{{scope.row.instance_status.value}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="create_user_name" label="申请者"></el-table-column>
      <el-table-column prop="create_time" label="申请日期">
        <template slot-scope="scope">
          <p>{{scope.row.create_time[0]}}</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as requestDetail from "../../../../api/applicationCenter/myOrder";
export default {
  data() {
    return {
      //审批历史数据
      historyData: [],
      //审批
    };
  },
  created() {
    this.getOrderHistory();
  },
  methods: {
    //获取订单详情审批历史
    getOrderHistory() {
      requestDetail.getOrderDetailHistory("get", 1).then(res => {
        if (res.code === 200) {
          this.historyData = res.data;
        }
      });
    },
    approvalHistory(row) {
      this.$router.push({
        path: "/applicationCenter/myApproval/approvalDetail",
        query: {
          instance_id: row.instance_id,
          from:'myOrder'
        }
      });
    },
    //跳转到报告页面
    checkReport(row) {
      this.$router.push({
        path: "/applicationCenter/report"
      });
    }
  }
}
</script>
<style lang="less" scoped>
</style>
