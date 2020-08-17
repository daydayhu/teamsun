<template>
  <div class="user-details">
     <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader title="用户详情" back @handleBack="goBack" :rightWidth="5">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/certifiService/user' }">用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户详情</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>

    <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logoUrl"></el-avatar>
        </div>
      </el-col>
      <el-col :span="21" v-model="baseInfo">
        <div class="ts-base-title">
          <h3>{{baseInfo.user_name}}（{{baseInfo.alias_name}}）</h3>
          <el-button size="medium" type="text" class="ts-edit" @click="editUserBaseInfo"
                     :disabled="!this.$_hasAuth('rbac_front_auth_action_user_detail_edituser')"
                      id="rbac_userDetails_edit"
          >修改
          </el-button>
        </div>
        <el-col :span="24" class="details-base-cell">
          <el-col :span="8">
            <span class="ts-base-label">所属部门</span>
            <span class="ts-base-value">{{baseInfo.direct_dep_names}}</span>
          </el-col>
          <el-col :span="8">
            <span class="ts-base-label">手机</span>
            <span class="ts-base-value">{{baseInfo.phone == '' ? '-' : baseInfo.phone}}</span>
          </el-col>
          <el-col :span="8">
            <span class="ts-base-label">来源</span>
            <span class="ts-base-value">{{baseInfo.source_type == 1 ? '远程导入 ' : '本地创建'}}</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="details-base-cell">
          <el-col :span="8">
            <span class="ts-base-label">描述</span>
            <span class="ts-base-value">{{baseInfo.remarks ? baseInfo.remarks : '-'}}</span>
          </el-col>
          <el-col :span="8">
            <span class="ts-base-label">邮箱</span>
            <span class="ts-base-value">{{baseInfo.email}}</span>
          </el-col>
          <el-col :span="8">
          </el-col>
        </el-col>
      </el-col>
    </el-row>

    <div class="ts-content">
       <el-tabs v-model="activeName" @tab-click="handleClick" id="rbac_userDetails_tabChange">
        <el-tab-pane label="角色" name="first">
          <span slot="label">
              角色（{{ userRolesCounts }}）
          </span>
          <div class="table-container">
            <div class="button-operate">
              <el-button icon="el-icon-circle-plus-outline" type="primary" size="small" class="ts-add-user" @click="addUserRoles" :disabled="!$_hasAuth('rbac_front_auth_action_user_detail_addrole')" id="rbac_userDetails_addRoles">
                添加角色
              </el-button>
              <el-button size="small" @click="removeUserRoles(1)" :disabled="(!$_hasAuth('rbac_front_auth_action_user_detail_delrole'))" id="rbac_userDetails_removeRoles">移除角色</el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="userRolesData"
              tooltip-effect="dark"
              v-loading="loading"
              style="width: 100%"
              id="rbac_userDetails_rolesList"
              @selection-change="handleSelectionChange">
              <template slot="empty">
                <empty-in-table v-if="userRolesData.length<1&&!loading"></empty-in-table>
              </template>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="角色名称"
              >
                <template slot-scope="scope">{{ scope.row.role_name }}</template>
              </el-table-column>
              <el-table-column
                prop="role_type.name"
                label="角色类型"
              >
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="描述"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button @click="removeUserRoles(scope.row)" type="text" size="small" :disabled="!$_hasAuth('rbac_front_auth_action_user_detail_delrole')">
                    移除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户组" name="second">
          <span slot="label">
              用户组（{{ userGroupsCounts }}）
          </span>
          <div class="table-container">
            <div class="button-operate">
              <el-button  icon="el-icon-circle-plus-outline"
                          type="primary" size="small" class="ts-add-user" @click="addUserGroups"
                          :disabled="!$_hasAuth('rbac_front_auth_action_user_detail_addgroup')" id="rbac_userDetails_addGroups">加入到组
              </el-button>
              <el-button
                size="small"
                @click="removeUserGroups(1)"
                :disabled="(!$_hasAuth('rbac_front_auth_action_user_detail_delgroup'))"
                id="rbac_userDetails_removeGroups">移除组</el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="joinedGroupsList"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              id="rbac_userDetails_groupList"
            >
              <template slot="empty">
                <empty-in-table v-if="joinedGroupsList.length<1&&!loading"></empty-in-table>
              </template>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="组名称"
              >
                <template slot-scope="scope">{{ scope.row.group_name }}</template>
              </el-table-column>
              <el-table-column
                prop="remarks"
                label="描述"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button @click="removeUserGroups(scope.row)" type="text" size="small"
                             :disabled="!$_hasAuth('rbac_front_auth_action_user_detail_delgroup')">移出该组
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-user v-if="carrier.show" :isShow="carrier.show" @closeDialog="closeDialog" :carrier="carrier" @loadList="initBaseInfoFn"></add-user>
    <add-user-groups v-if="addUserGroupsObj.show" :isShow="addUserGroupsObj.show" @closeDialog="closeDialog" :addUserGroups="addUserGroupsObj"
                     @loadUserJoinGroups="loadUserJoinGroups" :userId="userId"></add-user-groups>
    <add-user-roles v-if="addUserRolesObj.show" :isShow="addUserRolesObj.show" @closeDialog="closeDialog" :addUserRolesObj="addUserRolesObj"
                    @loadUserRolesFn="loadUserRolesFn" :userId="userId"></add-user-roles>
  </div>
</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"
  import addUser from "./addUser.vue"
  import addUserGroups from "./addUserGroups.vue"
  import addUserRoles from "./addUserRoles.vue"
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
  export default {
    data() {
      return {
        activeName: 'first',
        baseInfo: [],
        carrier: {
          show: false
        },
        userId: JSON.parse(this.$route.query.res).user_id,
        addUserGroupsObj: {
          show: false
        },
        addUserRolesObj: {
          show: false
        },
        joinedGroupsList: [],
        userRolesData: [],
        isDisabled: true,
        multipleSelection: [],
        userRolesCounts: '',
        userGroupsCounts: '',
        // inputVisible: true,
        inputValue: '',
        logoUrl: require('@/commons/images/g_sys_user.svg'),
        loading: true
      }
    },
    created() {
      this.initBaseInfoFn()
      this.loadUserRolesFn()
      this.loadUserJoinGroups()
    },
    mounted() {
    },
    methods: {
      initBaseInfoFn() {
        requestMethod.userApi('get', '', this.userId).then(res => {
          this.baseInfo = Object.assign({}, res.data.user)
        })
      },
      loadUserRolesFn() {
        requestMethod.userDetialsRolesOperating('get', '', this.userId).then(res => {
          if (res.code == 200) {
            this.userRolesData = res.data.roles
            this.userRolesCounts = res.data.roles.length
          }else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
      },
      loadUserJoinGroups() {
        requestMethod.userJoinGroups('get', '', this.userId).then(res => {
          if (res.code == 200) {
            this.joinedGroupsList = res.data.group_lists
            this.userGroupsCounts = res.data.group_lists.length
          }else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
      },
      closeDialog() {
        this.carrier.show = false;
        this.addUserGroupsObj.show = false;
        this.addUserRolesObj.show = false;
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        // this.isDisabled = val.length == 0 ? true : false
      },
      handleClick(tab, event) {
        if (tab.name === 'second') {
          this.loadUserJoinGroups()
        } else {
          this.loadUserRolesFn()
        }
      },
      editUserBaseInfo() {
        console.log(this.baseInfo)
        this.carrier = {
          rowData: {...this.baseInfo},
          title: '编辑用户',
          show: true,
          type: 'detailsEdit'
        }
      },
      // 添加角色
      addUserRoles() {
        this.addUserRolesObj = {
          rowData: {...this.baseInfo},
          title: '添加角色',
          show: true,
          type: 'add'
        }
      },
      // 移除角色（单选和多选）
      removeUserRoles(row) {
        let text = ''
        let role_ids = []
        if (typeof row == "number") {
          // 检测是否勾选
          if (this.multipleSelection == 0) {
            this.$message({
              message: '请勾选需要移除的角色！',
              type: 'warning'
            })
            return
          }
          text = `确认将所选角色解除关联吗?`;
          this.multipleSelection.forEach(item => {
            role_ids.push(item.role_id)
          })
        } else {
          text = `确认将${row.role_name}解除关联吗?`;
          role_ids = [row.role_id]
        }
        this.$confirm(text, '提示', {
          type: 'warning'
        })
          .then(() => {
            let para = {
              "user_id": this.userId,
              "role_ids": role_ids
            }
            requestMethod.userDetialsRolesOperating('delete', para).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.loadUserRolesFn()
              } else {
                this.$message.error(res.message);
              }
            })
          })
          .catch(() => {
          })
      },
      // 添加到组
      addUserGroups() {
        this.addUserGroupsObj = {
          rowData: {...this.baseInfo},
          title: '加入到组',
          show: true,
          type: 'add'
        }
      },
      // 移出组(单个移除)
      removeUserGroups(row) {
        let text = ''
        let group_ids = []
        if (typeof row == "number") {
          // 检测是否勾选
          if (this.multipleSelection == 0) {
            this.$message({
              message: '请勾选需要移除的组！',
              type: 'warning'
            })
            return
          }
          text = `确认将所选组移除吗?`;
          this.multipleSelection.forEach(item => {
            group_ids.push(item.group_id)
          })
        } else {
          text = `确认将${row.group_name}移除吗?`;
          group_ids = [row.group_id]
        }

        this.$confirm(text, '提示', {
          type: 'warning'
        })
          .then(() => {
            let para = {
              "user_id": this.userId,
              "group_id": group_ids
            }
            requestMethod.userJoinGroups('delete', para).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.loadUserJoinGroups()
              } else {
                this.$message.error(res.message);
              }

            })
          })
          .catch(() => {
          })
      },
      goBack() {
        this.$router.push({name: 'user'})
      },
      // handleInputVisible(){
      //     this.inputVisible = true;
      //     this.inputValue = '';
      // },
      // modifySaveGroupName(){
      //     const {user_id} = this.baseInfo;
      //     let testData = {
      //         "user": {
      //             "alias_name": this.inputValue
      //         }
      //     }
      //     userApi('put', testData, this.baseInfo.user_id).then(res => {
      //         this.inputVisible = true;
      //         this.$message({
      //             message: '修改成功',
      //             type: 'success'
      //         })
      //         this.baseInfo.user_name = this.inputValue;
      //     })
      // },
    },
    components: {
      pageHeader,
      addUser,
      addUserGroups,
      addUserRoles
    },
  }
</script>

<style lang="less" scoped>
  .user-details {
    @detail-overview();
    @custom-table();
    .ts-base-title {
      display: flex;
      justify-content: space-between;
      /deep/.el-button {
        padding: 0;
      }
    }
  }
</style>
