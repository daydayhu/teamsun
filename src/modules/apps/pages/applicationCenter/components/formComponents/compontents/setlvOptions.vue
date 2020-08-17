<template>
  <el-drawer title="LV" :visible.sync="isVisible" :append-to-body="false" :modal-append-to-body="false" :before-close="cancelFn" size="35%" direction="rtl" ref="drawer" wrapperClosable>
    <div style="width:90%;margin:0 auto;">
      <el-form ref="theform" :model="theform" :rules="rules" :label-position="labelPosition">
        <el-form-item label="LV名称" :label-width="formLabelWidth" prop="lv_name">
          <el-input placeholder="请输入LV名称" v-model="theform.lv_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属VG" :label-width="formLabelWidth" prop="api_vg_id" placeholder="请选择所属VG">
          <el-select v-model="theform.api_vg_id">
            <el-option v-for="(item,index) in vgList" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容量(GB)" :label-width="formLabelWidth" class="ts-form-label ts-mt36" prop="lv_size">
          <el-input placeholder="请输入容量" v-model="theform.lv_size" clearable></el-input>
        </el-form-item>
        <el-form-item label="条带数" :label-width="formLabelWidth" prop="stripe_size">
          <el-input placeholder="请输入条带数" v-model="theform.stripe_size" clearable></el-input>
        </el-form-item>
        <el-form-item label="文件系统" :label-width="formLabelWidth" prop="file_system">
          <el-select v-model="theform.file_system" @change="selectIsgroup" filterable allow-create default-first-option placeholder="请选择文件系统">
            <el-option v-for="(item,index) in fileSystem" :key="index" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="挂接点" :label-width="formLabelWidth" prop="mount_point">
          <el-input placeholder="请输入挂接点" v-model="theform.mount_point" clearable></el-input>
        </el-form-item>
        <el-form-item label="挂接属主:属组" :label-width="formLabelWidth" prop="mount_user">
          <el-input placeholder="请输入挂接属主/属组" v-model="theform.mount_user" clearable></el-input>
        </el-form-item>
        <el-form-item label="挂接权限" :label-width="formLabelWidth" prop="mount_auth">
          <el-input placeholder="请输入挂接权限" v-model="theform.mount_auth" clearable></el-input>
        </el-form-item>
        <el-form-item label="最后分配组是否使用VG剩余容量" :label-width="formLabelWidth" prop="is_last">
          <el-select v-model="theform.is_last" @change="selectIsgroup">
            <el-option v-for="(item,index) in isGroup" :key="index" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer_footer">
      <el-button type="primary" @click="onSubmit('theform')" :loading="submitLoading">{{ submitLoading ? '提交中 ...' : '确 定' }}</el-button>
      <el-button @click="cancelFn()">取 消</el-button>
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
    canvasObj: {
      type: Object
    },
    operationSet: {
      type: Number
    }
  },
  data() {
    return {
      isGroup: [{ name: "是", key: 1 }, { name: "否", key: 0 }],
      fileSystem: [{ name: 'xfs' }, { name: 'ext4' }],
      rules: {
        lv_name: [{ required: true, message: "请输入LV名称", trigger: "blur" }, { pattern: "^[a-zA-Z]+$", message: '只能输入英文' }],
        api_vg_id: [
          { required: true, message: "请选择所属vg", trigger: "blur" }
        ],
        lv_size: [
          { required: true, message: "清输入容量", trigger: "blur" }, { pattern: "^[0-9]*[1-9][0-9]*$", message: '只能输入正整数' }
        ],
        file_system: [{ required: true, message: "请选择文件系统", trigger: "change" }, , { pattern: "^[A-Za-z0-9]+$", message: '只能输入英文加数字' }],
        stripe_size: [{ required: true, message: "请输入条带数", trigger: "change" }, { pattern: "^[0-9]*[1-9][0-9]*$", message: '只能输入正整数' }],
        mount_point: [{ required: true, message: "请输入挂节点", trigger: "blur" }],
        mount_user: [{ required: true, message: "请输入连接属主/属组", trigger: "blur" }],
        mount_auth: [{ required: true, message: "请输入挂接权限", trigger: "blur" }, { pattern: "^[0-9]*[1-9][0-9]*$", message: '只能输入正整数' }],
        is_last: [{ required: true, message: "请选择最后分配组", trigger: "blur" }],
      },
      canvas_uuid: "d5c219da-baae-11ea-a9e0-acde48001122",
      user_group: [],
      isVisible: this.isShow,
      formLabelWidth: "130px",
      labelPosition: "right",
      submitLoading: false,
      theform: {

      },
      vgList: [],
    };
  },
  watch: {
    'theform.file_system': {
      handler(newName, oldName) {
        console.log(newName + oldName)
      },
      deep: true
    }
  },
  created() { this.get_vg_list(); this.get_user_group() },
  watch: {},
  mounted() { },
  methods: {
    post_put_lvdata(type, params) {
      requestMethod.post_put_lvdata(type, params).then(res => {
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
    selectVgname(val) {
      console.log(val)
    },
    selectIsgroup(val) {
      console.log(val)
    },
    selectIsBelong(val) {
      console.log(val)
    },
    get_vg_list() {
      let params = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        node_canvas_uuid: this.canvasObj.service_uuid,
        node_set_id: this.operationSet,
      }
      console.log(this.canvasObj.service_uuid);
      requestMethod.get_vgname_list('get', params).then(res => {
        if (res.code == 200) {
          this.vgList = res.data.vg_list;
        }
      })
    },
    get_user_group() {
      let params = {
        node_canvas_uuid: this.canvasObj.service_uuid
      }
      requestMethod.get_user_usergroup('get', params).then(res => {
        if (res.code == 200) {
          this.user_group = res.data.usergroup_list;
        }
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let jsonData = {
            app_id: this.$route.query.app_id,
            ticket_id: this.$route.query.ticket_id,
            node_canvas_uuid: this.canvasObj.service_uuid,
            node_set_id: this.operationSet,
          }
          let params = Object.assign(jsonData, this.theform);
          params.stripe_size = Number(params.stripe_size);
          params.mount_auth = Number(params.mount_auth);
          params.lv_size = Number(params.lv_size);
          console.log(params);
          this.post_put_lvdata('post', params);
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
