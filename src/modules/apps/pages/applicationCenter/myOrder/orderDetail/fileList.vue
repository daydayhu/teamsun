<template>
  <div>
    <el-table ref="fileTable" :data="fileTableData" style="width: 100%" v-loading="fileTableLoading">
      <template slot="empty">
          <empty-in-table v-if="fileTableData.length<1&&!fileTableLoading"></empty-in-table>
        </template>
      <el-table-column prop="file_name" label="文件名"></el-table-column>
      <!-- <el-table-column prop="file_type" label="文件类型"></el-table-column> -->
      <el-table-column prop="download_url" label="下载地址">
        <template slot-scope="scope">
          <el-button class="url" @click="goUrl(scope.row.download_url)" type="text"> {{scope.row.download_url}}</el-button>
          <span v-clipboard:copy="scope.row.download_url" v-clipboard:success="onCopy" v-clipboard:error="onError">
            <svg-icon icon-class="copy"></svg-icon>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="create_user_name" label="上传用户">
      </el-table-column>
      <el-table-column prop="create_time" label="上传时间"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import * as requestMethod from "../../../../api/applicationCenter/applicationSystem";
export default {
  data() {
    return {
      activeName: "file",
      //审批历史数据
      fileTableData: [],
      fileTableLoading: true
      //审批
    };
  },
  created() {
    this.getFileList();
  },
  methods: {
    onCopy() {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
      this.snackBar.info(this.$t('prompt.copySuccess'))
    },
    onError() {
      this.$message.error(this.$t('prompt.copyFail'))
    },
    goUrl(url) {
      window.location.href = url
    },
    //获取订单详情审批历史
    getFileList() {
      let param = {
        ticket_id: this.$route.query.ticket_id
      }
      requestMethod.getFileList('get', param)
        .then(res => {
          if (res.code === 200) {
            this.fileTableData = res.data
          } else {
            this.$message.error(res.message);
          }
          this.fileTableLoading = false;
        })
    }
  }
}
</script>
<style lang="less" scoped>
.url {
  color: 306bff;
}
</style>
