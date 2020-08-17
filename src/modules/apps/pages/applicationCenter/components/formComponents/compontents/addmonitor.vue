<template>
  <el-drawer title="日志服务" :visible.sync="isVisible" :append-to-body="false" :modal-append-to-body="false" :before-close="cancelFn" size="50%" direction="rtl" custom-class="add-user-drawer"
    ref="drawer">
    <div style="width:90%;margin:0 auto;">
      <el-form ref="theform" :model="theform" :rules="rules" :label-position="labelPosition">
        <el-form-item label="主机名称" prop="ticket_obj_id" :label-width="formLabelWidth">
          <el-select placeholder="请选择主机名称" v-model="theform.ticket_obj_id" @change="selectHostname">
            <el-option v-for="list in hostNameList" :key="list.name" :label="list.name" :value="list.ticket_obj_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产IP" :label-width="formLabelWidth" class="ts-form-label ts-mt36" prop="pro_ip">
          <el-input placeholder="请输入内容" v-model="theform.pro_ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="带外IP" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.outband_ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属系统" prop="log_system" :label-width="formLabelWidth">
          <el-input placeholder="请输入内容" v-model="theform.log_system" clearable></el-input>
        </el-form-item>
        <el-table :data="theform.tableData" ref="multipleTable" :row-style="rowClass" height="450">
          <el-table-column :prop="item.key" :label="item.label" v-for="(item,index) in logList" :key="index" style="margin-top:3px;">
            <template slot="header"
              v-if="item.key=='log_version' ||item.key=='log_type'|| item.key=='log_out_type'|| item.key=='log_loop_type'|| item.key=='log_out_type'|| item.key=='log_path'|| item.key=='log_user'">
              <span class="star">*</span>
              <span class="starName">{{item.label}}</span>
            </template>
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.'+item.key" :rules='rules[item.key]'>
                <el-input v-model="scope.row[item.key]" placeholder="请输入内容"></el-input>
              </el-form-item>
              <!-- <span v-else>{{scope.row.name}}</span> -->
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button @click.native.prevent="deleteRow(scope.$index, theform.tableData)" type="text" size="small" style="margin-top:-10px;">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="createBox"><i class='el-icon-circle-plus' @click="addNew"></i>添加</div>
      </el-form>

    </div>
    <div class="drawer_footer">
      <el-button type="primary" @click="onSubmit('theform')" :loading="submitLoading">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      <el-button @click="cancelFn()">取 消</el-button>
    </div>
  </el-drawer>
</template>
<script>
import * as config from '../untils/config.js';
import * as requestMethod from '@/modules/apps/api/serviceCatalog/theLogForm.js'

export default {
  props: {
    isShow: {
      type: Boolean
    },
    canvasObj: {
      type: Object
    },
    operationSet: {
      type: Number
    }
  },
  created() { },
  data() {
    return {
      submitLoading: false,
      hostNameList: [],
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "left",
      submitLoading: false,
      logList: config.logTable,
      selected: [],
      theform: {
        tableData: [
          {
            "log_type": "",
            "log_version": "",
            "log_out_type": "",
            "log_loop_type": "",
            "log_path": "",
            "log_user": "",
            "log_formater": "",
            "log_alarm": "",
          }
        ],
      },
      rules: {
        log_system: [{ required: true, message: "请输入所属系统", trigger: "blur" }],
        ticket_obj_id: [{ required: true, message: "请选择主机名称", trigger: "blur" }],
        pro_ip: [
          { required: true, message: "请选择备份类型", trigger: "change" }
        ],
        outband_ip: [
          { required: true, message: "请选择备份对象", trigger: "change" }
        ],
        log_type: [{ required: true, message: "请输入日志类型", trigger: "change" }],
        log_version: [{ required: true, message: "请输入程序版本", trigger: "change" }],
        log_out_type: [{ required: true, message: "请输入日志输出方式", trigger: "change" }],
        log_path: [{ required: true, message: "请输入日志路径", trigger: "change" }],
        log_user: [{ required: true, message: "请输入责任人", trigger: "change" }],
        log_loop_type: [{ required: true, message: "请输入日志轮询方式", trigger: "change" }],
      },
    };
  },
  watch: {},
  created() { this.geHostList() },
  mounted() { },
  methods: {
    //获取主机列表
    geHostList() {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
      }
      requestMethod.get_ticket_log_vm_name('get', param).then(res => {
        if (res.code == 200) {
          this.hostNameList = res.data.items
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onSubmit(formName) {
      this.selected = [];
      this.$refs[formName].validate(valid => {
        if (valid) {
          var param = JSON.parse(JSON.stringify(this.theform));
          param.app_id = this.$route.query.app_id;
          param.ticket_id = this.$route.query.ticket_id;
          param.node_canvas_uuid = this.canvasObj.service_uuid;
          param.node_set_id = this.operationSet;
          param.items = param.tableData
          var { tableData, ...param } = param;
          requestMethod.post_table_data('post', param).then(res => {
            if (res.code == 200) {
              this.$emit("reloadList");
              this.$emit('closeDialog');
              this.$message.success('提交成功')
            } else if (res.code == 400) {
              this.$message.warning("数据重复")
              this.selected = res.data.index;
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false;
        }
      });
    },
    selectHostname(val) {
      console.log(val)
    },
    cancelFn() {
      this.$emit("closeDialog");
    },
    deleteRow(index, arr) {
      console.log(index);
      arr.splice(index, 1)
    },
    rowClass({ row, rowIndex }) {
      console.log(this.selected);
      if (this.selected.includes(rowIndex)) {
        return { "background-color": 'oldlace' }
      }
    },
    addNew() {
      if (this.theform.tableData.length > 10) {
        this.$message.warning("最多添加十条")
        return
      }
      this.theform.tableData.push({
        "log_type": "",
        "log_version": "",
        "log_out_type": "",
        "log_loop_type": "",
        "log_path": "",
        "log_user": "",
        "log_formater": "",
        "log_alarm": "",
      })
    }
  }
};
</script>

<style lang="less" scoped>
// 可公共form底部操作按钮
/deep/.el-input-group__append {
  background-color: none;
  color: #909399;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  border-left: 0px;
  padding: 0px 5px;
  width: 1px;
  white-space: nowrap;
}
/deep/.el-table th，/deep/.el-table tr {
  height: 38px;
}
.tab-form .el-form-item__error {
  position: relative;
  left: -20px;
  line-height: 1 !important;
}
.star {
  color: #f56c6c;
  font-size: 14px;
  margin-right: 4px;
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
/deep/.el-table .warning-row {
  background: oldlace;
}

.el-form-item--small.el-form-item {
  margin-top: 5px;
  margin-bottom: 28px;
}
.el-table tbody tr:hover > td {
  background-color: #ffffff !important;
}
</style>
