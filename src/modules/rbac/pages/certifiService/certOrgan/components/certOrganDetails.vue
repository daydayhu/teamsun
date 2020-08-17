<template>
  <div class="certOrgan-details">
    <!-- ------------------------引入头部公共组件 --------------------->
    <pageHeader :title="dep_info.is_root == 1 ? '组织详情' : '部门详情'" back @handleBack="goBack" :rightWidth="5">
      <template v-slot:right>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/certifiService/certOrgan' }">组织</el-breadcrumb-item>
          <el-breadcrumb-item>{{dep_info.is_root == 1 ? '组织详情' : '部门详情'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </template>
    </pageHeader>
    <el-row class="details-base-info">
      <el-col :span="3">
        <div class="ts-avatar">
          <el-avatar :size="64" :src="logoUrl"></el-avatar>
        </div>
      </el-col>

      <el-col :span="21">
        <div class="ts-base-title">
          <h3>{{baseInfo.dep_name}}</h3>
          <el-button
            size="medium"
            type="text"
            class="ts-edit"
            style="padding-right:24px"
            @click="editCertOragan"
            :disabled="!this.$_hasAuth('rbac_front_auth_action_dep_detail_editdep')">
            修改
          </el-button>
        </div>
        <el-col :span="24" class="details-base-cell">
          <el-col :span="12">
            <span class="ts-base-label">创建时间</span>
            <span class="ts-base-value">{{baseInfo.create_time}}</span>
          </el-col>
          <el-col :span="12" v-if="dep_info.is_root != 1">
            <span class="ts-base-label">所属组织</span>
            <span class="ts-base-value">{{baseInfo.org_name}}</span>
          </el-col>
        </el-col>
        <el-col :span="24" class="details-base-cell">
          <span class="ts-base-label">描述</span>
          <span class="ts-base-value">{{baseInfo.remarks ? baseInfo.remarks : '-'}}</span>
        </el-col>
      </el-col>
    </el-row>
    <div class="ts-content">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户" name="first">
          <div class="table-container">
            <div class="button-operate">
              <el-button
                icon="el-icon-circle-plus-outline"
                type="primary"
                size="small"
                @click="addCertOrganUserFn"
                :disabled="!this.$_hasAuth('rbac_front_auth_action_dep_detail_adduser')"
                id="rbac_certOrganDetails_addUser"
              >添加用户
              </el-button>
              <el-button
                size="small"
                @click="removeUsers(1)"
                :disabled="!this.$_hasAuth('rbac_front_auth_action_dep_detail_deluser')"
              >移除用户
              </el-button>
            </div>
            <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              id="rbac_certOrganDetails_tableCheck"
              v-loading="loading"
              empty-text=" "
            >
              <template slot="empty">
                <empty-in-table v-if="tableData.length<1&&!loading"></empty-in-table>
              </template>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="用户名"
              >
                <template slot-scope="scope">{{ scope.row.user_name }}</template>
              </el-table-column>
              <el-table-column
                label="描述"
              >
                <template slot-scope="scope">{{ scope.row.remarks ? scope.row.remarks : '-' }}</template>
              </el-table-column>
              <el-table-column
                label="手机"
              >
                <template slot-scope="scope">{{ scope.row.phone ? scope.row.phone : '-' }}</template>
              </el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
              >
              </el-table-column>
              <el-table-column
                prop="is_active"
                label="状态"
                width="120">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.is_active"
                    active-color="#8db9f4"
                    inactive-color="#DCDFE6"
                    :active-value="1"
                    :inactive-value="0"
                    :width="60"
                    :active-text="scope.row.is_active==1?'激活':'关闭'"
                    disabled
                  >
                  </el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="removeUsers(scope.row)"
                    type="text" size="small"
                    id="rbac_certOrganDetails_removeUsers"
                    :disabled="!$_hasAuth('rbac_front_auth_action_dep_detail_deluser')"
                  >移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <add-cert-organ v-if="organDialogObj.show" :isShow="organDialogObj.show" :organDialogObj="organDialogObj" @loadList="initBaseInfoFn"
                    @closeDialog="closeDialog">
    </add-cert-organ>
    <add-cert-organ-user v-if="addCertOrganUserObj.show" :isShow="addCertOrganUserObj.show" :addCertOrganUserObj="addCertOrganUserObj"
                         @initUserListFn="initUserListFn" @closeDialog="closeDialog" :dep_info="dep_info">
    </add-cert-organ-user>
  </div>
</template>

<script>
  import addCertOrgan from "./addCertOrgan.vue"
  import addCertOrganUser from "./addCertOrganUser.vue"
  import * as requestMethod from "@/modules/rbac/api/certifiService/organizationApi.js"
  //引入公共头部组件
  import pageHeader from "@/components/pageHeader.vue"

  export default {
    data() {
      return {
        baseInfo: '',
        activeName: 'first',
        organDialogObj: {
          show: false
        },
        addCertOrganUserObj: {
          show: false
        },
        dep_info: JSON.parse(this.$route.query.ts),
        loading: true,
        tableData: [],
        multipleSelection: [],
        inputValue: '',
        logoUrl: require('@/commons/images/g_sys_group.svg')
      }
    },
    created() {
      this.initBaseInfoFn()
    },
    mounted() {
      this.initUserListFn()
    },
    methods: {
      initBaseInfoFn() {
        requestMethod.certOrganApi('get', this.dep_info.dep_id, 'getDetails').then(res => {
          if (res.code == 200) {
            this.baseInfo = Object.assign({}, res.data.detail)
            this.loading = false
          }else {
            this.$message.error(res.message)
          }
        })
      },
      initUserListFn() {
        let obj = {
          id: this.dep_info.dep_id,
          type: this.dep_info.is_root == 1 ? 'org_users' : 'dep_users'
        }
        if (this.dep_info.is_root == 1) {
          // 组织 **org_id = dep_id**
          requestMethod.getOrgUsers('get', this.dep_info.dep_id).then(res => {
            if (res.code == 200) {
              this.tableData = res.data.items
            } else {
              this.$message.error('获取当前组织直属用户列表失败')
            }
          })
        } else {
          // 部门
          requestMethod.getDepUsers('get', this.dep_info.dep_id).then(res => {
            if (res.code == 200) {
              this.tableData = res.data.items
            } else {
              this.$message.error('获取当前部门直属用户列表失败')
            }
          })
        }
      },
      editCertOragan() {
        let {is_root} = {...this.baseInfo}
        this.organDialogObj = {
          rowData: {...this.baseInfo},
          title: is_root == 1 ? '编辑组织' : '编辑部门',
          name: is_root == 1 ? '组织名称' : '部门名称',
          show: true,
          type: 'editDetail',
          is_root: is_root,
          // 编辑时判断如果是组织则显示管理员，部门则不显示
          is_top_root: this.baseInfo.is_root == 0 ? 0 : 1,
          dep_parent_id: this.baseInfo.dep_id
        }
      },
      addCertOrganUserFn() {
        this.addCertOrganUserObj = {
          rowData: {...this.baseInfo},
          title: '添加用户',
          show: true,
          type: 'addu'
        }
      },
      closeDialog() {
        this.organDialogObj.show = false
        this.addCertOrganUserObj.show = false
      },
      // 移除数据
      removeUsers(row) {
        let text = ''
        let user_ids = []
        if (typeof row == "number") {
          // 检测是否勾选
          if (this.multipleSelection == 0) {
            this.$message({
              message: '请勾选需要移除的用户！',
              type: 'warning'
            })
            return
          }
          text = `确认将所选用户移除吗?`;
          this.multipleSelection.forEach(item => {
            user_ids.push(item.user_id)
          })
        } else {
          text = `确认将${row.user_name}移除吗?`;
          user_ids = [row.user_id]
        }

        this.$confirm(text, '提示', {
          type: 'warning'
        })
          .then(() => {
            let para = {
              "dep_id": this.dep_info.dep_id,
              "user_ids": user_ids
            }
            requestMethod.departmentUsersOperating('delete', para).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.initUserListFn()
              } else {
                this.$message.error(res.message);
              }

            })
          })
          .catch(() => {
          })
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
        // 只有一个标签
      },
      goBack() {
        this.$router.push({name: 'certOrgan'})
      }
    },
    components: {
      pageHeader,
      addCertOrgan,
      addCertOrganUser
    },
  }
</script>

<style lang="less" scoped>
  .certOrgan-details {
    @detail-overview();
    @custom-table();
    .ts-base-title {
      display: flex;
      justify-content: space-between;
      /deep/.el-button {
        padding: 0;
      }
    }
    .table-container {
      /deep/ .el-switch {
        position: relative;
        height: 24px;
        line-height: 24px;

        &.is-checked {
          .el-switch__core {
            background: #179bff;

            &:after {
              margin-left: -22px;
            }
          }
        }

        .el-switch__label,
        .el-switch__core {
          height: 24px;
        }

        .el-switch__core {
          border-radius: 12px;
          border: none;
          background: #f1f1f1;

          &:after {
            box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
            width: 22px;
            height: 22px;
          }
        }

        .el-switch__label.is-active {
          color: #333;
        }

        .el-switch__label--right {
          margin-left: 0;

          &.is-active {
            color: #fff;
            right: 24px;
          }

          position: absolute;
          right: 5px;
          top: -1px;
          color: #999;

          > span {
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
