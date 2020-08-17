<template>
  <div class="myTask">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="规划任务"></pageHeader>

    <!-- <el-alert
			title=""
			type="ts-description"
			description="可支持用户管理。可以支持用户的创建、删除、修改、查询、禁用、重置密码等操作，并且可以限定每个用户可以操作的资源范围；用户忘记密码后，可以通过管理平台通过用户的邮箱或者手机来找回密码。">
    </el-alert>-->

    <div class="ts-middle-part">
      <enumSearch
        :theItems="'events'"
        :theUrl="'/v1/api/app/search_items'"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
        :defaultSearch="defaultSearch"
      ></enumSearch>
    </div>
      <div class="ts-body-part">
        <el-table :data="taskList" v-loading="taskLoading" empty-text=" ">
          <template slot="empty">
            <empty-in-table v-if="taskList.length<1&&!taskLoading"></empty-in-table>
          </template>
          <el-table-column label="应用系统" prop="app_name"></el-table-column>
          <el-table-column label="订单编号" prop="ticket_number" width="180">
            <template slot-scope="scope">
              <el-button
                @click="orderDetail(scope.row)"
                type="text"
                size="small"
                :disabled="false"
              >{{ scope.row.ticket_number }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="订单阶段" prop="step_type">
            <template slot-scope="scope">
                <span>{{ formatStepType(scope.row.step_type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="报告">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.handle_status.key!=='Completed'||scope.row.handle_status.key!==3" @click="onReport(scope.row)">订单报告</el-button>
            </template>
          </el-table-column>
          <el-table-column label="服务名称" prop="node_name"></el-table-column>
          <el-table-column label="操作名称" prop="node_set_name"></el-table-column>
          <!-- <el-table-column label="目标服务" prop="target_service"></el-table-column> -->
          <el-table-column label="目标资源" prop="target_source">
             <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row.target_source" placement="bottom-start">
                <span>{{ formateName(scope.row.target_source,20) }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="交付负责人">
            <template slot-scope="scope">
                <span>{{ get_name(scope.row.devilery_user) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="复核人" >
            <template slot-scope="scope">
                <span>{{ get_name(scope.row.review_user) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time"></el-table-column>
          <el-table-column label="状态" prop="handle_status" width="120px">
            <template slot-scope="scope">
              <i :class="formateIcon(scope.row.handle_status.key)"></i>
              <span>{{scope.row.handle_status.value}}</span>
              <el-button
                      type="text"
                      icon="el-icon-view"
                      style="margin-left: 8px"
                      @click="showProcessRecordDialog(scope.row)"
                      v-if="false"
              ></el-button>
            </template>
          </el-table-column>
            <!--TODO：进度 后续去掉-->
          <el-table-column label="进度" prop="progress_extent">
            <template slot-scope="scope">
              <el-button type="text" @click="onProgress(scope.row)">{{scope.row.progress_extent}}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button
                v-for="(item,index) in scope.row.actions"
                :key="index"
                @click="onActions(scope.row,item)"
                type="text"
                size="small"
                :disabled="false"
              >{{(item.key=="view_deployment_log"||item.key=="view_task_log"||item.key=="view_review_comments")?'':item.value}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :paginationData="pagination"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></pagination>

      </div>
    <!----------------------------- 转单Dialog ------------------------->
    <orderTransfer
      v-if="resendDialogVisible"
      :resendDialogVisible="resendDialogVisible"
      :transferData="transferData"
      @handleSuccess="transferSuccess"
      @closeDialog="transferCancel"
    ></orderTransfer>
    <!----------------------------- 复核Dialog ------------------------->
    <orderReview
      v-if="reviewDialogVisible"
      :reviewDialogVisible="reviewDialogVisible"
      :reviewData="reviewData"
      @handleSuccess="reviewSuccess"
      @closeDialog="reviewCancel"
    ></orderReview>
    <!----------------------------- 复核记录Dialog ------------------------->
    <orderReviewComments
      v-if="reviewCommentDialogVisible"
      :reviewCommentDialogVisible="reviewCommentDialogVisible"
      :reviewCommentsData="reviewCommentsData"
      @closeDialog="reviewCommentCancel"
    ></orderReviewComments>
    <!----------------------------- sshDialog ------------------------->
    <ssh
      v-if="sshDialogVisible"
      :sshDialogVisible="sshDialogVisible"
      :sshData="sshData"
      @handleSuccess="sshSuccess"
      @closeDialog="sshCancel"
    ></ssh>
    <!----------------------------- 订单报告 ------------------------->
    <checkReport
      :defaultConfig="defaultConfig"
      @handleClose="handleClose">
    </checkReport>
    <!----------------------------- 处理记录 ------------------------->
    <processRecord
      v-if="processRecordVisible"
      @closeProcessRecordDialog="closeProcessRecordDialog"
      :processRecordData="currentProcessRecordData"
    ></processRecord>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
