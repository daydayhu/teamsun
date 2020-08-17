<template>
  <div class="app_dashboard">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="概览" guide @handleGuide="handleGuide"> </pageHeader>

    <!------------------------------ 指引区域 --------------------------->
    <guide :visible="guideVisible">
      <guideItem title="1 创建/选择应用系统" iconName="g_app_system">
        <template v-slot:content>
          <p>创建一个新的应用系统，或选定要管理的已有应用系统</p>
          <el-button type="text" @click="toSystem">应用系统</el-button>
        </template>
      </guideItem>
      <guideItem title="2 蓝图定义/服务申请" iconName="g_app_service">
        <template v-slot:content>
          <p>为应用系统定义新建或变更服务蓝图，或进行快速单服务申请</p>
          <el-button type="text" @click="toService">服务目录</el-button>
        </template>
      </guideItem>
      <guideItem title="3 启动订单交付流程" iconName="g_app_order">
        <template v-slot:content>
          <p>提交服务申请，启动订单交付流程，了解订单交付进度</p>
          <el-button type="text" @click="toOrder">我的订单</el-button>
        </template>
      </guideItem>
    </guide>
    <el-row type="flex" class="one-wrap">
      <el-col :span="8" class="one-wrap-item">
        <div class="item">
          <div class="title">
            <h3>待处理事项</h3>
          </div>
          <el-row class="todo" type="flex" justify="center">
            <el-col class="todo-item" :span="8">
              <div class="todo-item-avatar">
                <svg-icon icon-class="g_app_dashboard_my_task" class="icon-c"></svg-icon>
              </div>
              <p class="num">
                <el-button
                    type="text"
                    @click="toMytask">
                    {{waitHandleData.my_task_count}}
                </el-button>
              </p>
              <p class="todo-title">我的任务</p>
            </el-col>
            <el-col class="todo-item" :span="8">
              <div class="todo-item-avatar">
                <svg-icon icon-class="g_app_dashboard_deploy" class="icon-c"></svg-icon>
              </div>
              <p class="num">
                <el-button
                    type="text"
                    @click="toDeploytask">
                    {{waitHandleData.my_deploy_count}}
                </el-button>
              </p>
              <p class="todo-title">部署任务</p>
            </el-col>
            <el-col class="todo-item" :span="8">
              <div class="todo-item-avatar">
                <svg-icon icon-class="g_app_dashboard_approval" class="icon-c"></svg-icon>
              </div>
              <p class="num">
                <el-button
                    type="text"
                    @click="toMyApproval">
                    {{waitHandleData.my_approval_count}}
                </el-button>
              </p>
              <p class="todo-title">我的审批</p>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8" class="one-wrap-item">
        <div class="item">
          <div class="title">
            <h3>虚拟机</h3>
          </div>
          <div class="virtual">
            <el-row type="flex" justify="center" class="virtual-top">
              <el-col :span="12" class="virtual-top-left">
                <span class="num">{{vmwareCount.vm_count}}</span><span class="unit">台</span>
              </el-col>
              <el-col :span="12" class="virtual-top-right">
                <div class="virtual-right-icon-wrap">
                  <div class="virtual-right-icon-d">
                    <svg-icon icon-class="g_app_dashboard_processing" class="virtual-right-icon"></svg-icon>
                  </div>
                  <span class="virtual-right-icon-title">运行中:{{vmwareCount.poweredOn_vms.count}}</span>
                </div>
                <div class="virtual-right-icon-wrap">
                  <div class="virtual-right-icon-d">
                    <svg-icon icon-class="g_app_dashboard_hang_up" class="virtual-right-icon"></svg-icon>
                  </div>
                  <span class="virtual-right-icon-title">已挂起:{{vmwareCount.suspended_vms.count}}</span>
                </div>
                <div class="virtual-right-icon-wrap">
                  <div class="virtual-right-icon-d">
                    <svg-icon icon-class="g_app_dashboard_shut_down" class="virtual-right-icon"></svg-icon>
                  </div>
                  <span class="virtual-right-icon-title">已关机:{{vmwareCount.poweredOff_vms.count}}</span>
                </div>
              </el-col>
            </el-row>
            <div class="virtual-border"></div>
            <el-row type="flex" justify="center" class="virtual-bottom">
              <el-col :span="8" class="virtual-bottom-circle">
                <div class="virtual-bottom-bg violet">
                  <span>{{vmwareCount.cpu_total}}</span>
                </div>
                <p>CPU/个</p>
              </el-col>
              <el-col :span="8" class="virtual-bottom-circle">
                <div class="virtual-bottom-bg green">
                  <span>{{vmwareCount.memory.memory_total}}</span>
                </div>
                <p>内存/{{vmwareCount.memory.memory_unit || "GB"}}</p>
              </el-col>
              <el-col :span="8" class="virtual-bottom-circle">
                <div class="virtual-bottom-bg orange">
                  <span>{{vmwareCount.disk.disk_total}}</span>
                </div>
                <p>磁盘/{{vmwareCount.disk.disk_unit || "GB"}}</p>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="8" class="one-wrap-item">
        <div class="item">
          <div class="title">
            <h3>金属裸机</h3>
          </div>
          <div class="metal">
            <el-row type="flex" justify="center">
              <el-col :span="12" class="metal-left">
                <div class="metal-left-icon">
                  <svg-icon icon-class="g_app_dashboard_metal" ></svg-icon>
                </div>
                <div class="metal-left-bottom">
                  <span class="num">{{IronicCount.total}}</span><span class="unit">台</span>
                </div>
              </el-col>
              <el-col :span="12" class="metal-right">
                <div class="metal-right-icon-wrap">
                  <div class="metal-right-icon-d">
                    <svg-icon icon-class="g_app_dashboard_processing" class="metal-right-icon"></svg-icon>
                  </div>
                  <span class="metal-right-icon-title">加电:<span>{{IronicCount.running}}</span></span>
                </div>
                <div class="metal-right-icon-wrap">
                  <div class="metal-right-icon-d">
                    <svg-icon icon-class="g_app_dashboard_duandian" class="metal-right-icon"></svg-icon>
                  </div>
                  <span class="metal-right-icon-title">断电:<span>{{IronicCount.total - IronicCount.running}}</span></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

    </el-row>

    <!------------------------------ 环状图 --------------------------->
<!--    <annular></annular>-->
    <!------------------------------ 饼状图 --------------------------->
    <el-row type="flex" class="pie">
      <el-col :span="12">
        <div class="item">
          <div class="title">
            <h3>应用统计</h3>
          </div>
          <pie :application-type-data="applicationTypeData"></pie>
        </div>
      </el-col>
          <el-col :span="12">
            <div class="item">
              <div class="title">
                <h3>订单统计</h3>
              </div>
              <pie :application-type-data="ticketData"></pie>

            </div>

          </el-col>
    </el-row>
    <!------------------------------ 柱状图 --------------------------->
    <columnar></columnar>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
