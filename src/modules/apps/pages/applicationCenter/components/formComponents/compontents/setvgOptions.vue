<template>
  <el-drawer title="VG" :visible.sync="isVisible" custom-class="add-user-drawer" :append-to-body="false" :modal-append-to-body="false" :before-close="cancelFn" size="35%" direction="rtl" ref="drawer"
    wrapperClosable>
    <div style="width:90%;margin:0 auto;">
      <el-form ref="theform" :model="theform" :rules="rules" :label-position="labelPosition">
        <el-form-item label="VG名称" prop="vg_name" :label-width="formLabelWidth">
          <el-input placeholder="请输入VG名称" v-model="theform.vg_name" clearable></el-input>
          <!-- <el-select v-model="theform.vg_name" @change="selectVgname" width="300px">
            <el-option v-for="(item,index) in vgList" :key="index" :label="item" :value="item">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="磁盘数量" :label-width="formLabelWidth" prop="pv_number">
          <el-input placeholder="请输入磁盘数量" v-model="theform.pv_number" clearable></el-input>
        </el-form-item>
        <el-form-item label="总容量GB" :label-width="formLabelWidth" prop="vg_size">
          <el-input placeholder="请输入总容量" v-model="theform.vg_size" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer_footer">
        <el-button type="primary" @click="onSubmit('theform')" :loading="submitLoading">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
        <el-button @click="cancelFn()">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/lvpvForm.js'
export default {
  props: {
    isShow: {
      type: Boolean
    },
    isNewVg: {
      type: Boolean
    },
    canvasObj: {
      type: Object
    },
    operationSet: {
      type: Number
    }
  },
  created() {
    this.get_vg_list();
  },
  data() {
    return {
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "right",
      submitLoading: false,
      canvas_uuid: "d5c219da-baae-11ea-a9e0-acde48001122",
      vgList: [],
      theform: {
        vg_name: "",
        vg_size: "",
        pv_number: ""
      },
      rules: {
        vg_name: [{ required: true, message: "请输入vg名称", trigger: "blur" }, { pattern: "^[a-zA-Z]+$", message: '只能输入英文' }],
        vg_size: [{ required: true, message: "请输入总容量", trigger: "blur" }, { pattern: "^[0-9]*[1-9][0-9]*$", message: '只能输入整数' }],
        pv_number: [{ required: true, message: "请输入磁盘数量", trigger: "blur" }, { pattern: "^[0-9]*[1-9][0-9]*$", message: '只能输入整数' }],
      }
    };
  },
  watch: {},
  mounted() { },
  methods: {
    selectVgname(val) {
      console.log(val)
    },
    get_vg_list() {
      let params = {
        node_canvas_uuid: this.canvasObj.service_uuid
      }
      console.log(this.canvasObj.service_uuid);
      requestMethod.get_vgname_list('get', params).then(res => {
        if (res.code == 200) {
          this.vgList = res.data.vg_list;
        }
      })
    },
    post_put_vgdata(type, params) {
      requestMethod.post_put_vgdata(type, params).then(res => {
        if (res.code == 200) {
          this.$emit('reloadList');
          this.$emit("closeDialog");
        } else {
          this.$notify.error({
            title: '错误',
            message: `${res.message}`,
            position: 'bottom-right',
            duration: 3000
          });
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            app_id: this.$route.query.app_id,
            ticket_id: this.$route.query.ticket_id,
            node_canvas_uuid: this.canvasObj.service_uuid,
            node_set_id: this.operationSet,
            "vg_name": this.theform.vg_name,
            "vg_size": this.theform.vg_size,
            "pv_number": this.theform.pv_number,
          }
          this.post_put_vgdata('post', params);
        } else {
          return false;
        }
      });
    },
    cancelFn() {
      this.$emit("closeDialog");
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
</style>
