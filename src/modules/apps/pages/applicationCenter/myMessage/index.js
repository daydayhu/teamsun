import template from './index.vue'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import pageHeader from "@/components/pageHeader.vue"
import Pagination from "@/components/pagination"
import Bus from '@/commons/js/bus'
//引入API
import * as requestMethod from "./../../../api/applicationCenter/myMessage"
import {
  getSession
} from '@/commons/js/searchFresh.js'
export default {
  ...template,
  data() {
    return {
      //是否已读
      is_read: 0,
      //搜索数据
      searchData: {
        data: []
      },
      messageTableLoading: true,
      addBtnLoading: false,
      appMessageList: [],
      pagination: {
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      },
      //
      multipleSelection: []
    }
  },
  mounted() {
    //this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
  },
  methods: {
    //跳转到详情
    toDetail(val) {
      this.$router.push({
        path: '/applicationCenter/myNews/newsDetail',
        query: {
          message_id: val.app_message_id
        }
      })
    },
    toSearch(val) {
      this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)

    },
    searchContdition() {
      this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    //获取列表数据
    getMessageList(data, pageNo, pageSize) {

      let para = {
        is_read: this.is_read,
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.messageTableLoading = true
      requestMethod.getMessageList('get', para).then(res => {
        this.appMessageList = res.data.items
        this.pagination = res.data.pagination_data
        this.messageTableLoading = false
      })
    },
    // 上下分页
    handleCurrentChange(val) {
      this.getMessageList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
    },
    // 每页显示多少条
    handleSizeChange(val) {
      this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
    },
    searchList(data) {
      this.getMessageList(data)
    },
    //移除
    onDelete() {
      let para = {
        // is_read: ,
        is_deleted: 1,
        id_list: this.multipleSelection
      }
      this.messageTableLoading = true
      requestMethod.setMessage('post', para).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        } else {
          this.$message.error(res.message)
        }
        this.messageTableLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.messageTableLoading = false
      })


    },
    //标记为已读
    onRead() {
      let para = {
        is_read: 1,
        // is_deleted:null,
        id_list: this.multipleSelection
      }
      this.messageTableLoading = true
      requestMethod.setMessage('post', para).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.getMsgNums()
          this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        } else {
          this.$message.error(res.message)
        }
        this.messageTableLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.messageTableLoading = false
      })

    },
    //全部标记为已读
    onReadAll() {
      this.messageTableLoading = true
      requestMethod.setMessageAllRead('get').then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.getMsgNums()
          this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        } else {
          this.$message.error(res.message)
        }
        this.messageTableLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.messageTableLoading = false
      })
    },
    //获取消息数量
    getMsgNums() {
      requestMethod.getMessageNum("get").then(res => {
        if (res.code === 200) {
          Bus.$emit("getMsgNum", res.data.count)
        }
      })
    },
    //操作标记
    handelFlag(val) {
      this.messageTableLoading = true
      requestMethod.getMessageFlag('post', {
        message_id: val.app_message_id,
        body: {
          is_flag: val.is_flag.key
        }
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        } else {
          this.$message.error(res.message)
        }
        this.messageTableLoading = false
      }).catch(err => {
        this.$message.error(err)
        this.messageTableLoading = false
      })

    },
    //是否已读选择框
    selectChange(val) {
      this.is_read = val
      console.log("selectChange is_read", val, this.is_read)
      this.getMessageList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)

    },
    //表格多选事件
    handleSelectionChange(val) {

      this.multipleSelection = val.map(e => {
        return e.app_message_id
      });
      console.log("handleSelectionChange  multipleSelection", val, this.multipleSelection)

    }

  },
  components: {
    pageHeader,
    Pagination,
    enumSearch
  }
}
