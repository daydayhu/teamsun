<template>
  <div class="content">
    <!-- <el-collapse v-model="activeNames" style="padding:15px 20px;" v-if="(baseInfo.VG_plan.indexOf(phaseState)>-1)"> -->
    <el-collapse v-model="activeNames" style="padding:15px 20px;">
      <el-collapse-item name="1" v-if="VG_plan.indexOf(phaseState)>-1 || (phaseState=='2' && VG_plan.indexOf('1')>-1) || (phaseState=='4' && VG_plan.indexOf('3')>-1)">
        <template slot="title">
          <div class="formTit">
            VG规划
            <div class="line"></div>
          </div>
        </template>
        <div class="formBody">
          <el-table :data="tableListVg" v-loading="loadingVg">
            <el-table-column v-for="(item,index) in vgtableHeader" :key="index" :label="item.label" :prop="item.key">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120" v-if="phaseState!=='2' && phaseState!=='4'">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableListVg,'vg')" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="createBox" @click='openDrawer("vg")' v-if="phaseState!=='2' && phaseState!=='4'"><i class='el-icon-circle-plus'></i>添加</div>
      </el-collapse-item>
      <el-collapse-item name="2" v-if="LV_plan.indexOf(phaseState)>-1 || (phaseState=='2' && LV_plan.indexOf('1')>-1) || (phaseState=='4' && LV_plan.indexOf('3')>-1)">
        <template slot="title">
          <div class="formTit">
            LV规划
            <div class="line"></div>
          </div>
        </template>
        <div class="formBody">
          <el-table :data="tableListLv" v-loading="loadingLv">
            <el-table-column v-for="(item,index) in lvtableHeader" :key="index" :label="item.label" :prop="item.key"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120" class="noboder" v-if="phaseState!=='2' && phaseState!=='4'">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index, tableListLv,'lv')" type="text" size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="createBox" @click='openDrawer("lv")' v-if="phaseState!=='2' && phaseState!=='4'"><i class='el-icon-circle-plus'></i>添加</div>
      </el-collapse-item>
    </el-collapse>
    <setlvOptions ref="addBackup" v-if="isShowLv" :operationSet="operationSet" :is-show="isShowLv" @closeDialog="closeDialog" :canvasObj="canvasObj" :isNewLv="isNewLv" @reloadList="reloadList('lv')">
    </setlvOptions>
    <setvgOptions ref="addBackup" v-if="isShowVg" :operationSet="operationSet" :is-show="isShowVg" @closeDialog="closeDialog" :canvasObj="canvasObj" :isNewLv="isNewVg" @reloadList="reloadList('vg')">
    </setvgOptions>
  </div>
</template>
<script>
import setlvOptions from "../formComponents/compontents/setlvOptions";
import setvgOptions from "../formComponents/compontents/setvgOptions";
import * as requestMethod from '@/modules/apps/api/serviceCatalog/lvpvForm.js'
import * as config from './untils/config.js';
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
    },
    isEditData: {
      type: Object
    },
  },
  data() {
    return {
      VG_plan: [],
      LV_plan: [],
      props: { multiple: true },
      ticketStepType: [
        { label: '需求收集', value: 1 },
        { label: '资源规划', value: 3 },
        { label: '资源部署', value: 5 },
      ],
      canvas_uuid: "d5c219da-baae-11ea-a9e0-acde48001122",
      labelPosition: "right",
      vgtableHeader: config.vgTable,
      lvtableHeader: config.lvTable,
      loadingLv: true,
      loadingVg: true,
      tableListVg: [],
      tableListLv: [],
      activeNames: [],
      isShowLv: false,
      isShowVg: false,
      isNewVg: false,
      isNewLv: false
    };
  },
  created() {
    this.getInitData("all");
  },
  mounted() {
    this.VG_plan = this.isEditData.VG_plan.map(String);
    this.LV_plan = this.isEditData.LV_plan.map(String);
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
    reloadList(from) {
      this.getInitData(from)
    },
    closeDialog(res, obj) {
      this.isShowVg = false;
      this.isShowLv = false;
    },
    openDrawer(val) {
      val == "vg" ? this.isShowVg = true : this.isShowLv = true;
    },
    deleteVgNode(api_vg_id) {
      let param = {
        api_vg_id: api_vg_id
      }
      requestMethod.delete_vgdata('delete', param).then(res => {
        if (res.code == 200) {
          this.getInitData('vg')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    deleteLvNode(api_lv_id) {
      let param = {
        api_lv_id: api_lv_id
      }
      requestMethod.delete_lvdata('delete', param).then(res => {
        if (res.code == 200) {
          this.getInitData('lv')
        } {
          this.$message.error(res.message)
        }
      })
    },
    deleteRow(index, rows, from) {
      if (from == 'vg') {
        this.deleteVgNode(rows[index].api_vg_id)
      } else {
        this.deleteLvNode(rows[index].api_lv_id)
      }
    },
    getInitData(from) {
      switch (from) {
        case "vg":
          this.loadingVg = true;
          break;
        case "lv":
          this.loadingLv = true;
          break;
        case "all":
          this.loadingLv = true;
          this.loadingVg = true;
          break;
      }
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        node_canvas_uuid: this.canvasObj.service_uuid,
        node_set_id: this.operationSet
      }
      requestMethod.getInitData('get', param).then(res => {
        if (res.code == 200 || res.code == 400) {
          res.data.vg_list.length ? this.isNewVg = false : this.isNewVg = true;
          res.data.lv_list.length ? this.isNewLv = false : this.isNewLv = true;
          switch (from) {
            case "vg":
              this.tableListVg = res.data.vg_list;
              this.loadingVg = false;
              break;
            case "lv":
              this.tableListLv = res.data.lv_list;
              this.loadingLv = false;
              break;
            case "all":
              this.tableListVg = res.data.vg_list;
              this.tableListLv = res.data.lv_list;
              this.loadingLv = false;
              this.loadingVg = false;
              break;
          }
          //res.code == 400 ? this.$message.warning(res.message) : ''
        } else {
          this.loadingLv = false;
          this.loadingVg = false;
          this.$message.error(res.message);
        }
      })
    }
  },
  components: { setlvOptions, setvgOptions }
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
  .formBodyC {
    font-size: 14px;
    width: 700px;
    table {
      font-size: 14px;
      color: #19223b;
      width: 100%;
      table-layout: fixed;
      border-collapse: collapse;
      border-spacing: 0;
    }

    table thead {
      background: rgba(25, 34, 59, 0.03);
      border-radius: 4px;
      height: 30px;
      line-height: 30px;
    }
    table thead tr th {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #666;
      text-align: center;
      height: 30px;
      border-right: 2px solid #fff;
      line-height: 30px;
    }
    /* table tbody tr {
          padding: 20px 0px;
          border-bottom: 1px solid rgba(216, 222, 233, 1);
        } */
    table tbody tr td {
      text-align: center;
      color: #666;
      font-size: 12px;
      padding: 10px 10px;
    }
    table tbody tr td .inputBox {
      height: 26px;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      input {
        border: 0px;
        outline: none;
        width: 130px;
      }
    }
    table tbody tr td .inputBoxYp {
      height: 32px;
      line-height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .noboder {
    border: none;
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
