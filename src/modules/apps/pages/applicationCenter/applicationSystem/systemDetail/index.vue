<template>
  <div class="systemDetail">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="应用系统详情" back @handleBack="goBack" :rightWidth="5">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="item in breadCrumbData" :key="item.name" :to="{path:item.path}">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>
    <!-------------------------------详情头部----------------------------->
    <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logo"></el-avatar>
        </div>
      </el-col>
      <el-col :span="21">
        <el-row type="flex" justify="space-between">
          <div class="ts-base-title">
          <h3>{{systemDetailData.app_name}}</h3>
          </div>
          <el-button type="text" icon="el-icon-edit" @click="onEditSystem">编辑</el-button>
        </el-row>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">业务组</span>
          <span class="ts-base-value">{{systemDetailData.bus_name}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">应用类型</span>
          <span class="ts-base-value">{{systemDetailData.app_base_type }}</span>
        </el-col>
         <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">所属环境</span>
          <span class="ts-base-value">{{systemDetailData.app_base_env}}</span>
        </el-col>
        <el-col :span="8" class="details-base-cell">
          <span class="ts-base-label">灾备等级</span>
          <span class="ts-base-value" v-for="(item,index) in systemDetailData.app_base_level " :key="index">{{item}}&nbsp;&nbsp;</span>
        </el-col>
        <el-col :span="24" class="details-base-cell">
          <span class="ts-base-label">标签</span>
          <span class="ts-base-value"
            style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"
          >
            <span v-for="item in tagList"
              :key="item.tag_value"
            >
              {{item.tag_key ? '键：'+item.tag_key : '-'}} {{item.tag_value ? '值：'+item.tag_value : '-'}}
            </span>
          </span>
          <span class="icon-cursor" @click="addTag">
            <svg-icon icon-class='task_step_add' class='iconCss'></svg-icon>
          </span>
          <span class="icon-cursor" @click="removeTags()" v-if="tagList.length>0">
            <svg-icon icon-class='task_step_remove' class='iconCss'></svg-icon>
          </span>
        </el-col>
      </el-col>
    </el-row>
    <div class="ts-content">
      <el-tabs v-model="activeName" @tab-click="selectedTab">
        <!--------------------------------订单-------------------------------->
        <el-tab-pane label="订单" name="list">
          <el-table v-if="activeName == 'list'" ref="orderTable" :data="orderTableData" style="width: 100%" v-loading="orderTableLoading">
            <template slot="empty">
                <empty-in-table v-if="orderTableData.length<1&&!orderTableLoading"></empty-in-table>
            </template>
            <el-table-column prop="ticket_number" label="订单编号" width="180px">
              <template slot-scope="scope">
                <el-button @click="orderDetail(scope.row)" type="text" size="small" :disabled="false">{{ scope.row.ticket_number }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="ticket_name" label="订单标题"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="ticket_step_status" label="状态">
              <template slot-scope="scope">
                <i :class="formateIcon(scope.row.step_status)"></i>
                {{formatStatus(scope.row.step_status)}}
              </template>
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
                                width="540"
                                trigger="hover"
                                :close-delay="200"
                                placement="right-end">
                                <approvalFlowChart
                                    :instance_id="scope.row.instance_id"
                                ></approvalFlowChart>
                                <el-button v-if="scope.row.step_type_number==2||scope.row.step_type_number==4" type="text" slot="reference"><i class="el-icon-set-up"></i></el-button>
                            </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="user_name" label="创建人"></el-table-column>
            <el-table-column prop="create_time" label="创建时间"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button v-for="(item,index) in scope.row.button" :key="index" @click="onHandle(scope.row,item.key)" type="text" size="small" :disabled="false">{{item.value}}
                </el-button>
<!--                <el-button   @click="onHandle({},'export_id')" type="text" size="small" :disabled="false">导出-->
<!--                </el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--------------------------------应用架构图----------------------------->
        <el-tab-pane label="应用架构图" name="frame">
          <application-architecture v-if="activeName =='frame'&&can_modify"></application-architecture>
          <deploy-arch v-if="activeName =='frame'&&!can_modify"></deploy-arch>
        </el-tab-pane>
        <!---------------------------------部署视图------------------------------>
        <el-tab-pane label="部署视图" name="view">
          <AppDeployView v-if="activeName === 'view'"></AppDeployView>
        </el-tab-pane>
        <!--------------------------------成员管理------------------------------->
        <el-tab-pane label="成员管理" name="member">
          <div class="memberList" v-if="activeName == 'member'">
            <systemMemberAddEdit  :app_id="appId" :org_id="orgId"></systemMemberAddEdit>
          </div>
        </el-tab-pane>
        <!--------------------------------虚拟机------------------------------->
        <el-tab-pane label="虚拟机" name="vm">
          <div class="button-operate">
              <el-button type="primary" @click="showSetAccount">批量账号设置</el-button>
              <el-button type="primary" @click="showDeployUnit">批量部署单元设置</el-button>
          </div>
          <div class="memberList">
              <vmTabPane ref="vmTab"></vmTabPane>
          </div>
        </el-tab-pane>
        <!--------------------------------裸机------------------------------->
        <el-tab-pane label="金属裸机" name="ops">
          <div class="button-operate">
              <el-button type="primary" @click="showSetAccount">批量账号设置</el-button>
              <el-button type="primary" @click="showDeployUnit">批量部署单元设置</el-button>
          </div>
          <div class="memberList">
              <opsTabPane ref="opsTab"></opsTabPane>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--------------------------------编辑应用系统------------------------------->
    <el-drawer  size="40%" title="编辑应用系统" :visible.sync="editSystemVisible" :before-close="beforeCloseEditSystem" direction="rtl" ref="editSystemDrawer">
      <div class="drawer-content">
        <systemAddEdit :app_id="appId" @submitSystemEdit="handelSubmitSystemEdit" @cancelSystemEdit="handelCancelSystemEdit"></systemAddEdit>
      </div>
    </el-drawer>
    <!--------------------------------订单的导出报告------------------------------->
    <exportReport v-if="drawerTag == 'export_id'"></exportReport>
    <!----------------------------- 模板Dialog ------------------------->
    <orderTemplate
      v-if="templateDialogVisible"
      :templateDialogVisible="templateDialogVisible"
      :templateData="templateData"
      @handleSuccess="templateSuccess"
      @closeDialog="templateCancel"
    ></orderTemplate>
    <!--    标签   -->
    <tag-in-details
      v-if="tagInDetails.show"
      :tagIndetails="tagInDetails"
      :isShow="tagInDetails.show"
      @closeDialog="closeDialog"
      :appId="tagInDetails.app_id"
      :tagList="JSON.stringify(tagList)"
      @loadList="getTagList"
    ></tag-in-details>
    <tag-in-delete
      v-if="tagInDelete.show"
      :tagIndetails="tagInDelete"
      :isShow="tagInDelete.show"
      @closeDialog="closeDialog"
      :appId="tagInDelete.app_id"
      :tagList="JSON.stringify(tagList)"
      @loadList="getTagList"
    >
    </tag-in-delete>

    <checkReport
          :defaultConfig="defaultConfig"
          @handleClose="handleClose">
      </checkReport>
      <setAccount
          :dataType="dataType"
          :config="userAccountSetConfig"
          :showDialog="showSetAccountDialog"
          @close="showSetAccountDialog = false">
      </setAccount>
      <deployUnitSet
          :showDialog="showDeployUnitDialog"
          :config="deployUnitSetConfig"
          @close="showDeployUnitDialog = false">
      </deployUnitSet>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
