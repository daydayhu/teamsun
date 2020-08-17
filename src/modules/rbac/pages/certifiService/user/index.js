import template from './index.vue'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import addUser from "./components/addUser.vue"
import userPassword from "./components/userPassword.vue"
// import importUser from "./components/importUser.vue"
import Pagination from "@/components/pagination";
import {getSession} from '@/commons/js/searchFresh.js'
import * as requestMethod from "@/modules/rbac/api/certifiService/userApi.js"
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
  ...template,
  data() {
    return {
      carrier: {
        show: false,
        title: '',
        isModal: true,
        rowData: {}
      },
      password: {
        show: false,
        title: '',
        isModal: true,
        rowData: {}
      },
      importUser: false,
      searchNeedData: {data: []},
      loading: true,
      initShow: false,
      userList: [],
      searchColumn: [
        {label: '用户名', key: 'user_name', type: 'text'},
        {label: '描述', key: 'remarks', type: 'text'},
        {label: '手机号', key: 'phone', type: 'text'},
        {label: '邮箱', key: 'email', type: 'text'},
        {label: '认证方式', key: 'source_type', type: 'text'},
        {label: '状态', key: 'is_active', type: 'text'},
      ],
      // certorganFilters: [],
      // departmentFilters: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      }
    }
  },
  mounted() {
    // 需求变更，在用户列表中筛选组织和部门统一到搜索框中
    // certOrganDepartmentApi('get', '', 'org').then(res => {
    //   let data = res.data;
    //   for (let i = 0; i < data.length; i++) {
    //     this.certorganFilters.push({
    //       value: data[i].dep_id,
    //       text: data[i].dep_name,
    //     })
    //   }
    // })
    // userDepartmentApi('get', '', 'dep').then(res => {
    //   let data = res.data.departments;
    //   for (let i = 0; i < data.length; i++) {
    //     this.departmentFilters.push({
    //       value: data[i].dep_id,
    //       text: data[i].dep_name
    //     })
    //   }
    // })
    //this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
  },
  methods: {
    searchContdition() {
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
    getDataList(data = getSession('searchFresh').keyword, pageNo = getSession('searchFresh').pageNo, pageSize = getSession('searchFresh').pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.loading = true
      requestMethod.getUserListApi('get',para).then(res => {
        this.userList = res.data.items
        this.pagination = res.data.pagination_data
        this.loading = false
      })
    },
    addUserFn() {
      this.carrier = {
        title: '新建用户',
        show: true,
        type: 'add'
      }
    },
    editUserFn(row) {
      this.carrier = {
        rowData: {...row},
        title: '编辑用户',
        show: true,
        type: 'edit'
      }
    },
    // 删除数据
    deleteUserFn(row) {
      this.$confirm('确认删除该用户吗?', '提示', {
        type: 'warning'
      })
        .then(() => {
          // const para = { user_id: row.user_id }
          let data = {
            "users": [{
              "user_id": row.user_id
            }],
            "session_id": 0
          }
          this.loading = true
          requestMethod.deleteUserApi('delete', data).then(res => {
            this.loading = false
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
            } else {
              this.$message({
                message: '此用户已关联用户组不能删除',
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
        })
    },
    // importUserFn(res, obj) {
    //   this.importUserObj = {
    //     id: 1,
    //     type: 'add',
    //     title: '新建用户'
    //   }
    //   this.importUser = true
    // },
    closeDialog() {
      this.carrier.show = false;
      this.password.show = false;
      this.importUser = false;
      clearTimeout(this.timer);
    },
    activeStatus(row) {
      let para = {
        "is_active": row.is_active,
      }
      requestMethod.changeStatusApi('patch', para, row.user_uuid).then(res => {
        // 状态提示为修改之后的状态
        if (res.code == 200) {
          this.$message({
            message: row.is_active == 1 ? '用户已激活' : '用户已关闭',
            type: row.is_active == 1 ? 'success' : 'warning'
          })
        } else {
          this.$message.error('用户状态修改失败！')
        }

      })
    },
    // 上下分页
    handleCurrentChange(val) {
      this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
    },
    showUserDetails(data) {
      let res = JSON.stringify({user_id: data.user_id})
      this.$router.push({name: 'userDetails', query: {res}})
    },
    filterData() {
      console.log(this)
    },
    resetDateFilter() {
      this.$refs.filterTable.clearFilter('date');
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    formatter(row, column) {
      return row.address;
    },
    filterTag(value, row) {
      return Number(row.belong_org_ids) === Number(value);
    },
    filterDepTag(value, row) {
      return Number(row.belong_dep_ids) === Number(value);
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    beforeHandleCommand(row, command) {
      return {
        'row': row,
        'command': command
      }
    },
    handleCommand(command) {
      switch (command.command) {
        case 'updataPassword':
          this.password = {
            title: '修改密码',
            show: true,
            type: 'updata',
            userUuid: command.row.user_uuid
          }
          break;
        case 'resetPassword':
          this.password = {
            title: '重置密码',
            show: true,
            type: 'resetdata',
            userUuid: command.row.user_uuid
          }
          break;
        case 'delete':
          this.deleteUserFn(command.row)
          break;
        default:
          break;
      }

    },

  },
  components: {
    addUser,
    // importUser,
    pageHeader,
    enumSearch,
    Pagination,
    userPassword
  },
}
