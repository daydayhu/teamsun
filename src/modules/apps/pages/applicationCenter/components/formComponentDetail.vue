<template>
  <div class="formComponents" id='formComponents'>
    <ul class="thetitle" style="" v-if="serviceName!=''">
      <li style="font-weight:700">{{serviceName}}</li>
      <li>交付顺序：{{serviceIndex}}</li>
    </ul>
    <div class="componentForm">
      <div class="zwsj" v-if="formList.length==0">
        <empty-in-table></empty-in-table>
      </div>
      <el-collapse v-model="activeName" v-loading="loading"  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-collapse-item v-for="(item, index) in formList" :key="index" :name="item.node_set_uuid">
          <template slot="title">
            <div class="formTit">
              {{ item.alias_name }}
              <span @click.stop="tomorePara(item.node_set_id)" class="morePara" v-if="item.form_source=='product' && (phaseState=='1' || phaseState=='3'|| phaseState=='5') && item.has_more_paras">{/}更多参数</span>
            </div>
          </template>
          <component :isEditData="item.ticket_step_type" :is="item.form_source" :alias_name='item.alias_name' :operationSet='item.node_set_id' :canvasObj="canvasObj" :productInfo="item.tables"
            :ref="item.node_set_uuid" :phaseState='phaseState'></component>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- <morePara v-if="isShow" :isShow="isShow" :nodeSetUUid="nodeSetUUid" @closeDialog="closeDialog" @seniorPara="seniorPara"></morePara> -->
  </div>
</template>
<script>
//内置表单的名称 vmware,resize,disk,openstack,network，
import vmware from "./formComponents/vmware.vue";
import product from "./formComponents/product.vue";
import openstack from "./formComponents/quickApplyOpenstack.vue";
import network from "./formComponents/internetForm.vue";
import networkPolicy from "./formComponents/networkPolicy.vue";
import backUp from "./formComponents/theBackup"
import fourA from "./formComponents/fourA"
import userGroup from "./formComponents/userProgram"
import morePara from "./formComponents/compontents/morePara"
import theLog from "./formComponents/theLog.vue"
import theMonitoring from "./formComponents/theMonitoring.vue"
import theVgLv from "./formComponents/theVgLv.vue"
import * as requestMethod from '@/modules/apps/api/serviceCatalog/openstack/actionSet.js'
import { Bus, canvasEvent } from '@/modules/apps/bus/form.bus.js';
import networkPolicyVue from './formComponents/networkPolicy.vue';
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
import vmwareResize from "./formComponents/vmwareResize"
import vmwareAttach from "./formComponents/vmwareAttach"
export default {
  name: "componentSet",
  props: {
    formComponentInfo: {
      type: Object
    }
  },
  watch: {
    formComponentInfo: {
      handler(newVal) {
        this.formList = [];
        if (newVal) {
          this.canvasObj = newVal;
          this.phaseState = '4';
          this.serviceIndex=newVal.service_index;
          this.serviceName=newVal.service_name
          this.serviceUUID = newVal.service_uuid;
          this.serviceChange(newVal);
        } else {
          this.serviceName = ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      serviceIndex:null,
      messDialog: '',
      isShowDiag: false,
      thetop: 0,
      theleft: 0,
      loading: false,
      activeName: [],
      formList: [],
      isEdit: false,
      isShow: false,
      canvasObj: {},
      phaseState: '1',
      serviceName: '', //服务名
      serviceUUID: '',
    };
  },
  mounted() {
    //this.dynamicForm()
    this.startBusMonitor();
  },
  methods: {
    serviceChange(val){
      this.phaseState = '4';
      this.serviceIndex=val.service_index;
      this.serviceName=val.service_name
      this.serviceUUID =val.service_uuid;
      this.getParasByUUID()
    },
    startBusMonitor() {
      Bus.$on('dispatchCanvasEvent', (eventName, param) => {
        this.isShowDiag = param.isShow,
          this.thetop = param.top,
          this.theleft = param.left
        this.messDialog = param.sj
      })
    },
    getParasByUUID(val) {
      var thedata='';
      if(val){
        thedata=val
      }else{
        thedata=this.serviceUUID
      }
      this.loading = true;
      requestMethod.requireParasByUUID({ node_canvas_uuid: thedata }).then(res => {
        this.loading = false;
        if (res.code === 200) {
          this.formList = res.data;
        } else {
          this.$message.warning(`${res.message}`)
        }
      });
    },
    seniorPara(val) {
      this.isShow = false;
      var obj = {
        node_set_id: this.nodeSetUUid,
        table: val
      }
      requestMethod.SaveMoreParas(obj).then(res => {
        if (res.code == 200) {
          this.$notify.success({
            title: '成功',
            message: `${res.message}`,
            position: 'bottom-right',
            duration: 3000
          });
        } else {
          this.$notify.error({
            title: '失败',
            message: `${res.message}`,
            position: 'bottom-right',
            duration: 3000
          });
        }
        this.getParasByUUID()
      })
    },
    closeDialog(res, obj) {
      this.isShow = false
    },
    tomorePara(val) {
      this.isShow = true;
      this.nodeSetUUid = val
    },
    dynamicForm() {
      //   阶段phaseState：  需求收集1、需求收集审批2、资源规划3
      //   参数类型paraType：   缺省显示参数1、不可见参数2、更多参数3
      //   isEdit            自定义表字段那个阶段可以被编辑
      var stepSet = {
        collect: '1', // 需求收集             基本信息（填写）
        collect_approval: '2', // 需求收集审批 基本信息（不编辑）
        plan: '3', // 资源规划                基本信息（不编辑）+虚拟机以及IP配值信息（填写）+部署目标（填写）
        plan_approval: '4', // 资源规划审批    基本信息+虚拟机以及IP配值信息+部署目标（不编辑）
        deploy: '5' // 资源部署               对所有表单都可以修改
      }
      this.phaseState = '5';
      this.formList1 = [{
        node_set_id: 269,
        node_set_uuid: "ed242d27-2b3f-405f-b4c2-924678e4af16",
        asc_order: 0,
        set_index: 0,
        set_status: "新增",
        alias_name: "VMware虚拟机安装",
        form_source: "vmware",
        pro_service_id: null,
        pro_service_set_uuid: "308817c1-a259-403f-a500-3bad2b264bfa",
        job_id: null,
        tables: [],
      }]
      this.formList = [
       /*  {
          node_set_id: 269,
          node_set_uuid: "ed242d27-2b3f-405f-b4c2-924678e4af16",
          asc_order: 0,
          set_index: 0,
          set_status: "新增",
          alias_name: "VMware虚拟机安装",
          form_source: "vmware",
          pro_service_id: null,
          pro_service_set_uuid: "308817c1-a259-403f-a500-3bad2b264bfa",
          job_id: null,
          tables: []
        }, */
        {
          "node_set_id": 2701,
          "node_set_uuid": "1a2c04ae7-0ea0-4bf4-b607-6a71dd4d2b75",
          "asc_order": 0,
          "set_index": 0,
          "set_status": "新增",
          "alias_name": "XXXX",
          "form_source": "product",
          "pro_service_id": null,
          "pro_service_set_uuid": "10f862ce-4aeb-45b7-93cb-58293176accc",
          "job_id": null,
          "tables": [
            {
              "service_table_id": 116,
              "table_name": "安装配置",
              "table_uuid": "4344d11174b-51c4-45f4-b1c8-aa103d24ed49",
              "asc_order": 0,
              "is_allow_upload": 1,
              "is_column": 1,
              is_multi_line: 1,
              "is_excel_load": 0,
              "pro_service_table_id": null,
              "pro_service_table_uuid": null,
              "para_infos": [
                [{
                  "set_key_id": 246,
                  "pro_para_key": "apache_install_path",
                  "pro_para_name": "apache-QPFapache-QPF-1安装路径",
                  "pro_default_value": "/usr/local/apache2",
                  "pro_para_unit": null,
                  "pro_source_json": ['form'],
                  "alias_name": "apache-QPFapache-QPF-1安装路径",
                  "form_type": "dropDown",
                  "regular_type": 1,
                  "regular_text": "/^([\\/][\\w-]+)*$/",
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": 'form_name',
                  "source_type": 2,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 247,
                  "pro_para_key": "httpd_port",
                  "pro_para_name": "apache-QPFapache-QPF-1httpd端口",
                  "pro_default_value": "80",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1httpd端口",
                  "form_type": "checkBox",
                  "regular_type": 1,
                  "regular_text": "/^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$/",
                  "pro_source_json": ['product'],
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": 'alias_name',
                  "source_type": 2,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 248,
                  "pro_para_key": "test",
                  "pro_para_name": "自定义参数",
                  "pro_default_value": "test",
                  "pro_para_unit": "MB",
                  "alias_name": null,
                  "form_type": "raDio",
                  "regular_type": 1,
                  "regular_text": "",
                  "pro_source_json": ['component'],
                  "is_required": 0,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": 'remarks',
                  "source_type": 2,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                }, {
                  "set_key_id": 2481,
                  "pro_para_key": "test",
                  "pro_para_name": "下拉",
                  "pro_default_value": "11",
                  "pro_para_unit": "MB",
                  "alias_name": null,
                  "form_type": "richText",
                  "regular_type": 1,
                  "regular_text": "",
                  "pro_source_json": ['oc'],
                  "is_required": 0,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                }]
              ]
            }
          ]
        },
        {
          "node_set_id": 270,
          "node_set_uuid": "a2c04ae7-0ea0-4bf4-b607-6a71dd4d2b75",
          "asc_order": 0,
          "set_index": 0,
          "set_status": "新增",
          "alias_name": "Apache安装",
          "form_source": "product",
          "pro_service_id": null,
          "pro_service_set_uuid": "10f862ce-4aeb-45b7-93cb-58293176accc",
          "job_id": null,
          "tables": [
            {
              "service_table_id": 116,
              "table_name": "apache安装配置",
              "table_uuid": "4344d74b-51c4-45f4-b1c8-aa103d24ed49",
              "asc_order": 0,
              "is_allow_upload": 0,
              "is_column": 0,
              "is_excel_load": 1,
              is_multi_line: 1,
              "pro_service_table_id": null,
              "pro_service_table_uuid": null,
              "para_infos": [
                [{
                  "set_key_id": 246,
                  "pro_para_key": "apache_install_path",
                  "pro_para_name": "apache-QPFapache-QPF-1安装路径",
                  "pro_default_value": "/usr/local/apache2",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1安装路径",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([\\/][\\w-]+)*$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 247,
                  "pro_para_key": "httpd_port",
                  "pro_para_name": "apache-QPFapache-QPF-1httpd端口",
                  "pro_default_value": "80",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1httpd端口",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 248,
                  "pro_para_key": "test",
                  "pro_para_name": "自定义参数",
                  "pro_default_value": "test",
                  "pro_para_unit": "MB",
                  "alias_name": null,
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "",
                  "pro_source_json": 1,
                  "is_required": 0,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                }, {
                  "set_key_id": 2481,
                  "pro_para_key": "test",
                  "pro_para_name": "下拉",
                  "pro_default_value": "11",
                  "pro_para_unit": "MB",
                  "alias_name": null,
                  "form_type": "dropDown",
                  "regular_type": 1,
                  "regular_text": "",
                  "pro_source_json": ['11', '22'],
                  "is_required": 0,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                }]
              ]
            },
            {

              "service_table_id": 117,
              "table_name": "1111",
              "table_uuid": "9251cda8-2020-45e2-937c-466add255506",
              "asc_order": 0,
              "is_allow_upload": 0,
              "is_column": 1,
              "is_excel_load": 1,
              "pro_service_table_id": null,
              "pro_service_table_uuid": null,
              "para_infos": [
                [{
                  "set_key_id": 249,
                  "pro_para_key": "apache_install_path",
                  "pro_para_name": "apache-QPFapache-QPF-1安装路径",
                  "pro_default_value": "/usr/local/apache2",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1安装路径",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([\\/][\\w-]+)*$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 250,
                  "pro_para_key": "httpd_port",
                  "pro_para_name": "apache-QPFapache-QPF-1httpd端口",
                  "pro_default_value": "80",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1httpd端口",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 251,
                  "pro_para_key": "test",
                  "pro_para_name": "自定义参数",
                  "pro_default_value": "test",
                  "pro_para_unit": "MB",
                  "alias_name": null,
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "",
                  "pro_source_json": 1,
                  "is_required": 0,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "1,3,5",
                  "pro_service_key_id": null
                }]
              ]
            }
          ]
        },
        {
          "node_set_id": 271,
          "node_set_uuid": "9eb813d7-ce19-4fef-afeb-4c57647d2953",
          "asc_order": 0,
          "set_index": 0,
          "set_status": "新增",
          "alias_name": "test",
          "form_source": "product",
          "pro_service_id": null,
          "pro_service_set_uuid": "32354737-8bb7-4d3e-a610-bebd67b79562",
          "job_id": null,
          "tables": [
            {
              "service_table_id": 118,
              "table_name": "t1",
              "table_uuid": "edfa78ec-fd35-44cb-bdac-efc42063801c",
              "asc_order": 0,
              "is_allow_upload": 0,
              "is_column": 1,
              "is_excel_load": 1,
              "pro_service_table_id": null,
              "pro_service_table_uuid": null,
              "para_infos": [
                [{
                  "set_key_id": 252,
                  "pro_para_key": "apache_install_path",
                  "pro_para_name": "apache-QPFapache-QPF-1安装路径",
                  "pro_default_value": "/usr/local/apache2",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1安装路径",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([\\/][\\w-]+)*$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "0",
                  "pro_service_key_id": null
                },
                {
                  "set_key_id": 253,
                  "pro_para_key": "httpd_port",
                  "pro_para_name": "apache-QPFapache-QPF-1httpd端口",
                  "pro_default_value": "80",
                  "pro_para_unit": null,
                  "alias_name": "apache-QPFapache-QPF-1httpd端口",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([0-9]|[1-9]\\d{1,3}|[1-5]\\d{4}|6[0-4]\\d{3}|65[0-4]\\d{2}|655[0-2]\\d|6553[0-5])$/",
                  "pro_source_json": null,
                  "is_required": 1,
                  "is_ref": 1,
                  "asc_order": 0,
                  "remarks": null,
                  "value": null,
                  "source_type": 0,
                  "ref_key_uuid": null,
                  "ticket_step_type": "0",
                  "pro_service_key_id": null
                }]
              ]
            }
          ]
        },
      ]
    },
    sureData() {
      this.isEdit = false;
    }
  },
  components: {
    vmware,
    product,
    openstack,
    networkPolicy,
    network,
    morePara,
    theLog,
    theMonitoring,
    theVgLv,
    backUp, fourA, userGroup,EmptyInTable,
    vmwareResize,vmwareAttach
  }
};
</script>

<style lang="less" scoped>
.formComponents {
  /deep/.el-collapse-item__content{
    padding-bottom: 0px;
  }
  height: 100%;
  position: relative;
  .componentForm {
    .zwsj {
      position: absolute;
      left: 50%;
      margin-left: -80px;
      top: 50%;
      margin-top: -60px;
      .tit {
        color: #666;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
    }
    overflow-x: hidden;
    overflow-y: auto;
    height: calc(100% - 36px);
    width: 100%;
    position: relative;
    padding: 10px;
    /deep/ .el-collapse-item__arrow {
      position: absolute;
      left: 45px;
    }
    /deep/ .el-collapse-item {
      border: 1px solid #e7edf3;
      border-radius: 5px;
      margin-bottom: 5px;
    }
    /deep/ .el-collapse {
      border: 0px;
    }
    /deep/ .el-collapse-item__wrap {
      border: 0px;
    }
    /deep/ .el-collapse-item__header {
      background: rgba(48, 107, 255, 0.03);
    }
    .formTit {
      padding-left: 60px;
      padding-right: 20px;
      font-size: 14px;
      width: 100%;
      .morePara {
        float: right;
        margin-right: 20px;
        color: #306bff;
        cursor: pointer;
      }
      .nomorePara {
        float: right;
        color: #306bff;
        margin-right: 20px;
        cursor: default;
      }
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
  }
  .thetitle {
    height: 36px;
    border-bottom: 1px solid #e7edf3;
    line-height: 36px;
    li {
      padding: 0 5px 0 20px;
      float: left;
      i {
        color: #306bff;
        font-size: 16px;
        cursor: pointer;
      }
      span {
        color: #306bff;
        cursor: pointer;
      }
    }
  }
}
</style>
