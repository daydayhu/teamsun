<template>
  <div class="baseDataPage">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="基础数据">
    </pageHeader>
    <div class="ts-content-wrap">
      <div class="search-c">
        <el-input
                placeholder="搜索"
                v-model="searchValue"
                @input="handleSearchChange"
                suffix-icon="el-icon-search">
        </el-input>
      </div>
      <el-tabs :tab-position="tabPosition" v-if="showDataTree.length" @tab-click="handleTabClick" v-model="activeName">
        <el-tab-pane v-for="(node,index) in showDataTree" :key="`${node.config_id}-${index}`" :label="node.value_json" :name="node.config_key">
          <div class="componentC">
            <!--<keep-alive>-->
            <!--<component v-bind:is="currentTabComponent"></component>-->
            <!--</keep-alive>-->
            <component :is="keyMapType[node.config_key]" :pane-data="node.children" v-if="node.config_key === activeName"></component>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style src="./index.less" lang="less" scoped></style>
