<template>
  <div class="myMessage">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="我的消息"></pageHeader>
    <div class="ts-middle-part">
      <el-row>
        <el-col :span="8">
          <el-button @click="onDelete" size="small" icon="el-icon-delete">移除</el-button>
          <el-button @click="onRead" size="small" icon="el-icon-check">标记为已读</el-button>
          <el-button @click="onReadAll" size="small" icon="el-icon-check">全部标记为已读</el-button>
        </el-col>
        <el-col :span="4">
          <div class="select">
            <el-select v-model="is_read" placeholder="请选择" @change="selectChange">
              <el-option label="全部消息" :value="2"></el-option>
              <el-option label="未读消息" :value="0"></el-option>
              <el-option label="已读消息" :value="1"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <enumSearch
            :theItems="'message'"
            :theUrl="'/v1/api/app/search_items'"
            @toSearch="toSearch"
            @searchContdition="searchContdition"
          ></enumSearch>
        </el-col>
      </el-row>
    </div>
    <div class="ts-body-part">
      <el-table
        ref="messageTable"
        :data="appMessageList"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        v-loading="messageTableLoading"
      >
        <template slot="empty">
          <empty-in-table v-if="appMessageList.length<1&&!messageTableLoading"></empty-in-table>
        </template>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="is_read" width="100">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.is_read.key" icon-class="mail_off" class="myicon"></svg-icon>
            <svg-icon v-else icon-class="mail_on" class="myicon"></svg-icon>
            <span style="cursor:pointer;" @click="handelFlag(scope.row)">
              <svg-icon v-if="scope.row.is_flag.key" icon-class="flag_on" class="myicon"></svg-icon>
              <svg-icon v-else icon-class="flag_off" class="myicon"></svg-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="message_info" label="消息内容"></el-table-column>
        <el-table-column prop="create_time" label="提交时间"></el-table-column>
        <el-table-column prop="message_type" label="类型">
          <template slot-scope="scope">{{scope.row.message_type}}</template>
        </el-table-column>
      </el-table>
      <pagination
        :paginationData="pagination"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
    </div>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
