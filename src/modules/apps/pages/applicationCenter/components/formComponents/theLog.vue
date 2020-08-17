<template>
  <div class="content">
    <el-collapse v-model="activeNames" style="padding:15px 20px;">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="formTit">
            基本信息
            <div class="line"></div>
          </div>
        </template>
        <div class="formBody">
          <el-table :data="tableList" v-loading="loading">
            <el-table-column v-for="item in tableHeader" :key="item.key" :label="item.label" :prop="item.key"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableList)" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="createBox" @click='openDrawer'><i class='el-icon-circle-plus'></i>添加</div>
      </el-collapse-item>
    </el-collapse>
    <addBackup ref="addBackup" v-if="isShow" :is-show="isShow" @closeDialog="closeDialog" :canvasObj="canvasObj" :operationSet="operationSet" @reloadList="getLogList"></addBackup>
  </div>
</template>
<script>
import addBackup from "../formComponents/compontents/addmonitor";
import * as config from './untils/config.js';
import * as requestMethod from '@/modules/apps/api/serviceCatalog/theLogForm.js'

export default {
  name: "theBackup",
  props: {
    phaseState: {
      type: String
    },
    canvasObj: {
      type: Object
    },
    operationSet: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      tableHeader: config.tableHeader,
      tableList: [
        {
          "host_name": "1", "log_user": "1", "log_formater": "1", "log_alarm": "1",
          "pro_ip": "1", "outband_ip": "1", "log_system": "1", "log_type": "1",
          "log_version": "1", "log_out_type": "1", "log_loop_type": "1", "log_path": "1",
        }
      ],
      activeNames: ['1'],
      isShow: false,
    };
  },
  created() {
    this.getLogList();
  },
  mounted() {
    console.log(this.canvasObj);

  },
  watch: {
  },
  methods: {
    forComponentContent() {
      var obj = {
        flag: true,
        mess: ""
      }
      return obj
    },
    closeDialog(res, obj) {
      this.isShow = false;
    },
    openDrawer() {
      this.isShow = true
    },
    delete_logdata(obj) {
      this.$confirm('是否删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = {
          api_log_id: obj.api_log_id,
          logitem_id: obj.logitem_id
        }
        requestMethod.get_post_deleteLog('delete', param).then(res => {
          if (res.code == 200) {
            this.getLogList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteRow(index, arr) {
      this.delete_logdata(arr[index]);
    },
    getLogList() {
      this.loading = true;
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        node_set_id: this.operationSet,
        node_canvas_uuid: this.canvasObj.service_uuid
      }
      requestMethod.get_post_log('get', param).then(res => {
        if (res.code == 200) {
          this.tableList = res.data.items
        } else {
          this.$message.error(res.message)
        }
        this.loading = false;
      })
    }
  },
  components: { addBackup }
};
</script>
<style lang="less" scoped>
.content {
  position: relative;
  /deep/ .el-collapse-item__arrow {
    position: absolute;
    left: 45px;
  }
  /deep/ .el-collapse-item {
    border: 0px !important;
  }
  /deep/ .el-collapse-item__wrap {
    border-bottom: 0px;
  }
  /deep/ .el-collapse-item__header {
    background: #fff !important;
    border-bottom: 1px solid #e7edf3;
  }
  .formTit {
    padding-left: 60px;
    padding-right: 20px;
    font-size: 14px;
    width: 100%;
    //background: rgba(48, 107, 255, 0.03);
    .line {
      float: right;
      margin-right: 200px;
      height: 1px;
      background: #333;
      margin-top: 25px;
      display: none;
      width: calc(100% - 290px);
    }
  }
  .formBody {
    margin: 0 auto;
    margin-top: 20px;
    width: 96%;
  }
  .createBox {
    cursor: pointer;
    color: rgb(64, 158, 255);
    font-size: 12px;
    border: 1px dashed #ccc;
    text-align: center;
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
    margin-top: 20px;
    width: 96%;
    margin-left: 2%;
  }
}
</style>
