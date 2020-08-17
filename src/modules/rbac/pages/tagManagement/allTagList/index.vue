<template>
  <div class="tag-wrap">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="所有标签">
      <template v-slot:right>
        <el-button
          icon="el-icon-circle-plus-outline"
          type="primary"
          size="medium"
          @click="addTag"
          :disabled="!$_hasAuth('rbac_front_auth_action_tag_add')"
          id="ops_jobManagement_add"
        >创建标签</el-button>
      </template>
    </pageHeader>
    <div class="ts-middle-part">

      <enumSearch
        :theItems="'tag'"
        :serviceType="'rbac'"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
      ></enumSearch>
    </div>
    <div class="ts-body-part">
<!--      <el-button @click="deleteMutTag" id="rbac_tagManagement_mutDelete" style="margin:8px 0 8px 0"-->
<!--                 :disabled="!$_hasAuth('rbac_front_auth_action_tag_batch_delete')"-->
<!--      >批量删除</el-button>-->
      <el-table
        :data="tableList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="isDisabled">
        </el-table-column>
        <el-table-column
          v-for="(item,index) in tableHeader"
          :key="index"
          :prop="item.key"
          :label="item.label"
          show-tooltip-when-overflow
        >
          <template slot-scope="scope">
              <span v-if="item.key === 'tag_type'">
                {{ scope.row[item.key].value}}
              </span>
            <span v-else-if="item.key === 'value'">
                {{ scope.row[item.key].tag_value}}
              </span>
            <span v-else-if="item.key === 'update_time'">
                {{ scope.row[item.key] ? scope.row[item.key] : '-'}}
              </span>
            <span v-else-if="item.key === 'update_user'">
                {{ scope.row[item.key] ? scope.row[item.key] : '-' }}
              </span>
            <span v-else-if="item.key === 'use_count'">
                {{ scope.row['value'].counts}}
              </span>
            <span v-else>{{ scope.row[item.key]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.tag_type.key != 2">
              <el-button
                type="text"
                size="small"
                @click="editTag(scope.row)"
                :disabled="scope.row['value'].counts!=0||!$_hasAuth('rbac_front_auth_action_tag_edit')"
                id="rbac_tagManagement_edit"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="deleteTag(scope.row)"
                id="rbac_tagManagement_delete"
                :disabled="scope.row['value'].counts!=0||!$_hasAuth('rbac_front_auth_action_tag_delete')"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination :paginationData="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
      <add-tag v-if="tagObj.show" :isShow="tagObj.show" @closeDialog="closeDialog" :tagObj="tagObj" @loadList="getDataList" @get-data-list="getDataList"></add-tag>
    </div>
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
