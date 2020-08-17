<template>
  <el-drawer
    :title="addUserGroups.title"
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
        :data="groupsList"
        tooltip-effect="dark"
        style="width: 100%"
        :max-height="maxHeight"
        @selection-change="handleSelectionChange"
        id="rbac_addUserGroups_tableCheck"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="组名称"
          width="150">
          <template slot-scope="scope">{{ scope.row.group_name }}</template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
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
      <el-button @click="closeDialog" id="rbac_addUserGroups_cancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit()" :disabled="isDisabled" :loading="submitLoading" id="rbac_addUserGroups_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
    </div>
  </el-drawer>

</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"
  export default {
    props: {
      addUserGroups: {
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
        groupsList: [],
        multipleSelection: [],
        isDisabled: true,
        maxHeight: '300px'
      }
    },
    mounted() {
      this.getUserList()
      // 滚动条
      const that = this
      this.$nextTick(() => {
        let flowHeight = document.body.clientHeight - 170
        this.maxHeight = flowHeight + 'px'
      })
      window.onresize = () => {
        return (() => {
          let flowHeight = document.body.clientHeight - 170
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
        let group_ids = []
        this.multipleSelection.forEach(item => {
          group_ids.push(item.group_id)
        })
        let para = {
          "user_id": this.userId,
          "group_id": group_ids
        }
        requestMethod.userJoinGroups('post', para).then(res => {
          res.code === 200 ?
            (this.$message({message: res.message, type: 'success'}), this.$emit('closeDialog'), this.$emit('loadUserJoinGroups'))
            : this.$message.error(res.message);
          this.submitLoading = false
        })
      },
      getUserList() {
        let para = {
          per_page: this.userPageData.per_page,
          current_page: this.userPageData.current_page,
          user_id: this.userId
        };
        requestMethod.userDetailsGroupList('get', para).then(res => {
          this.groupsList = res.data.items
          this.loading = false
        })
      },
      // 上下分页
      handleCurrentChange(val) {
        this.userPageData.current_page = val;
        this.getUserList()
      },
      // 每页显示多少条
      handleSizeChange(val) {
        this.userPageData.per_page = val;
        this.getUserList()
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

  .table-container {
    padding: 0 10px;
  }

</style>
