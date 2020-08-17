<template>
  <div class="app-overview">
    <div class="ts-content-wrap" style='padding: 10px 0;margin-top: 0'>
      <slot name="search"></slot>
      <div class="table-container" style="margin-top: 0;padding: 0">
        <el-table
          ref="multipleTable"
          :data="this.tableInfo.tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          id="rbac_roleList_tableCheck"
          v-loading="loading"
        >
          <el-table-column
            type="selection"
            v-if="this.isMultiple"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="(item,index) in tableInfo.tableHeader" :key="index"
            :prop="item.key"
            :label="item.label"
            :width="item.width">
            <template slot-scope="scope">
              <el-button v-if="item.key === 'name'" @click="clickRoleName(scope.row)" type="text" size="small" id="rbac_roleList_clickRoleName">{{
                scope.row[item.key] }}
              </el-button>
              <span v-else-if="item.key === 'previous_server'" @click="clickUserGroupsName(scope.row)" type="text"
                    size="small">{{ scope.row[item.key].name }}</span>
              <span v-else>{{ scope.row[item.key] === 'user' ? '用户' :scope.row[item.key] === 'group' ? '用户组' :scope.row[item.key]  }}</span>
            </template>
          </el-table-column>
          <slot name="operate"></slot>
        </el-table>
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tableInfo: {},
      isMultiple: {
        type: Boolean,
        default: true
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        multipleSelection: [],
        maxHeight: '300px'
      }
    },
    mounted: function () {
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
    methods: {
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
        this.$emit('checkbox-info', val);
      },
      clickRoleName(data) {
        if (data.type === 'user') {
          let res = JSON.stringify({user_id: data.id});
          this.$router.push({name: 'userDetails', query: {res}});
        } else if (data.type === 'group') {
          let group_id = {group_id: data.id}
          this.$router.push({name: 'userGroupDetails', query: group_id})
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .ts-content-wrap {
    margin-top: 16px;
    background: #ffffff;

    .el-tabs__nav-wrap {
      margin-left: 12px;

      .el-tabs__active-bar, .el-tabs__item {
        width: 80px !important;
        text-align: center;
      }
    }

    .ts-add-user {
      margin-left: 12px;
    }
  }

  .table-container {
    margin-top: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 2px;
    /*.el-table th{*/
    /*padding: 4px 0;*/
    /*font-family: 'Roboto Regular', 'Roboto';*/
    /*font-weight: 400;*/
    /*font-style: normal;*/
    /*color: #333333;*/
    /*background-color: rgba(235, 237, 242, 0.996078431372549);*/
    /*border-right: 1px solid #fff;*/
    /*}*/
    /*.el-table td{*/
    /*padding: 6px 0;*/
    /*}*/

    .ts-column-blue {
      color: #1890FF;
    }
  }

  .ts-user-avatar {
    margin: 22px;
  }
</style>
