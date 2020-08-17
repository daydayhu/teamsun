<template>
  <div class="formComponents" id='formComponents'>
    <ul class="thetitle" style="" v-if="serviceName!=''">
      <li style="font-weight:700">{{serviceName}}</li>
      <li>交付顺序：{{serviceIndex}}</li>
      <!-- <li style='display:none'>
        交付顺序
        <span v-if="isEdit">
          <input type="text" style="width:60px;" />
          <span @click="sureData">确认</span>
          <span @click="!isEdit">取消</span>
        </span>
        <i class="el-icon-edit" v-if="isEdit == false" @click="isEdit = true"></i>
      </li> -->
      <li style="cursor:pointer;display:none" @click="submitForm()">
        <i class="el-icon-tickets"></i>保存
      </li>
    </ul>

    <div class="componentForm">
      <div class="zwsj" v-if="formList.length==0">
        <empty-in-table></empty-in-table>
      </div>
      <el-collapse v-model="activeName" v-loading="loading" @change="changeColl" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-collapse-item v-for="(item, index) in formList" :key="index" :name="item.node_set_uuid">
          <template slot="title">
            <div class="formTit">
              {{ item.alias_name }}
              <span @click.stop="tomorePara(item.node_set_id)" class="morePara" v-if="item.form_source=='product' && (phaseState=='1' || phaseState=='3'|| phaseState=='5') && item.has_more_paras">{/}更多参数</span>
              <!-- <span class="nomorePara" v-if="item.form_source=='product' && (phaseState=='2' || phaseState=='4')">{/}更多参数</span> -->
            </div>
          </template>
          <component :isEditData="item.ticket_step_type" :is="item.form_source" :alias_name='item.alias_name' :operationSet='item.node_set_id' :canvasObj="canvasObj" :productInfo="item.tables"
            :ref="item.node_set_uuid" :phaseState='phaseState' :theIndex='index'></component>
        </el-collapse-item>
        <!-- <el-collapse-item>
          <backUp></backUp>
          <fourA></fourA>
          <userProgram></userProgram>
          <lvpvSelect></lvpvSelect>
        </el-collapse-item> -->
      </el-collapse>
    </div>
    <morePara v-if="isShow" :isShow="isShow" :nodeSetUUid="nodeSetUUid" @closeDialog="closeDialog" @seniorPara="seniorPara"></morePara>
    <el-dialog title="选择参数值" :visible.sync="isShowDiag" width="30%">
      <span>{{messDialog}}</span>
      <span>
        <el-select v-model="theCrossValue"  placeholder="请选择" @change='changCross'>
          <el-option
            v-for="item in crossSelectList"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDiag = false">取 消</el-button>
        <el-button type="primary" @click="saveForm()">确 定</el-button>
        </span>
    </el-dialog>
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
      handler(newVal,oldVal) {
        if(newVal && oldVal==null){  //初次点击图元（也相当于先点击了图元，然后点击空白接着又点击其他图元）
          this.formList = [];
          this.canvasObj = newVal;
          /* if(this.tagInfo){
            this.dialogData()
          }else{
            this.serviceChange(newVal);
          } */
          this.serviceChange(newVal);
        }
        if(newVal==null && oldVal){    //点击空白
          this.submitForm(true,true);
          this.serviceName = '';
          //this.canvasObj = newVal;
          this.formList = [];
        }
        if(newVal && oldVal){

          if(newVal.service_uuid==oldVal.service_uuid && newVal.service_name==oldVal.service_name && newVal.service_index==oldVal.service_index){  //重复点击图元
            return;
          }else if(newVal.service_uuid==oldVal.service_uuid && (newVal.service_name!=oldVal.service_name || newVal.service_index!=oldVal.service_index)){ //画布修改名称或者交付顺序
            this.serviceChange(newVal);
          }else{                     //图元的切换
            this.formList = [];
            this.canvasObj = newVal;
            this.submitForm(true,false);
          }
        }
        if(oldVal){
          this.oldCanvasObj=oldVal
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
      setKeyIdDialog:'',
      theCrossValue:'',
      crossValueInfo:null,
      crossSelectList:[],
      isShowDiag: false,
      loading: false,
      activeName: [],
      formList: [],
      isEdit: false,
      isShow: false,
      canvasObj: {},
      oldCanvasObj:{},
      phaseState: '1',
      serviceName: '', //服务名
      serviceUUID: '',
      isFlag:true,
      tagInfo:false,
      tabIndex:0,
      setIndex:0,
      paraIndex:0,
      paraIndex1:0
    };
  },
  mounted() {
    //this.dynamicForm()
    this.startBusMonitor();
  },
  methods: {

    changeColl(val){     //
      //console.log(this.$refs[val])
    },
    dialogData(){
      this.$confirm("当前表单有必填项未填，可能导致无法提交确认，是否退出当前表单?", "提示", {
              type: "warning"
          }).then(() => {
              this.serviceChange(this.canvasObj);
          }).catch(() => {
              Bus.$emit('dispatchCanvasEvent', canvasEvent.form_event_back, {});
              // this.canvasObj=this.oldCanvasObj;
              // this.serviceChange(this.canvasObj);
          });
    },
    serviceChange(val){
      this.phaseState = val.step.toString();
      this.serviceIndex=val.service_index;
      this.serviceName=val.service_name;
      this.serviceUUID =val.service_uuid;
      console.log(this.serviceUUID,'this.serviceUUID');
      this.getParasByUUID()
    },
    startBusMonitor() {
      Bus.$on('dispatchCanvasEvent', (eventName, param) => {
        if(eventName=='showMessDiag'){
          this.isShowDiag = param.isShow,
          this.messDialog = param.sj,
          this.setKeyIdDialog=param.id;
          this.tabIndex=param.tabIndex;
          this.setIndex=param.theIndex;
          this.paraIndex=param.paraIndex;
          this.paraIndex1=param.paraIndex1
          this.crossFormsMth()
        }
      })
    },
    changCross(val){
      for(var i=0;i<this.crossSelectList.length;i++){
        if(val==this.crossSelectList[i].value){
          this.crossValueInfo=this.crossSelectList[i].cross_value_info;//需要给表单参数加字端cross_value_info
          //this.theCrossValue                                         //需要给表单value赋值该值
          this.formList[this.setIndex].tables[this.tabIndex].para_infos[this.paraIndex][this.paraIndex1].value=val;
          this.formList[this.setIndex].tables[this.tabIndex].para_infos[this.paraIndex][this.paraIndex1].cross_value_info=this.crossValueInfo;
        }
      }
    },
    saveForm() {
      this.isShowDiag = false;
      var params = {
            table_id:this.formList[this.setIndex].tables[this.tabIndex].service_table_id,
            file_list:this.formList[this.setIndex].tables[this.tabIndex].file_list,
            para_infos:this.formList[this.setIndex].tables[this.tabIndex].para_infos
      };
      requestMethod.SaveSingleForm(params).then(res => {
        if (res.code != 200) {
          this.$notify.error({
            title: "失败",
            message: `${res.message}`,
            position: "bottom-right",
            duration: 3000
          });
        }
      });
    },
    crossFormsMth(){
      var params={
        app_id:this.canvasObj.app_id,
        ticket_id:this.canvasObj.ticket_id,
        node_canvas_uuid:this.canvasObj.node_canvas_uuid,
        set_key_id:this.setKeyIdDialog
      }
      requestMethod.crossForm(params).then(res => {
        if(res.code === 200){
          this.crossSelectList=res.data;
        }else{
          this.$message.error(res.message);
        }
      });
    },
    getParasByUUID(val) {
      var thedata='';
      if(val){
        thedata=val;
        this.canvasObj.service_uuid = val;
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
    dealMess(values) {
      var len = values.length;
      var num = 0;
      for (var i = 0; i < len; i++) {
        if (values[i].flag === true) {
          num++;
        } else {
          if(this.isFlag){
              this.dialogData();
          }
          this.$message.warning(`${values[i].mess}`);
          return false;
        }
      }
      if (num == len) {
        this.$message.success(`数据保存成功`);
        this.serviceChange(this.canvasObj);
        return true
      }
    },
    async submitForm(flag,isBlank) {
      this.isFlag=flag
      this.tagInfo=false;
      this.activeName = [];
      var arr = []
      for (let key in this.$refs) {
        if (this.$refs[key].length != 0) {
          var obj = this.$refs[key][0].forComponentContent();
          if (obj.flag == false) {
            //this.$message.error(`${obj.mess}`);
            if(this.isFlag && isBlank==false){
              this.dialogData();
            }
            /* if(isBlank){
              this.tagInfo=true;
              return
            } */
            this.activeName.push(key);
            return false;
          }
           /* else { //校验完保存数据（可有可无，设计的表单太多）
            var data = this.$refs[key][0].SaveOperationSet();
            arr.push(data);
          }  */
        }
      }
      //this.$message.success(`数据保存成功`);
      if(isBlank==false){
        this.serviceChange(this.canvasObj);
      }

        //return true

      /* return Promise.all(arr).then(values => {
        return this.dealMess(values)
      }) */
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
        {
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
        },
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
              "is_allow_upload": 0,
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
                  "pro_source_json": null,
                  "alias_name": "apache-QPFapache-QPF-1安装路径",
                  "form_type": "inPut",
                  "regular_type": 1,
                  "regular_text": "/^([\\/][\\w-]+)*$/",
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

        {
          "node_set_id": 273,
          "node_set_uuid": "73a24784-4136-42d1-b246-fff1d51c58d0",
          "asc_order": 0,
          "set_index": 0,
          "set_status": "新增",
          "alias_name": "openstack",
          "form_source": "openstack",
          "pro_service_id": null,
          "pro_service_set_uuid": "9f674c61-c31e-45bb-846d-840d45618189",
          "job_id": null,
          "tables": []
        },
        {
          "node_set_id": 275,
          "node_set_uuid": "bd169c67-11b6-402c-987b-f60a6e632e41",
          "asc_order": 0,
          "set_index": 0,
          "set_status": "新增",
          "alias_name": "network",
          "form_source": "network",
          "pro_service_id": null,
          "pro_service_set_uuid": "f0423ec8-938a-4e86-81d9-01041722b975",
          "job_id": null,
          "tables": []
        }
      ]

      console.log(this.formList.length, 9988);
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
