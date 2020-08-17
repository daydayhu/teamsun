<template>
  <div class="block ts-page-block">
    <el-pagination
      background
      :page-sizes="pagination.pageSizes"
      :page-size="pagination.per_page"
      :layout="pagination.layout"
      :total="pagination.total_count"
      :current-page="pagination.current_page"
      :small="pagination.smallFlag"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </div>
</template>


<script>
import {  mapMutations} from "vuex";
import { setSession} from '@/commons/js/searchFresh.js'
export default {
  name: "pagination",
  data() {
    return {
      pagination: {
        per_page: 10, // 1页显示多少条
        layout: "total, sizes, prev, pager, next, jumper", // 翻页属性
        current_page: 1, // 当前位于哪页
        pageSizes: [5, 10, 15, 20], //每页显示多少条
        total_count: 0,
        smallFlag: false,
        isSave: true,
      }
    };
  },

  props: {
    paginationData: {
      type: Object,
    },
    theItems: {
      type: String
    }
  },
  watch: {
    paginationData: {
      handler(newVal) {
        this.pagination = { ...this.pagination, ...newVal }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleCurrentChange(page) {
      let obj = {pageNo: page}
      if (this.pagination.isSave) { setSession('searchFresh',obj) }
      this.$emit("handleCurrentChange", page);
    },
    handleSizeChange(page_size) {
      let obj = {
          pageSize:page_size,
          pageNo:1
      }
      if (this.pagination.isSave) { setSession('searchFresh',obj) }
      this.$emit("handleSizeChange", page_size);
    },
  }
};
</script>

<style lang="less" scoped>
.ts-page-block {
  margin-top: 80px;
  & /deep/ .el-pagination {
    display: flex;
    .el-pagination__total {
      flex: 1;
    }
  }
}
</style>
