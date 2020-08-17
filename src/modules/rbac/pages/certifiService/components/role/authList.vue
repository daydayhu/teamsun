<template>
  <div>
    <el-table style="width: 100%;margin-bottom: 20px;">
      <el-table-column
        label="日期"
      >
      </el-table-column>
      <el-table-column
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        label="地址">
      </el-table-column>
    </el-table>
    <el-tree
      :data="sortData"
      node-key="dep_id"
      default-expand-all
      show-checkbox
      :expand-on-click-node="false"
      v-loading="loading"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%">
          <span style="display:inline-block;width:20%;color:#409EFF;cursor:pointer" @click="showCertOrganDetails(data.dep_id)" ref="">{{ data.dep_name }}</span>
          <span style="display:inline-block;width:30%">{{ data.alias_name }}</span>
          <span style="display:inline-block;width:30%">{{ data.remarks }}</span>
      </span>
    </el-tree>
  </div>
</template>
<script>
    import { certOrganApi } from "@/request/api/certifiService/organizationApi.js"
    export default {
        data() {
            return {
                loading: true,
                searchNeedData: {data: []},
                sortData: []

            }
        },
        mounted () {
            this.initMsg();
        },
        methods: {

            initMsg(para){
                para = typeof para !== 'undefined' ? para : para;
                this.loading = true;
                certOrganApi('get',para).then(res => {
                    this.sortData = res.data.departments;
                    this.searchNeedData.data = res.data.departments;
                    this.loading = false;
                })
            },
        },
    }
</script>

<style lang="less" scoped>
  .table-container{
    & /deep/ .el-table__empty-block {
      display: none;

    }
  }


</style>
