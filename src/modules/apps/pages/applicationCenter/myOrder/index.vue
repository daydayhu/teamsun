<template>
  <div class="myOrder">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="我的订单"></pageHeader>
    <!-- <el-button
          @click="onTemplate"
          type="primary"
          size="small"
        >模板测试</el-button> -->
    <!-- <el-alert
			title=""
			type="ts-description"
			description="可支持用户管理。可以支持用户的创建、删除、修改、查询、禁用、重置密码等操作，并且可以限定每个用户可以操作的资源范围；用户忘记密码后，可以通过管理平台通过用户的邮箱或者手机来找回密码。">
    </el-alert>-->

    <div class="ts-middle-part">
      <enumSearch :theItems="'ticket'"  :theUrl="'/v1/api/app/search_items'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
    </div>
      <div class="ts-body-part">
        <el-table
          ref="orderTable"
          :data="orderTableData"
          style="width: 100%"
          v-loading="orderTableLoading"
        >
        <template slot="empty">
          <empty-in-table v-if="orderTableData.length<1&&!orderTableLoading"></empty-in-table>
        </template>
          <el-table-column prop="ticket_number" label="订单编号" width="180">
            <template slot-scope="scope">
              <el-button
                @click="orderDetail(scope.row)"
                type="text"
                size="small"
                :disabled="false"
              >{{ scope.row.ticket_number }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="ticket_name" label="订单标题"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
          <el-table-column prop="app_name" label="应用系统"></el-table-column>
          <el-table-column prop="step_status" label="状态">
            <template slot-scope="scope">
              <i :class="formateIcon(scope.row.step_status)"></i>
              {{formatStatus(scope.row.step_status)}}</template>
          </el-table-column>
          <el-table-column prop="ticket_step_type" label="当前阶段">
            <template slot-scope="scope">
              <el-popover  v-if="scope.row.step_type!==''" placement="bottom" width="600" trigger="hover">
                  <displayStep
                      :rowData="scope.row">
                  </displayStep>
                <el-button type="text" slot="reference">{{scope.row.step_type}}<i class="el-icon-time"></i></el-button>
              </el-popover>
              <el-popover
                  v-if="scope.row.step_type_number==2||scope.row.step_type_number==4"
                  width="540"
                  trigger="hover"
                  :close-delay="200"
                  placement="right-end">
                  <approvalFlowChart
                      :instance_id="scope.row.instance_id"
                  ></approvalFlowChart>
                  <el-button type="text" slot="reference"><i class="el-icon-set-up"></i></el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="创建人"></el-table-column>
          <el-table-column prop="create_time" label="创建时间"></el-table-column>
          <el-table-column label="操作" >
            <template slot-scope="scope">
              <el-button
               v-for="(item,index) in scope.row.button"
              :key="index"
                @click="handleOperate(scope.row,item.key)"
                type="text"
                size="small"
                :disabled="false"
              >{{item.value}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :paginationData="pagination"
          @handleCurrentChange="handleCurrentChange"
          @handleSizeChange="handleSizeChange"
        ></pagination>
      </div>
      <!----------------------------- 模板Dialog ------------------------->
      <orderTemplate
        v-if="templateDialogVisible"
        :templateDialogVisible="templateDialogVisible"
        :templateData="templateData"
        @handleSuccess="templateSuccess"
        @closeDialog="templateCancel"
      ></orderTemplate>

      <checkReport
          :defaultConfig="defaultConfig"
          @handleClose="handleClose">
      </checkReport>
    </div>

</template>
<style src="./index.less" lang="less" scoped></style>
