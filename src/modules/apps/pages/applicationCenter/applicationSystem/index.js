import template from './index.vue'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import pageHeader from "@/components/pageHeader.vue"
import Pagination from "@/components/pagination"
import tagInList from "@/components/tagManagement/tagInList.vue";
import tagInResult from "@/components/tagManagement/tagInResult.vue";
import TagInDetails from "@/components/tagManagement/tagInDetails";
import TagInMultiple from "@/components/tagManagement/tagInMultiple";
import TagInDelete from "@/components/tagManagement/tagInDelete";
//引入API
import * as requestMethod from "./../../../api/applicationCenter/applicationSystem"
import {
  getSession
} from '@/commons/js/searchFresh.js'
import da from "element-ui/src/locale/lang/da";
export default {
  ...template,
  data() {
    return {
      searchNeedData: {
        data: []
      },
      loading: true,
      addBtnLoading: false,
      initShow: false,
      driverRowData: {},
      appMemberList: [],
      certorganFilters: [],
      departmentFilters: [],
      isShow: false,
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      theTagObj: {
        // 应用系统为7
        // tag_category: '7',
        // 全局、组件s
        tag_type: '1,2,3'
      },
      tagAddObj: {
        show: false
      },
      tagRemoveObj: {
        show: false
      },
      tagMultipleObj: {
        show: false
      },
      multipleSelection: []
    }
  },
  mounted() {
    // this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
  },
  methods: {
    addSystem() {
      this.$router.push({
        path: '/applicationCenter/applicationSystem/addSystem/addSystemFirst',
        query:{
          operation:'add'
        }
      })
    },
    showDetails(row, selectedTab) {
      //row.selectedTab = selectedTab
      this.$router.push({
        path: '/applicationCenter/applicationSystem/systemDetail',
        query: {
          app_id:row.app_id,
          selectedTab:selectedTab,
          operation:'edit'
        }
      });
    },
    toSearch(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)

    },
    searchContdition(type) {
      this.getDataList(getSession('searchFresh').keyword, type=='list' ? getSession('searchFresh').pageNo : 1, getSession('searchFresh').pageSize)
    },
    // 删除应用系统数据
    deleteAppSystem(row) {
      this.$confirm(`确认删除该应用系统 ${row.app_name} 吗?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          let app_id = row.app_id
          requestMethod.deleteAppSystem('delete', app_id).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
              this.getDataList()
            } else {
              this.$message.error(res.message)
            }
          })
        })
        .catch(() => { })
    },
    getDataList(data, pageNo, pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.loading = true
      requestMethod.getSystemList('get', para).then(res => {
        this.appMemberList = res.data.items
        this.pagination = res.data.pagination_data
        this.loading = false
      })
    },
    closeDialog() {
      this.isShow = false
      this.tagAddObj.show = false
      this.tagRemoveObj.show = false
      this.tagMultipleObj.show = false
    },
    // 上下分页
    handleCurrentChange(val) {
      this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
    },
    searchList(data) {
      this.getDataList(data)
    },
    // 驱动器详情预留
    showDriverDetails(data) {
      let res = JSON.stringify({
        host_id: data.host_id
      })
      this.$router.push({
        name: 'hostMachineDetails',
        query: {
          res
        }
      })
    },
    beforeHandleCommand(row, command) {
      return {
        'row': row,
        'command': command
      }
    },
    handleCommand(command) {
      switch (command.command) {
        case 'delete':
          this.deleteAppSystem(command.row)
          break;
        case 'addTags':
          this.tagAddObj = {
            show: true,
            app_id: String(command.row.app_id),
            tagList: JSON.stringify(command.row.tags)
          }
          break;
        case 'removeTags':
          this.tagRemoveObj = {
            show: true,
            app_id: String(command.row.app_id),
            tagList: JSON.stringify(command.row.tags)
          }
          break;
        default:
          break;
      }
    },
    loadList() {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    handleCommandBatch(command) {
      let appIds = this.multipleSelection.map(item => item.app_id).join(',')
      let tags = this.multipleSelection.map(item => item.tags)
      let tagsArr = [].concat.apply([], tags)
      let lastArr = []
      tagsArr.forEach(item => {
        if (item != null) {
          lastArr.push(item)
        }
      })
      switch (command) {
        case 'batchBind':
          if(this.multipleSelection.length !=0) {
            this.tagMultipleObj = {
              show: true,
              app_id: appIds,
              tagList: JSON.stringify(lastArr),
              multipleSelection: this.multipleSelection
            }
          }else {
            this.$message.warning('请勾选应用系统')
          }
          break;
        case 'batchUnBind':
          if (this.multipleSelection.length != 0) {
            this.tagRemoveObj = {
              show: true,
              app_id: appIds,
              tagList: JSON.stringify(lastArr)
            }
          }else {
            this.$message.warning('请勾选应用系统')
          }
          break;
        default:
          break;
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
    getTags(item){

      let data=  [];
      if(item!==null && item.length > 1){
        data = item.slice(0,2);

      }else{
        data = item
      }
      console.log(data);
      console.log(2222);
      return data;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
  components: {
    pageHeader,
    Pagination,
    enumSearch,
    tagInList,
    TagInDetails,
    TagInDelete,
    tagInResult,
    TagInMultiple
  }
}
