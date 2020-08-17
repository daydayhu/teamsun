<template>
  <div class="role-manage">
     <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="角色管理">
      <template v-slot:right>
        <el-button
         v-if="$_hasAuth(authId.add.id)"
          icon="el-icon-circle-plus-outline"
          @click="addRole"
          type="primary"
          size="medium"
          :disabled="false"
         id="rbac_roleManage_addRole"
        >新建角色</el-button>
      </template>
    </pageHeader>
    <el-alert
    style="margin-bottom:8px;"
      title="角色机制是向您信任的实体（例如：用户）进行授权的一种安全方法"
      type="ts-description"
      show-icon
      >
    </el-alert>
    <div class="ts-middle-part">
      <enumSearch :theItems="'role'" :serviceType="'rbac'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
    </div>
      <div class="ts-body-part">
        <el-table
          :data="tableData"
          v-loading="loading"
          empty-text=" "
        >
          <template slot="empty">
            <empty-in-table v-if="tableData.length<1&&!loading"></empty-in-table>
          </template>
          <el-table-column
            v-for="(item,index) in tableHeaderList" :key="index"
            :prop="item.key"
            :label="item.label"
            show-tooltip-when-overflow
          >
            <template slot-scope="scope">
              <el-button
                v-if="item.key === 'role_name'"
                @click="clickRoleName(scope.row)"
                type="text"
                size="small"
                id="rbac_roleManage_details"
                :disabled="$_hasAuth(authId.detail.id) ? false : true "
                >
                  <svg-icon icon-class='role_icon' class='iconCss'></svg-icon>
                  {{ scope.row[item.key] }}
                </el-button>
              <span v-else-if="item.key === 'role_type'">{{ scope.row[item.key].name}}</span>
              <span v-else-if="item.key === 'remarks'">
                {{ scope.row[item.key]}}
                </span>
              <span v-else>{{ scope.row[item.key]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="$_hasAuth(authId.edit.id)"
                         @click="handleClickEdit(scope.$index, scope.row)" type="text"
                          id="rbac_roleManage_edit"
              >编辑
              </el-button>
              <el-button v-if="$_hasAuth(authId.delete.id) && scope.row.role_type.value !== 1" @click="handleClickDelete(scope.$index, scope.row)" type="text">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :paginationData="pagination"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"></Pagination>
      </div>
    <!--<custom-list v-if="customListVisible"-->
    <!--:custom-list-visible="customListVisible"-->
    <!--:table-header="tableHeader"-->
    <!--:filter-table-header="filterTableHeader"-->
    <!--@close-custom-list="closeCustomListDialog">-->
    <!--</custom-list>-->

  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
