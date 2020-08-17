<template>
  <div class="user-groups">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="用户组">
      <template v-slot:right>
        <el-button
          v-if="$_hasAuth(authId.add.id)"
          icon="el-icon-circle-plus-outline"
          @click="addUserGroupBtn"
          type="primary"
          size="medium"
          :disabled="false"
          id="rbac_userGroup_add"
        >新建用户组
        </el-button>
      </template>
    </pageHeader>

    <el-alert
    style="margin-bottom:8px;"
      title="通过用户组对职责相同的用户进行分类并授权，可以更加高效地管理用户及其权限。对一个用户组进行授权后，用户组内的所有用户会自动继承该用户组的权限。如果一个用户被加入到多个用户组，那么该用户将会继承多个用户组的权限。"
      type="ts-description"
      show-icon
      >
    </el-alert>
    <div class="ts-middle-part">
      <enumSearch :theItems="'group'" :serviceType="'rbac'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
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
              <span
                v-if="item.key === 'group_alias'"
                @click="$_hasAuth(authId.detail.id) ? clickUserGroupsName(scope.row) : ''"
                :class="$_hasAuth(authId.detail.id) ? 'custom-overflow' : ''"
              >
                <svg-icon icon-class='usergroup_icon' class='iconCss'></svg-icon>
                {{ scope.row[item.key] }}
              </span>
              <span v-else-if="item.key === 'remarks'">{{ scope.row[item.key] ? scope.row[item.key] : '-'}}</span>
              <span v-else>{{ scope.row[item.key]}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button :disabled="!$_hasAuth(authId.edit.id)" @click="handleClickEdit(scope.$index, scope.row)" type="text" id="rbac_userGroup_edit">编辑
              </el-button>
              <el-button :disabled="!$_hasAuth(authId.del.id)" @click="handleClickDelete(scope.$index, scope.row)" type="text" id="rbac_userGroup_delete">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :paginationData="pagination"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"></Pagination>
      </div>
    <add-user-groups v-if='dialogFormVisible' :dialog-form-visible="dialogFormVisible" :dialog-title="dialogTitle" :edit-data="editData"
                     @close-dialog="closeDialog" @loadList="getDataList"></add-user-groups>
    <!--<custom-list v-if="customListVisible"-->
    <!--:custom-list-visible="customListVisible"-->
    <!--:table-header="tableHeader"-->
    <!--:filter-table-header="filterTableHeader"-->
    <!--@close-custom-list="closeCustomListDialog">-->
    <!--</custom-list>-->
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
