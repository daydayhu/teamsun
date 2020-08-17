import template from './index.vue';
import customList from './components/customList.vue';
import addUserGroups from "./components/addUserGroups.vue";
import Pagination from "@/components/pagination";
import enumSearch from "@/components/searchCom/enumSearch.vue"
import {getSession} from '@/commons/js/searchFresh.js'
import * as requestMethod from "@/modules/rbac/api/certifiService/userGroupApi";
import {groupTable} from './utils/utils';
import authId from './utils/config.js'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"

export default {
  ...template,
  components: {
    pageHeader,
    addUserGroups,
    customList,
    Pagination,
    enumSearch
  },
  data() {
    return {
      isWarmPrompt: true,
      dialogFormVisible: false,
      customListVisible: false,
      tableHeader: groupTable.tableHeader,
      filterTableHeader: groupTable.tableHeader,
      tableData: [],
      editData: {},
      dialogTitle: '',
      keywords: '',
      pagination: {
        current_page: 1,  // 当前位于哪页
        // pageSize: 5,   // 1页显示多少条
        per_page: 5,  //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      loading: false,
      authId
    }
  },
  mounted: function () {
    // 分页搜索
    //this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
  },
  computed: {
    tableHeaderList() {
      if (this.filterTableHeader.length > 0) {
        return this.filterTableHeader;
      } else {
        return this.tableHeader;
      }
    }
  },
  methods: {
    searchContdition() {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    toSearch(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    getDataList(data, pageNo, pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.loading = true
      requestMethod.userGroupList('get', para).then(res => {
        if (res.code === 200) {
          this.tableData = res.data.items;
          this.pagination = res.data.pagination_data;
        }
        this.loading = false
      })
    },
    deleteUserGroup: function (group_id) {
      this.$confirm('确认删除该用户组吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          requestMethod.userGroupList('delete', {group_id}).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
            } else if (res.code === 400) {
              this.$message.warning(res.message);
            } else {
              this.$message.error('删除失败');
            }
          })
        })
        .catch(() => {
        })
    },
    clickWarmPrompt: function () {
      this.isWarmPrompt = false;
    },
    customListBtn: function () {
      this.customListVisible = true
    },
    addUserGroupBtn: function (res, obj) {
      this.dialogFormVisible = true
      this.dialogTitle = '新建用户组'
      this.editData = {}
    },
    closeDialog: function (res, obj) {
      this.dialogFormVisible = false;
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    closeCustomListDialog: function (val) {
      if (val.length) {
        const newTableHeader = [];
        val.forEach(item => {
          const data = this.tableHeader.find(val => val.label == item);
          newTableHeader.push(data);
        });
        this.filterTableHeader = newTableHeader;
      }
      this.customListVisible = false;
    },
    handleClickEdit: function (index, data) {
      this.dialogFormVisible = true;
      this.dialogTitle = '编辑用户组';
      this.editData = data;
    },
    handleClickDelete: function (index, data) {
      this.deleteUserGroup(data.group_id);
    },
    clickUserGroupsName: function (data) {
      const {group_id} = data;
      this.$router.push({name: 'userGroupDetails', query: {group_id}})
    },
    handleCurrentChange: function (val) {
      this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
    },
    handleSizeChange: function (val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
    }
  }
}
