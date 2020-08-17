<template>
  <el-drawer
    :title="thetitle"
    :visible.sync="isVisible"
    :append-to-body="false"
    :modal-append-to-body="false"
    :before-close="cancelFn"
    size="35%"
    direction="rtl"
    custom-class="add-user-drawer"
    ref="drawer"
  >
    <div style="width:90%;margin:0 auto;">
      <el-form
        ref="theform"
        :model="theform"
        :rules="ruleForm"
        :label-position="labelPosition"
      >
        <el-form-item
          :label-width="formLabelWidth"
          class="ts-form-label ts-mt36"
          label="云控制器名称"
          style="position:relative;"
        >
          <el-select
            placeholder="请选择存储池"
            v-model="theform.data_store"
            @change="sourcePoolChange"
          >
            <el-option
              v-for="list in storageList"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          class="ts-form-label ts-mt36"
          label="ip"
        >
          <el-select
            placeholder="请选择存储池"
            v-model="theform.data_store"
            @change="sourcePoolChange"
          >
            <el-option
              v-for="list in storageList"
              :key="list.id"
              :label="list.name"
              :value="list.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          class="ts-form-label ts-mt36"
          label="NAT IP"
        >
          <el-select
            v-model="theform.scsi_name"
            :disabled="isSelect"
            placeholder="请选择SCSI号"
          >
            <el-option
              v-for="list in scsiArr"
              :key="list.id"
              :label="list.id"
              :disabled="list.disabled"
              :value="list.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

    </div>
    <div class="drawer_footer">
        <el-button
          type="primary"
          @click="onSubmit('theform')"
          :loading="submitLoading"
          >{{ submitLoading ? "提交中 ..." : "确 定" }}</el-button
        >
        <el-button @click="cancelFn()">取 消</el-button>
      </div>
  </el-drawer>
</template>
<script>
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/openstackApply.js'
import * as requestMethodVMWARE from '@/modules/apps/api/serviceCatalog/openstack/vmware.js'
export default {
  props: {
    isShow: {
      type: Boolean
    },
    thetitle: {
      type: String
    },
    poolid: {
      type: String
    }
  },
  created() {

  },
  mounted() {
    //this.requireListOfZYC();
  },
  data() {
    return {
      isSelect: false,
      isVisible: this.isShow,
      formLabelWidth: '100px',
      labelPosition: 'right',
      submitLoading: false,
      ruleForm: {

      },
      theform: {
        asc_order: 0,
        disk_name: '',
        data_store: '103',
        scsi_name: '',
        is_boot: false,
        disk_type: '',
        capacity_gb: '',
        description: ''
      },
      storageList: [],
      scsiArr: [],
      flag: false,
      diskList: [{
        id: 'thin',
        name: 'Thin Provision'
      }, {
        id: "eagerZeroedThick",
        name: '厚置备置零'
      }, {
        id: "preallocated",
        name: '厚置备延迟置零'
      }],
      des: ''
    }
  },
  watch: {

  },
  mounted() {
    this.sourcePoolChange()
  },
  methods: {
    sourcePoolChange() {
      requestMethodVMWARE.detailStoresPool(this.theform.data_store).then(res => {
        if (res.code === 200) {
          this.des = ``
        } else {
          //errorMessage(res.message,this)
        }
      })
    },
    onSubmit(formName) {
      if (this.flag == false) {
        this.$emit('addCloudIp', this.theform);
      }
      this.$emit('closeDialog');
    },
    cancelFn() {
      this.$emit('closeDialog');
      this.theform = {
        asc_order: 0,
        disk_name: '',
        data_store: '',
        scsi_name: '',
        is_boot: false,
        disk_type: '',
        capacity_gb: '',
        description: ''
      };
      this.editId = ''
    },

  }
}
</script>

<style lang="less" scoped>

</style>
