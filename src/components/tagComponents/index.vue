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
          id="ops_jobManagement_add"
          :disabled="!authority.add"
        >创建标签</el-button>
      </template>
    </pageHeader>
    <div class="ts-middle-part">
      <enumSearch
        :theItems="'tag'"
        :serviceType="serviceType"
        :theUrl="theUrl"
        @toSearch="toSearch"
        @searchContdition="searchContdition"
      ></enumSearch>
    </div>
    <div class="ts-body-part">
      <el-button @click="deleteMutTag" id="rbac_tagManagement_mutDelete" style="margin: 16px"
                 :disabled="!authority.batchDelete"
      >批量删除</el-button>
      <el-table
        :data="tableList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <template slot="empty">
          <empty-in-table v-if="tableList.length<1&&!loading"></empty-in-table>
        </template>
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
                {{ scope.row[item.key] ? scope.row[item.key] : '-'}}
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
            <el-button
              type="text"
              size="small"
              @click="editTag(scope.row)"
              :disabled="scope.row['value'].counts!=0||!authority.edit"
              id="rbac_tagManagement_edit"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="deleteTag(scope.row)"
              id="rbac_tagManagement_delete"
              :disabled="scope.row['value'].counts!=0||!authority.delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :paginationData="pagination" @handleCurrentChange="handleCurrentChange" @handleSizeChange="handleSizeChange"></pagination>
      <add-tag v-if="tagObj.show" :isShow="tagObj.show" @closeDialog="closeDialog" :tagObj="tagObj" @loadList="getDataList" @get-data-list="getDataList"></add-tag>
    </div>
  </div>
</template>

<script>
  import enumSearch from "@/components/searchCom/enumSearch.vue"
  import Pagination from "@/components/pagination";
  import * as requestMethods from "./utils/utils"
  import { getSession } from '@/commons/js/searchFresh.js'
  import { tableHeader } from "./utils/utils";
  import addTag from "./components/addTag.vue"
  //引入公共头部组件
  import pageHeader from "@/components/pageHeader.vue"
  export default {
    props: {
      tagObjList: {
        type: Object
      },
      serviceType:{
        type: String,
        default: ''
      },
      theUrl:{
        type: String,
        default: ''
      },
      authority: {
        type: Object
      }
    },
    data() {
      return {
        tableList: [],
        searchNeedData: { data: [] },
        loading: true,
        tableHeader: tableHeader,
        pagination: {
          current_page: 1, // 当前位于哪页
          per_page: 10, //每页显示多少条
          total_count: 0,
          total_page: 1
        },
        password: '2',
        tagObj: {
          show: false,
          tag_category: ''
        },
        multipleSelection: ''
      }
    },
    mounted() {
      console.log(2222);
    },
    methods: {
      searchContdition(){
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
      },
      toSearch(val) {
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
      },
      getDataListEdit() {
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
      },
      getDataListAdd() {
        this.getDataList([], 1, getSession('searchFresh').pageSize)
      },
      addTag() {
        this.tagObj = {
          show: true,
          type: 'add',
          title: '创建标签',
          tag_category: this.tagObjList.tag_category
        }
      },
      editTag(data) {
        this.tagObj = {
          show: true,
          type: 'edit',
          title: '编辑标签',
          tag_id: data.tag_id,
          value_id: data.value.value_id,
          tag_type: data.tag_type.key,
          tag_category: this.tagObjList.tag_category
        }
      },
      // deleteTag(data) {
      //   this.$confirm(`确认删除该标签吗?`, '提示', {
      //     type: 'warning'
      //   }).then(() => {
      //     let para = {
      //       tag_list: [
      //         {
      //           tag_id: data.tag_id,
      //           value_id: data.value.value_id
      //         }
      //       ]
      //     }
      //     requestMethods.deleteTag('delete', para).then(res => {
      //       if (res.code == 200) {
      //         this.$message({
      //           message: '删除成功',
      //           type: 'success'
      //         })
      //         this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
      //       } else {
      //         this.$message.error(res.message || '标签删除失败');
      //       }
      //     })
      //   })
      //     .catch(() => {
      //
      //     })
      // },

      async deleteTag(data) {
        const {
          tag_id,
          tag_key,
          tag_type,
          value
        } = data;
        let para = {
          tag_list: [
            {
              tag_id,
              value_id: value.value_id
            }
          ]
        }
        if (value.counts > 0 && tag_type.key === 3) {
          const title = tag === `您确定要删除标签"${tag_key}:${value.tag_value}"吗？`;
          const messageParam = {
            title,
            type: 'warning'
          };
          const confirmResult = await this.handleMessage(messageParam);
          if (confirmResult !== 'confirm') {
            return;
          }
        }

        this.deleteTagRequest(para);

      },

      async deleteTagRequest(para) {
        const res = await requestMethods.deleteTag('delete', para);
        if (res.code == 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
        } else {
          this.$message.error(res.message || '标签删除失败');
        }
      },

      async handleMessage(messageParam) {
        const {
          title,
          type
        } = messageParam;
        const confirmResult = await this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type
        }).catch(err => err);

        return confirmResult;
      },
      deleteMutTag(data) {
        if (this.multipleSelection.length > 0) {
          this.$confirm(`确认删除选中的${this.multipleSelection.length}条标签吗?`, '提示', {
            type: 'warning'
          }).then(() => {
            let selectedData = this.multipleSelection.map(item => {
              let obj = {
                tag_id: item.tag_id,
                value_id: item.value.value_id
              }
              return obj
            })
            let para = {
              tag_list: selectedData
            }
            requestMethods.deleteTag('delete', para).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
                this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
              } else {
                this.$message.error(res.message || '标签删除失败');
              }
            })
          })
            .catch(() => {

            })
        }else {
          this.$message.warning('请选择要删除的标签')
        }


      },
      // 标签列表
      getDataList(data, pageNo, pageSize) {
        let para = {
          tag_category: this.tagObjList.tag_category,
          per_page: pageSize,
          current_page: pageNo,
          keyword: JSON.stringify(data)
        };
        this.loading = true
        requestMethods.getTagList('get', para).then(res => {

          if (res.code == 200) {
            this.tableList = res.data.items
            this.pagination = res.data.pagination_data
          }else {
            this.$message.error(res.message || '列表获取失败')
          }
          this.loading = false
        })
      },
      closeDialog() {
        this.tagObj.show = false;
      },
      // 上下分页
      handleCurrentChange(val) {
        this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
      },
      // 每页显示多少条
      handleSizeChange(val) {
        this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
      },
      toJobDetails(data) {
        this.$router.push({ name: 'jobDetails', query: { job_id: data.job_id } })
      },
      beforeHandleCommand(row, command) {
        return {
          'row': row,
          'command': command
        }
      },
      handleCommand(command) {
        switch (command.command) {
          case 'edit':
            this.$router.push({ name: 'addJobBase',query:{type: 'edit',job_id: command.row.job_id}})
            break;
          case 'delete':
            this.deleteJob(command.row)
            break;
          default:
            break;
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      isDisabled(row, index) {
        // 目前只有引用次数作为判断条件
        if (row.value.counts > 0) {
          return false
        }else {
          return true
        }
      }
    },
    components: {
      pageHeader,
      Pagination,
      enumSearch,
      addTag
    },
  }

</script>

<style src="@/components/tagComponents/index.less" lang="less" scoped></style>

