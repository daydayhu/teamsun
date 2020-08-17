<template>
  <div class="netContent">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="操作日志">
    </pageHeader>
    <div class="ts-middle-part">
      <enumSearch
        :theItems="'log'"
        :serviceType="'rbac'"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
      ></enumSearch>
    </div>
      <div class="ts-body-part">
        <el-table :data="portGroupsInfo" v-loading="loading" style="width: 100%">
          <el-table-column prop="log_type" label="类型" class="ts-column-blue">
          </el-table-column>
          <el-table-column prop="dep_name" label="组织">
            <template slot-scope="scope">
              {{scope.row.dep_name ? scope.row.dep_name : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="create_user" label="操作者">
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间">
          </el-table-column>
          <el-table-column prop="log_info" label="信息">
          </el-table-column>
          <el-table-column prop="client_addr" label="客户端IP">
            <template slot-scope="scope">
              {{scope.row.client_addr ? scope.row.client_addr : '-'}}
            </template>
          </el-table-column>
          <el-table-column prop="user_agent" label="浏览器">
          </el-table-column>
        </el-table>
        <pagination
          :paginationData="pagination"
           @handleCurrentChange="handleCurrentChange"
           @handleSizeChange="handleSizeChange"></pagination>
      </div>
    </div>
</template>
<style src="./index.less" lang="less" scoped></style>
