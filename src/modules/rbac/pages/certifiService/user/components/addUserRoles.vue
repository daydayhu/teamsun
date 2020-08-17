<template>
  <el-drawer
    :title="addUserRolesObj.title"
    :before-close="closeDialog"
    :visible.sync="isVisible"
    size="50%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div class="table-container">
      <el-table
        ref="multipleTable"
        :data="rolesList"
        tooltip-effect="dark"
        style="width: 100%;"
        :max-height="maxHeight"
        @selection-change="handleSelectionChange"
        id="rbac_addUserRoles_tableCheck"
        v-loading="loading"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="角色名称"
          width="150">
          <template slot-scope="scope">{{ scope.row.role_name }}</template>
        </el-table-column>
        <el-table-column
          prop="role_type.name"
          label="角色类型"
          width="160">
        </el-table-column>
        <el-table-column
          prop="remarks"
          label="描述"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <div class="drawer_footer">
      <el-button @click="closeDialog" id="rbac_addUserRoles_cancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit()" :disabled="isDisabled" :loading="submitLoading" id="rbac_addUserRoles_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>

    </div>
  </el-drawer>

</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"

  export default {
    props: {
      addUserRolesObj: {
        type: Object
      },
      isShow: {
        type: Boolean
      },
      userId: {
        type: Number
      }
    },
    data() {
      return {
        baseInfo: '',
        userPageData: {
          per_page: 5,
          current_page: 1,
          total_page: '',
          total_count: '',
          keywords: '',
        },
        pageTotal: 0,
        isVisible: this.isShow,
        loading: true,
        submitLoading: false,
        rolesList: [],
        multipleSelection: [],
        isDisabled: true,
        maxHeight: '300px'
      }
    },
    mounted() {
      this.getUserRolesList()
      const that = this
      const BASEHEIGHT = 170
      this.$nextTick(() => {
        let flowHeight = document.body.clientHeight - BASEHEIGHT
        this.maxHeight = flowHeight + 'px'
      })
      window.onresize = () => {
        return (() => {
          let flowHeight = document.body.clientHeight - BASEHEIGHT
          this.maxHeight = flowHeight + 'px'
        })()
      }
    },
    destroyed() {
      window.onresize = null;
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog')
      },
      onSubmit() {
        this.submitLoading = true
        let role_ids = []
        this.multipleSelection.forEach(item => {
          role_ids.push(item.role_id)
        })
        let para = {
          "user_id": this.userId,
          "role_ids": role_ids
        }
        requestMethod.userDetialsRolesOperating('post', para).then(res => {
          res.code === 200 ?
            (this.$message({message: res.message, type: 'success'}), this.$emit('loadUserRolesFn'), this.$emit('closeDialog'))
            : this.$message.error(res.message);
          this.submitLoading = false
        })
      },
      getUserRolesList() {
        let para = {
          current_page: 1,
          per_page: 10
        };
        requestMethod.userRolesList('get', para, this.userId).then(res => {
          this.rolesList = res.data.roles
          this.loading = false
        })
      },
      // 上下分页
      handleCurrentChange(val) {
        this.userPageData.current_page = val;
        this.getUserRolesList()
      },
      // 每页显示多少条
      handleSizeChange(val) {
        this.userPageData.per_page = val;
        this.getUserRolesList()
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
        this.isDisabled = val.length == 0 ? true : false
      },
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style lang="less" scoped>

  .table-container{
    padding: 0 10px;
  }
</style>
