<template>
  <div class="user-manage">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="用户">
      <template v-slot:right>
        <el-button
          @click="addUserFn"
          type="primary"
          icon="el-icon-circle-plus-outline"
          size="medium"
          :disabled="!$_hasAuth('rbac_front_auth_action_user_add')"
          id="rbac_user_addUserBtn"
        >新建用户</el-button>
      </template>
    </pageHeader>

    <el-alert
    style="margin-bottom:8px;"
      title="可支持用户管理。可以支持用户的创建、删除、修改、查询、禁用、重置密码等操作，并且可以限定每个用户可以操作的资源范围；用户忘记密码后，可以通过管理平台通过用户的邮箱或者手机来找回密码。"
      type="ts-description"
      show-icon
      >
    </el-alert>

    <div class="ts-middle-part">
      <enumSearch :theItems="'user'" :serviceType="'rbac'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
    </div>
      <div class="ts-body-part">
        <el-table
          :data="userList"
          v-loading="loading"
          empty-text=" "
          style="width: 100%">
          <template slot="empty">
            <empty-in-table v-if="userList.length<1&&!loading"></empty-in-table>
          </template>
          <el-table-column
            prop="user_name"
            label="用户名"
            class="ts-column-blue"
            width="200px"
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="scope.row[`user_name`]" placement="bottom-start">
                  <span @click="$_hasAuth('rbac_front_auth_action_user_detail') ? showUserDetails(scope.row) : ''"
                 class="custom-overflow"
                 id="rbac_user_user_detail"
                 :class="$_hasAuth('rbac_front_auth_action_user_detail') ? 'custom-overflow' : ''"
              >
              <!-- <svg-icon icon-class='user_icon' class='iconCss'></svg-icon> -->
              {{scope.row[`user_name`] }}
              </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              prop="alias_name"
              label="姓名"
              >
          </el-table-column>
          <el-table-column property="remarks" label="描述" align="center" show-tooltip-when-overflow>
            <template slot-scope="scope">
              {{ scope.row[`remarks`] ? scope.row[`remarks`] : '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="belong_org_names"
            label="所属组织"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.dep_name != null">
                <!-- <svg-icon icon-class='ts-certorgan' class='iconCss userIconCss'></svg-icon> -->
                <span>{{scope.row.dep_name}}</span>
              </div>
              <div v-else>
                <div>-</div>
              </div>

            </template>
          </el-table-column>
          <el-table-column
            prop="direct_dep_names"
            label="直属组织/部门">
            <template slot-scope="scope">
              <div v-if="scope.row.direct_dep_names != null">
                <div v-for="item in scope.row.direct_dep_names.split(',')" :key="item">
                  <!-- <svg-icon icon-class='ts-certorgan' class='iconCss userIconCss'></svg-icon> -->
                  <span>{{item}}</span>
                </div>
              </div>
              <div v-else>
                <div>-</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机"
          >
            <template slot-scope="scope">
              <span>{{scope.row.phone ? scope.row.phone : '-'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="encryption_type"
            label="认证方式"
          >
            <template slot-scope="scope">
              <!-- <svg-icon v-if=" scope.row.source_type == 0 " icon-class='ts-remote-auth'></svg-icon>
              <svg-icon v-else icon-class='ts-local-auth'></svg-icon> -->
              <span style="margin-left: 4px">{{ scope.row.source_type == 0 ? '本地认证 ' : '远程认证' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_active"
            label="状态"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.is_active"
                class="ts-el-switch"
                active-color="#8db9f4"
                inactive-color="#DCDFE6"
                :active-value="1"
                :inactive-value="0"
                @change="activeStatus(scope.row)"
                :disabled="!$_hasAuth('rbac_front_auth_action_user_change_as')"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                @click="editUserFn(scope.row)"
                type="text"
                size="small"
                :disabled="!$_hasAuth('rbac_front_auth_action_user_edit')"
                id="rbac_user_editBtn"
              >编辑</el-button>
              <el-dropdown
                trigger="click"
                placement="bottom-start"
                @command="handleCommand"
              >
                <el-button type="text" size="small" id="rbac_user_moreBtn">更多</el-button>
                <el-dropdown-menu slot="dropdown" class="ts-dropdown">
                  <el-dropdown-item :command="beforeHandleCommand(scope.row,'updataPassword')"
                                    :disabled="!$_hasAuth('rbac_front_auth_action_user_editpwd')"
                                    id="rbac_user_updataPassword"
                                    v-if="scope.row.source_type == 0"
                  >
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand(scope.row,'resetPassword')"
                                    :disabled="!$_hasAuth('rbac_front_auth_action_user_resetpwd')"
                                    id="rbac_user_resetPassword"
                                    v-if="scope.row.source_type == 0"
                  >
                    重置密码
                  </el-dropdown-item>
                  <el-dropdown-item :command="beforeHandleCommand(scope.row,'delete')" :disabled="!$_hasAuth('rbac_front_auth_action_user_del')" id="rbac_user_delete">删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination :paginationData="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
      </div>
    <add-user v-if="carrier.show" :isShow="carrier.show" @closeDialog="closeDialog" :carrier="carrier" @loadListEdit="getDataListEdit"
              @loadListAdd="getDataListAdd"></add-user>
    <user-password v-if="password.show" :isShow="password.show" @closeDialog="closeDialog" :password="password"></user-password>
    <!-- <import-user :importUser="importUser" @closeDialog="closeDialog"></import-user> -->
  </div>
</template>
<style src="./index.less" lang="less" scoped></style>
