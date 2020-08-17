<template>
  <div class="sys-config-overview">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="服务菜单定义">
    </pageHeader>
    <!-- <div class="sys-config-title">
      <b>服务菜单定义</b>
    </div> -->
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="left-tabel">
          <div class="ts-content-form" >
            <div class="header" >
              <span class="text">总览</span>
            </div>
            <div class="add-service" @click="addServiceType"  v-if="configItems.authId.addService.isUse">
              <span>
                <i class="el-icon-plus icon-size"></i>添加服务分类
              </span>
            </div>
            <div class="table-container">
              <el-table
                style="width: 100%"
                :data="tableData"
                row-key="menu_id"
                ref="table"
                v-loading="loading"
                :expand-row-keys='expandKeys'
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @expand-change="expandChangeHandler"
              >
                <el-table-column prop="menu_name" label="目录" min-width="80"></el-table-column>
                <el-table-column  label="分类" min-width="30">
                  <template slot-scope="scope">
                    <svg-icon  :icon-class="configItems.nodesType[scope.row.menu_type].icon" class="iconsize" :style="{fontSize:scope.row.menu_type==6?'19px':'16px'}"></svg-icon>
                      {{configItems.nodesType[scope.row.menu_type].text}}
                  </template>
                </el-table-column>
                <el-table-column prop="menu_url" label="URL" min-width="60"></el-table-column>
                <el-table-column prop="auth_id" label="授权Key" min-width="60"></el-table-column>
                <el-table-column label="启用" min-width="30">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.is_enable"
                      class="sys-el-switch"
                      active-color="#8db9f4"
                      inactive-color="#DCDFE6"
                      :disabled="!configItems.authId.isEnAble.isUse"
                      @change="switchChangeHandler(scope.row)"
                    ></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="操作" min-width="60">
                  <template slot-scope="scope">
                    <div class="icon-box">
                      <!--edit-->
                      <el-button type="text" @click="editNodeItem(scope.row)" :disabled="!configItems.authId.edit.isUse">
                        <svg-icon icon-class="edit" class="operat-icon"></svg-icon>
                      </el-button>

                      <!--add-->
                       <el-button type="text" @click="addNodeItem(scope.row)" :disabled="!configItems.authId.add.isUse" v-if="scope.row.menu_type!==1 && scope.row.menu_type!==3 && scope.row.menu_type!==2 || scope.row.menu_type===1 ">
                        <svg-icon icon-class="add" class="operat-icon"></svg-icon>
                      </el-button>

                      <!--delete-->
                      <el-button type="text" :disabled="!configItems.authId.delete.isUse"  @click="removeNodeItem(scope.row)">
                        <svg-icon icon-class="reduce" class="operat-reduce-icon"></svg-icon>
                      </el-button>

                      <!--上移-->
                      <el-button
                        type="text"
                        @click="upNodeItem(scope.row)"
                        :disabled="configItems.authId.up.isUse?scope.row.isFirst:true"
                      >
                        <svg-icon icon-class="to-up" class="operat-reduce-icon"></svg-icon>
                      </el-button>

                      <!--下移-->
                      <el-button
                        type="text"
                        @click="downNodeItem(scope.row)"
                        :disabled="configItems.authId.down.isUse?scope.row.isLast:true"
                      >
                        <svg-icon icon-class="to-down" class="operat-reduce-icon"></svg-icon>
                      </el-button>

                      <!--置顶-->
                      <el-button
                        type="text"
                        @click="topSetting(scope.row)"
                        :disabled="configItems.authId.settingTop.isUse?scope.row.isFirst:true"
                      >
                        <svg-icon icon-class="top-setting" class="operat-reduce-icon"></svg-icon>
                      </el-button>

                      <!--置底-->
                      <el-button
                        type="text"
                        @click="bottomSetting(scope.row)"
                        :disabled="configItems.authId.settingBottom.isUse?scope.row.isLast:true"
                      >
                        <svg-icon icon-class="bottom-setting" class="operat-icon"></svg-icon>
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="right-table">
          <div class="ts-content-form">
            <div class="header ">
              <span class="text">预览</span>
            </div>
            <div class="right-content">
              <menu-view  :menu-data ='tableData'></menu-view>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <dialog-view
      v-if="dialogFormVisible"
      :type="type"
      :dialog-form-visible="dialogFormVisible"
      @close-dialog="closeDialog"
    ></dialog-view>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
