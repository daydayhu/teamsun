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
          <el-table :data="tableList">
            <el-table-column v-for="item in tableHeader" :key="item.key" :label="item.label"></el-table-column>
          </el-table>
        </div>
        <div class="createBox" @click='openDrawer'><i class='el-icon-circle-plus'></i>添加</div>
      </el-collapse-item>
    </el-collapse>
    <addBackup ref="addBackup" v-if="isShow" :is-show="isShow" @closeDialog="closeDialog"></addBackup>
  </div>
</template>
<script>
import addBackup from "../formComponents/compontents/addmonitor";
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
  },
  data() {
    return {
      tableHeader: config.tableHeader,
      tableList: [],
      activeNames: '',
      isShow: false,
    };
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    closeDialog(res, obj) {
      this.isShow = false;
    },
    openDrawer() {
      this.isShow = true
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
