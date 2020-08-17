<template>
  <div class="main">
    <pageHeader title="服务目录" >
      <template slot="right">
        <el-button type="primary" icon="el-icon-circle-plus-outline" size="medium" @click="addOrder">蓝图定义</el-button>
      </template>
    </pageHeader>

      <div class="ts-content-wrap">
        <el-container class="app-content">
          <el-aside class="aside-left">
            <div class="title">
              <span>服务列表</span>
            </div>
            <div class="service-tree-c" v-loading="serviceOptionsLoading">
              <el-tree
                :data="serviceOptions"
                :default-expand-all="true"
                :expand-on-click-node="false"
                ref="tree"
                node-key="config_id"
                @node-click="handleSelectNode">
                <div class="treeNode" slot-scope="{ node, data }">
                  <el-tooltip effect="dark"
                              :content="`${data.config_type ? data.config_type.value : ''}`"
                              placement="bottom"
                              v-if="data.config_type && data.config_type.value.length > 4">
                    <div class="label">{{data.config_type ? data.config_type.value : ''}}</div>
                  </el-tooltip>
                  <div class="label" v-else>{{data.config_type ? data.config_type.value : ''}}</div>
                </div>
              </el-tree>
            </div>

          </el-aside>
          <el-main v-loading="serviceListLoading" class="content">
            <div class="search-tools">
              <enumSearch
                :theItems="'service_info'"
                @toSearch="toSearch"
                @searchContdition="searchContdition"
                :theUrl="'/v1/api/app/search_items'"
              ></enumSearch>
            </div>
            <el-row :gutter="16" class="main-content">
              <el-col :span="8" v-for="(item, key) in serviceList" :key="key">
                <div class="service-wrap" @click="applyTo(item)">
                  <div class="item">
                    <el-avatar style="padding:10px;box-shadow: 0px 5px 8px 0px rgba(51,42,124,0.15);" :size="56" :src="item.service_img_url ? item.service_img_url : defaultIconUrl"></el-avatar>
                  </div>
                  <div class="item">
                    <span>{{item.alias_name}}</span>
                    <p>{{item.remarks || ''}}</p>
                  </div>
                </div>
              </el-col>
              <el-col v-if="serviceList.length === 0" style="text-align:center;margin-top:100px;">
                <img src="@/commons/images/g_empty.svg" />
                <div>暂无数据</div>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </div>
  </div>
</template>

<style src="./index.less" lang="less" scoped></style>
