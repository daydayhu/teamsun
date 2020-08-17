<template>
  <el-drawer
    :title="addCertOrganUserObj.title"
    :before-close="closeDialog"
    :visible.sync="isVisible"
    size="50%"
    direction="rtl"
    ref="drawer"
  >
    <div class="ts-drawer__content">
      <div class="ts-content-wrap">
<!--        <div class="search-wrap">-->
<!--          <el-input placeholder='按用户名/姓名搜索' class="search-input" v-model="searchVal" @keyup.enter.native="completeSearch"></el-input>-->
<!--          <i class="el-icon-search" @click="completeSearch"></i>-->
<!--        </div>-->
        <enumSearch :theItems="'org_user'" :serviceType="'rbac'" @toSearch="toSearch" @searchContdition="searchContdition"></enumSearch>
        <div class="table-container">
          <el-table
            ref="multipleTable"
            :data="userList"
            tooltip-effect="dark"
            style="width: 100%"
            :max-height="maxHeight"
            @selection-change="handleSelectionChange"
            id="rbac_addCertOrganUser_tableCheck"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="用户名"
              width="150">
              <template slot-scope="scope">{{ scope.row.user_name }}</template>
            </el-table-column>
            <el-table-column
              prop="alias_name"
              label="姓名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="remarks"
              label="描述"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>
    <div class="drawer_footer">
        <el-button @click="closeDialog" id="rbac_addCertOrganUser_cancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit()" :disabled="isDisabled" :loading="submitLoading" id="rbac_addCertOrganUser_submit">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      </div>
  </el-drawer>

</template>

<script>
  import * as requestMethod from "@/modules/rbac/api/certifiService/organizationApi.js"
  import enumSearch from "@/components/searchCom/enumSearch.vue"
  import Pagination from "@/components/pagination";
  import {getSession} from '@/commons/js/searchFresh.js'
  export default {
    props: {
      addCertOrganUserObj: {
        type: Object
      },
      isShow: {
        type: Boolean
      },
      dep_info: {
        type: Object
      }
    },
    components: {
      enumSearch
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
        userList: [],
        multipleSelection: [],
        isDisabled: true,
        submitLoading: false,
        searchVal: '',
        maxHeight: '300px'
      }
    },
    mounted() {
      this.$nextTick(() => {
        const BASEHEIGHT = 200
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
      searchContdition() {
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
      },
      toSearch(val) {
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
      },
      closeDialog() {
        this.$emit('closeDialog')
      },
      onSubmit() {
        this.submitLoading = true
        let user_ids = []
        this.multipleSelection.forEach(item => {
          user_ids.push(item.user_id)
        })

        let para = {
          "dep_id": this.dep_info.dep_id,
          "user_ids": user_ids
        }
        requestMethod.departmentUsersOperating('post', para).then(res => {
          res.code === 200 ?
            (this.$message({message: res.message, type: 'success'}), this.$emit('initUserListFn'), this.$emit('closeDialog'))
            : this.$message.error(res.message);
          this.submitLoading = false
        })
      },
      getDataList(data = getSession('searchFresh').keyword, pageNo = getSession('searchFresh').pageNo, pageSize = getSession('searchFresh').pageSize) {
        let para = {
          per_page: pageSize,
          current_page: pageNo,
          keyword: JSON.stringify(data)
        };
        this.loading = true
        if(this.dep_info.is_root == 1) {
          // 组织 **org_id = dep_id**
          requestMethod.getNotOrgUsers('get', this.dep_info.dep_id, para).then(res => {
            if (res.code == 200) {
              this.userList = res.data.items
            }else {
              this.$message.error('获取当前组织非直属用户列表失败')
            }
            this.loading = false
          })
        }else {
          // 部门
          requestMethod.getNotDepUsers('get', this.dep_info.dep_id, para).then(res => {
            if (res.code == 200) {
              this.userList = res.data.items
            }else {
              this.$message.error('获取当前组织非当前部门直属用户列表失败')
            }
            this.loading = false
          })
        }
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
      }
    }

  }
</script>

<style lang="less" scoped>
  .search-input {
    padding: 10px 10px 16px 10px;
  }

  .search-wrap {
    position: relative;

    .el-icon-search {
      position: absolute;
      top: 18px;
      right: 30px;
      cursor: pointer
    }

    .el-icon-search:hover {
      color: #5bb6ff
    }
  }
  .ts-content-wrap{
    padding: 16px;
  }
</style>
