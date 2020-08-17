<template>
  <div class="orderReviewOut">
    <!----------------------------- 复核数据输出 ------------------------->
    <p>
      <span>复核数据输出</span>
    </p>
    <el-table :data="orderReviewOutData.tableData" style="width: 100%">
      <template slot="empty">
            <empty-in-table v-if="orderReviewOutData.tableData.length<1"></empty-in-table>
      </template>
      <el-table-column label="检查项" prop="key_name"></el-table-column>
      <el-table-column label="设计值" prop="reference_value"></el-table-column>
      <el-table-column label="实际值" prop="fact_value"></el-table-column>
      <el-table-column label="核对结果" prop="audit_result_info">
        <template v-slot="scope">
          <i :class="scope.row.audit_result_info?'el-icon-success ':'el-icon-error '"></i>
          {{scope.row.audit_result}}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//引入API
import * as requestMethod from "../../../../api/applicationCenter/myTask";
// 空页面
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
export default {
  name: "orderReviewOut",
  props: {
    //相关所需参数
    orderReviewOutData: Object,
    //service_set_task_id:Number
  },
  components:{
    EmptyInTable
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.orderReviewOut {
  span {
    color: @g-font-color-h;
  }
}
</style>
