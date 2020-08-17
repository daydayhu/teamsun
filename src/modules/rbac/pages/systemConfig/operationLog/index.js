import template from './index.vue'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import Pagination from "@/components/pagination";
import { getOperationLog } from "@/modules/rbac/api/systemConfig/operationLog.js";
import {getSession} from '@/commons/js/searchFresh.js'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"

export default {
  ...template,
  data() {
    return {
      portGroupsInfo: [],
      loading: true,
      pagination:{
        current_page: 1, // 当前位于哪页
        per_page: 10, //每页显示多少条
        total_count: 0,
        total_page: 1
      }
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    searchContdition() {
      this.getPortGroupsInfo(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    toSearch(val) {
      this.getPortGroupsInfo(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    getPortGroupsInfo(data, pageNo, pageSize) {
      this.loading = true
      getOperationLog('get', {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.portGroupsInfo = [...res.data.items]
          this.pagination = res.data.pagination_data
        } else {
          this.$message.error(res.message);
        }
      })
    },
    handleCurrentChange(val) {
      this.getPortGroupsInfo(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize);
    },
    handleSizeChange(val) {
      this.getPortGroupsInfo(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val);
    }
  },
  components: {
    pageHeader,
    enumSearch,
    Pagination,
  },
}
