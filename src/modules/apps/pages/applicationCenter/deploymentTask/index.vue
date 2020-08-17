<template>
  <div class="deploymentTask">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="部署任务"></pageHeader>
    <div class="ts-middle-part">
      <enumSearch
        :theItems="'deploy_task'"
        :serviceType="'app'"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
        :theUrl="'/v1/api/app/search_items'"
        :defaultSearch="defaultSearch">
      </enumSearch>
    </div>
    <div class="ts-body-part">
      <el-table :data="taskList" v-loading="taskLoading" style="width: 100%" empty-text=" ">
        <template slot="empty">
          <empty-in-table v-if="taskList.length<1&&!taskLoading"></empty-in-table>
        </template>
        <el-table-column label="应用系统" prop="app_name"> </el-table-column>
        <el-table-column
          prop="ticket_number"
          label="订单编号"
          class="ts-column-blue"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
                @click="orderDetail(scope.row)"
                type="text"
                size="small"
                :disabled="false"
              >{{ scope.row.ticket_number }}</el-button>
            <!-- <el-tooltip trigger="hover" placement="bottom-start" :content="'查看部署视图'">
              <el-button type="text" @click="viewDeployProcess(scope.row)"><svg-icon icon-class="view_deploy_process" class="icon-style"></svg-icon>
              </el-button>
            </el-tooltip> -->
          </template>
        </el-table-column>
        <el-table-column label="服务名称" prop="node_name"></el-table-column>
        <el-table-column
          label="操作名称"
          prop="node_set_name"
        ></el-table-column>
        <el-table-column
          label="目标资源"
          prop="target_source"
        ></el-table-column>
        <el-table-column label="部署策略" prop="reviewer_name">
          <template slot="header" slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="交付策略/启动策略/复核策略"
              placement="bottom"
            >
              <span>部署策略<i class="el-icon-question"></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.deliver_type.value +"/"+scope.row.start_up_type.value +"/"+scope.row.review_type.value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间窗口" prop="crontab"> 
          <template slot-scope="scope">
              <div class="crontab-c" v-if="scope.row.crontab">
                <span>{{scope.row.crontab}}</span>
                <svg-icon icon-class="clock"></svg-icon>
                <div class="explain-c">
                    {{scope.row.crontab_message}}
                </div>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="负责人">
          <template slot-scope="scope">
            <span v-if="scope.row.status.key==='ToBeReviewed'">{{get_name(scope.row.review_user)}}</span>
            <span v-else>{{get_name(scope.row.deliver_user)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time">
          <template slot-scope="scope">
            <el-tooltip trigger="hover" placement="bottom-start" effect="dark" :content="scope.row.create_time">
                <span>{{ scope.row.create_time | dateFormate2 }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" prop="review_completed_time">
          <template slot-scope="scope">
            <el-tooltip trigger="hover" placement="bottom-start" effect="dark" :content="scope.row.review_completed_time">
                <span>{{ scope.row.review_completed_time | dateFormate2 }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">
            <el-tooltip trigger="hover" placement="bottom-start" effect="dark" :content="scope.row.deploy_start_time">
                <span>{{ scope.row.deploy_start_time | dateFormate }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">
            <el-tooltip trigger="hover" placement="bottom-start" effect="dark" :content="scope.row.deploy_finish_time">
                <span>{{ scope.row.deploy_finish_time | dateFormate }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="handle_status">
          <template slot-scope="scope">
            <span>
              <span
                class="circle-style status-success"
                v-if="
                  scope.row.status.key === 'SuccessfulDeployment' ||
                    scope.row.status.key === 'Completed'
                "
              ></span>
              <span
                class="circle-style to-be-deployed"
                v-else-if="scope.row.status.key === 'ToBeDeployed'"
              ></span>
              <span
                class="circle-style status-error"
                v-else-if="
                  scope.row.status.key === 'FailedDeployment' ||
                    scope.row.status.key === 'FailedReview'
                "
              ></span>
              <span
                class="circle-style to-be-reviewed"
                v-else-if="scope.row.status.key === 'ToBeReviewed' || scope.row.status.key === 'RolledBack'"
              >
              </span>
            </span>
            <span
              v-if="scope.row.status.key === 'Deploying' ||
                  scope.row.status.key === 'RollBacking'"
            >
              <el-progress
                :text-inside="true"
                :stroke-width="16"
                :percentage="scope.row.task_info.task_progress"
                :stroke-linecap="'square'"
              ></el-progress>
              <span><span class="circle-style to-be-reviewed"></span>{{ scope.row.status.value }}</span>
            </span>
            <span v-else>{{ scope.row.status.value }}</span>
            <el-tooltip
              v-if="
                (scope.row.status.key == 'FailedReview' &&
                  scope.row.is_review === 1) ||
                  (scope.row.status.key == 'Completed' &&
                    scope.row.is_review === 1)
              "
              class="item"
              effect="dark"
              content="查看复核日志"
              placement="bottom-start"
            >
              <el-button type="text" @click="reviewComments(scope.row)">
                <svg-icon
                  icon-class="review_result"
                  class="icon-style"
                ></svg-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="日志">
          <template slot-scope="scope">
            <div class="btn-c">
              <el-tooltip trigger="hover" placement="bottom-start" :content="'部署日志'"
                v-for="(value, key) in scope.row.actions"
                :key="key"
                v-if="value.key === 'view_deployment_log'">
                <el-button
                type="text"
                @click="onActions(scope.row, value.key)"
                >
                  <svg-icon icon-class="deploy_log" class="icon-style"></svg-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip trigger="hover" placement="bottom-start" :content="'任务日志'"
                v-for="(value, key) in scope.row.actions"
                :key="key"
                v-if="value.key === 'view_task_log'">
                <el-button
                  type="text"
                  @click="onActions(scope.row, value.key)"
                >
                  <svg-icon icon-class="task_log" class="icon-style"></svg-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="opertation" label="操作" class="btn-c">
          <template slot-scope="scope">
              <div v-for="(value, key) in filterActions(scope.row)" :key="key">
                <el-button
                  @click="onActions(scope.row, value.key)" 
                  type="text"
                  size="small">{{ value.value }}</el-button>
              </div>
              
            <!-- <el-button @click="onActions(scope.row, filterActions(scope.row)[0].key)" type="text" style="border:none;">
              {{ filterActions(scope.row).length > 0 ? filterActions(scope.row)[0].value : '' }}
            </el-button>
            <el-dropdown trigger="click" placement="bottom-start" v-if="filterActions(scope.row).length>1">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(value, key) in filterActions(scope.row)" :key="key" v-if="key" 
                  @click.native="onActions(scope.row, value.key)">
                  {{ value.value }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
          </template>
        </el-table-column>
 
      </el-table>
      <pagination
        :paginationData="pagination"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      ></pagination>
    </div>
    <deployProcess
      v-if="deployProcessVisible"
      :deployProcessVisible="deployProcessVisible"
      @childClose="childClose"
      :dataInfo="dataInfo"
    ></deployProcess>
    <deployLog
      v-if="deployLogVisible"
      :deploy-log-visible="deployLogVisible"
      @childClose="childClose"
      @updateTaskStaus="updateTaskStaus"
      @wsReceive="wsReceive"
      :logData="logData"
      :logFlag="logFlag"
      @updateLogFlag="updateLogFlag"
    >
    </deployLog>
    <orderReviewComments
      v-if="reviewCommentDialogVisible"
      :reviewCommentDialogVisible="reviewCommentDialogVisible"
      :reviewCommentsData="reviewCommentsData"
      @closeDialog="childClose"
    >
    </orderReviewComments>
    <orderReview
      v-if="reviewDialogVisible"
      :review-dialog-visible="reviewDialogVisible"
      :reviewData="reviewData"
      @handleSuccess="handleSuccess"
      @closeDialog="childClose"
    ></orderReview>
      <orderTransfer
      v-if="dialogFormVisible"
      :dialog-form-visible="dialogFormVisible"
      @childClose="childClose"
      @getServiceInstances="getTicketDeliverPlan"
      :dataInfo="dataInfo"></orderTransfer>
  </div>
</template>
<style src="./index.less" lang="less" scoped>

</style>
