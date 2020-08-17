<template>
    <div class="layout-c" ref="layout-c">
        <div class="header">
            <div class="name-c">
                <span class="name" v-if="serviceNameStatus === 'off'">{{serviceInfo.name}}</span>
                <el-button type="text" v-if="serviceNameStatus === 'off'" @click="serviceNameStatus='on'">
                    <svg-icon icon-class='edit_icon' class="edit_icon"></svg-icon>
                </el-button>
                <div class="input-c" v-if="serviceNameStatus === 'on'">
                    <el-input v-model="saveServiceName" type="text" maxlength="32"></el-input>
                    <el-button type="text" @click="saveNodeName">保存</el-button>
                    <el-button type="text" @click="cancelName">取消</el-button>
                </div>
            </div>
        </div>
        <div class="deliver-order-c">
            <span class="name">交付顺序：</span>
            <span class="order-val" v-if="deliverOrderStatus === 'off'">{{serviceInfo.order}}</span>
            <el-button type="text" v-if="deliverOrderStatus === 'off'" @click="deliverOrderStatus='on'">
                <svg-icon icon-class='edit_icon' class="edit_icon"></svg-icon>
            </el-button>
            <div class="input-c" v-if="deliverOrderStatus === 'on'">
                <el-input v-model="saveOrderVal" type="number"></el-input>
                <el-button type="text" @click="saveNodeDeliverOrder">保存</el-button>
                <el-button type="text" @click="cancelDeliverOrder">取消</el-button>
            </div>
        </div>
        <div class="create-method-c" v-if="serviceInfo.operation !== 'edit'">
            <label>创建模式：</label>
            <el-radio-group v-model="createMethod" @change="handleMethodChange">
                <el-radio :label=0>新建</el-radio>
                <el-radio :label=1>复制并创建</el-radio>
                <el-radio :label=2 v-if="changeRadioIsShow">变更</el-radio>
            </el-radio-group>
        </div>
        <div class="operation-c" v-show="createMethod === createMethodSet.new">
            <div class="unit-c" v-if="serviceInfo.proType === proTypeSet.main && serviceInfo.operation !== 'edit'">
                <label>部署单元</label>
                <div class="select-c" v-if="addDeployStatus === 'off'">
                    <el-select v-model="selectDeployUnit"
                               clearable
                               placeholder="请选择部署单元">
                        <el-option :label="item.name" :value="item.deployment_unit_id"
                                   v-for="(item, index) in deployUnitList" :key="index"></el-option>
                    </el-select>
                    <div class="add-btn-c" @click="addDeployStatus = 'on'">
                        <!--<el-button type="text">-->
                            <!--<svg-icon icon-class="add"></svg-icon>-->
                        <!--</el-button>-->
                        <el-button type="text">新建</el-button>
                    </div>
                </div>
                <div class="add-c" v-else>
                    <el-input v-model="addDeployUnitValue" type="text" maxlength="32"></el-input>
                    <el-button type="text" @click="addDeployUnitFun">保存</el-button>
                    <el-button type="text" @click="cancelDeployUnitFun">取消</el-button>
                </div>
            </div>
            <div class="operation-line-c">
                <span class="line"></span>
                <span class="title">操作</span>
                <span class="line"></span>
            </div>
            <el-checkbox-group v-model="checkOperationIds">
                <el-checkbox v-for="(item,index) in operationList" :label="item.service_set_id" :key="index"
                             v-show="createTimingAllow[item.show_time_type]" @change="changeSelectedOperation">
                    {{item.service_set_name}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="copy-apps-c" v-show="createMethod === createMethodSet.copy">
            <el-form
                    :model="copyAppInfo"
                    :rules="serviceRules"
                    :label-position="labelPosition"
                    :label-width="formLabelWidth"
                    v-if="serviceInfo.operation !== 'edit'"
                    ref="serviceForm">
                <el-form-item label="应用系统" prop="app_uuid">
                    <el-select v-model="copyAppInfo.app_uuid" placeholder="请选择应用系统" @change="handleAppsChange">
                        <el-option :label="item.app_name" :value="item.app_uuid" v-for="(item, index) in appsList"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="proTypeMapLabel[serviceInfo.proType]" prop="service_uuid">
                    <el-select v-model="copyAppInfo.service_uuid"
                               :placeholder="`请选择${proTypeMapLabel[serviceInfo.proType]}`"
                               @change="handleBaseServiceChange">
                        <el-option :label="item.alias_name" :value="item.canvas_uuid"
                                   v-for="(item, index) in baseServiceList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="附加服务" prop="service_children_ids" v-if="serviceInfo.proType === proTypeSet.main">
                    <el-select v-model="copyAppInfo.service_children_ids" multiple placeholder="请选择附加服务"
                               @change="handleAffiliateChange">
                        <el-option :label="item.alias_name" :value="item.canvas_uuid"
                                   v-for="(item, index) in affiliateServiceList" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部署单元" v-if="serviceInfo.proType === proTypeSet.main">
                    <div class="unit-c">
                        <div class="select-c" v-if="addDeployStatus === 'off'">
                            <el-select v-model="selectDeployUnit"
                                       clearable
                                       placeholder="请选择部署单元">
                                <el-option :label="item.name" :value="item.deployment_unit_id"
                                           v-for="(item, index) in deployUnitList" :key="index"></el-option>
                            </el-select>
                            <div class="add-btn-c" @click="addDeployStatus = 'on'">
                                <!--<el-button type="text">-->
                                    <!--<svg-icon icon-class="add"></svg-icon>-->
                                <!--</el-button>-->
                                <el-button type="text">新建</el-button>
                            </div>
                        </div>
                        <div class="add-c" v-else>
                            <el-input v-model="addDeployUnitValue" type="text" maxlength="32"></el-input>
                            <el-button type="text" @click="addDeployUnitFun">保存</el-button>
                            <el-button type="text" @click="cancelDeployUnitFun">取消</el-button>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div class="operation-line-c" v-if="serviceInfo.operation === 'edit'">
                <span class="line"></span>
                <span class="title">操作</span>
                <span class="line"></span>
            </div>
            <el-checkbox-group v-model="checkOperationIds" v-if="serviceInfo.operation === 'edit'">
                <el-checkbox v-for="(item,index) in operationList" :label="item.service_set_id" :key="index"
                             v-show="createTimingAllow[item.show_time_type]" @change="changeSelectedOperation">
                    {{item.service_set_name}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="change-c" v-show="createMethod === createMethodSet.change">
            <ul class="cellList" v-if="serviceInfo.operation !== 'edit'">
                <li v-for="(cell,index) in cellList" :key="index">
                    <div class="left-c">
                        <div class="cloud-c">
                            <label>云主机</label>
                            <el-select v-model="cell.vmware_id"
                                       placeholder="请选择云主机"
                                       @change="handleCloudChange($event, cell)"
                                       @visible-change="getCanSelectCloudList($event, cell)"
                            >
                                <el-option v-for="(item, index) in cloudList"
                                           :label="item.cloud_name"
                                           :value="item.vmware_id"
                                           :disabled="!canSelectCloudList.includes(item.vmware_id)"
                                           :key="index"></el-option>
                            </el-select>
                            <div class="error-hint" v-show="!cell.vmware_id && cellError">请选择云主机</div>
                        </div>
                        <div class="unit-c" v-if="serviceInfo.proType === proTypeSet.main">
                            <label>部署单元</label>
                            <div class="select-c" v-if="cell.addDeployStatus === 'off'">
                                <el-select v-model="cell.deployment_unit_id"
                                           clearable
                                           placeholder="请选择部署单元">
                                    <el-option :label="item.name" :value="item.deployment_unit_id"
                                               v-for="(item, index) in deployUnitList" :key="index"></el-option>
                                </el-select>
                                <div class="add-btn-c" @click="cell.addDeployStatus = 'on'">
                                    <!--<el-button type="text">-->
                                        <!--<svg-icon icon-class="add"></svg-icon>-->
                                    <!--</el-button>-->
                                    <el-button type="text">新建</el-button>
                                </div>
                            </div>
                            <div class="add-c" v-else>
                                <el-input v-model="cell.addDeployUnitValue" type="text" maxlength="32"></el-input>
                                <el-button type="text" @click="addDeployUnitFun($event, cell)">保存</el-button>
                                <el-button type="text" @click="cancelDeployUnitFun($event, cell)">取消</el-button>
                            </div>
                        </div>
                    </div>
                    <div class="right-c">
                        <div class="add-cell" v-if="index === cellList.length - 1 && index < cloudList.length - 1">
                            <el-button type="text" @click="addCell">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                        </div>
                        <div class="delete-cell" v-if="index || cellList.length > 1">
                            <el-button type="text" @click="deleteCell(index)">
                                <svg-icon icon-class="reduce"></svg-icon>
                            </el-button>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="operation-line-c">
                <span class="line"></span>
                <span class="title">操作</span>
                <span class="line"></span>
            </div>
            <el-checkbox-group v-model="checkOperationIds">
                <el-checkbox v-for="(item,index) in operationList" :label="item.service_set_id" :key="index"
                             v-show="changeTimingAllow[item.show_time_type]" @change="changeSelectedOperation">
                    {{item.service_set_name}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <div class="footer-c">
            <el-button @click="close">取 消</el-button>
            <el-button type="primary" @click="confirm">确认</el-button>
        </div>
    </div>
</template>

<script>
  import * as requestMethod from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';
  export default {
    name: 'operationDialog',
    props: {
      operationList: {
        type: Array,
        deep: true,
      },
      originServiceInfo: {
        type: Object,
        deep: true,
      },
      orderInfo: {
        type: Object,
        deep: true,
      }
    },
    data() {
      return {
        serviceInfo: {
          operation: '',
          proType: '',
          name: '--',
          order: '--',
          create_operation_method: ''
        },
        proTypeMapLabel: {
          1: '主机服务',
          2: '附加服务',
          3: '网络服务',
          4: '集成服务',
        },
        proTypeSet: {
          main: 1, // 计算服务
          affiliate: 2, // 附加服务
          network: 3, // 网络服务
          integrate: 4, // 集成服务
          mix: 5 // 混合
        },
        createMethod: 0, // 0 新建  1 复制并创建  2 变更
        createMethodSet: {
          new: 0,
          copy: 1,
          change: 2
        },
        orderType: {
          create: 1, // 新建订单
          change: 2 // 变更订单
        },
        deployUnitList: [], // 部署单元list
        addDeployStatus: 'off', // off、on
        addDeployUnitValue: '', // 需要添加的部署单元
        selectDeployUnit: '', // 选中的部署单元
        cellList: [
          {
            vmware_id: '',
            deployment_unit_id: '',
            addDeployUnitValue: '',
            addDeployStatus: 'off'
          }
        ],
        cellError: false,
        cloudList: [ // 云主机list
          // {
          //   vmware_id: 1,
          //   cloud_name: "云主机1",
          //   uuid: "312-321321-aee312321-312",
          //   deployment_unit_id: 1
          // }
        ],
        canSelectCloudList: [],

        serviceNameStatus: 'off', // off、on
        saveServiceName: '',
        deliverOrderStatus: 'off',
        saveOrderVal: '',
        timingSet: {
          1: '任意时间',
          2: '首次申请',
          3: '非首次申请',
        },

        // 创建订单所允许展示操作集的显示时间配置
        createTimingAllow: {
          1: true,
          2: true,
          3: false,
        },

        // 变更订单所允许展示操作集的显示时间配置
        changeTimingAllow: {
          1: true,
          2: false,
          3: true,
        },

        newOperationList: [],
        checkOperationIds: [],
        labelPosition: 'right',
        formLabelWidth: '70px',
        copyAppInfo: {
          app_uuid: '',
          service_uuid: '',
          service_children_ids: [], // 产品类型为主产品时，有附加产品id
        },
        serviceRules: {
          app_uuid: {required: true, message: '请选择应用系统', trigger: 'change'},
          service_uuid: {required: true, message: '请选择基础服务', trigger: 'change'},
          // service_children_ids: {required: true, message: '请选择附加服务', trigger: 'change'},
        },
        appsList: [
          // {
          //   app_id: 1,
          //   app_uuid: '321-312213-31321',
          //   app_name: '应用系统1',
          //   bus_name: '',
          //   bus_id: '',
          //   app_base_type: '',
          //   app_base_env: '',
          //   org_name: ''
          // },
          // {
          //   app_id: 2,
          //   app_uuid: '003190-3123-391212',
          //   app_name: '应用系统1',
          //   bus_name: '',
          //   bus_id: '',
          //   app_base_type: '',
          //   app_base_env: '',
          //   org_name: ''
          // }
        ],
        baseServiceList: [
          // {
          //   node_uuid: '31093-313138-31323',
          //   canvas_uuid: 'c-3132-321312aseqwe-ew',
          //   pro_service_id: 19,
          //   pro_type: 1,
          //   node_name: '基础服务1',
          //   alias_name: ''
          // },
          // {
          //   node_uuid: '312-31321-313213',
          //   canvas_uuid: 'c-ccasd-323-dasdasas',
          //   pro_service_id: 20,
          //   pro_type: 2,
          //   node_name: '基础服务2',
          //   alias_name: ''
          // }
        ],
        currentBaseService: null,
        affiliateServiceList: [
          // {
          //   node_uuid: '312-31321-3132-we',
          //   canvas_uuid: 'c-eqwe21e-dasd-112',
          //   pro_service_id: 1,
          //   pro_type: 2,
          //   node_name: '附加服务1',
          //   alias_name: '',
          //   image_url: ''
          // },
          // {
          //   node_uuid: 'eyqiu-313-3213312-2',
          //   canvas_uuid: 'c-dsak-kk31312-3132',
          //   pro_service_id: 2,
          //   pro_type: 2,
          //   node_name: '附加服务2',
          //   alias_name: '',
          //   image_url: ''
          // }
        ],
        currentAffiliateServiceList: [],

        // 产品类型映射创建订单下，变更按钮展示函数
        proTypeMapCreateFun: { // TODO: 考虑到后续条件可能变化，目前每个类型条件完全独立
          1: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          2: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          3: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          4: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
        },

        // 产品类型映射变更订单下，变更按钮展示函数
        proTypeMapChangeFun: {
          1: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          2: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          3: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
          4: ()=>{
            let isShow;
            let sureOperation = this.operationList.find(item => this.changeTimingAllow[item.show_time_type]);
            isShow = !!sureOperation;
            return isShow
          },
        },
      };
    },
    created() {
      this.getAppsList();
      this.resetServiceInfo();
      this.getDeployUnitList();
      this.getCloudList();
      this.changeRadioIsShow = this.getChangeRadioIsShow();
    },
    mounted() {},
    methods: {
      getChangeRadioIsShow() {
        let isShow = false;
        let orderType = this.orderType;
        let proType = this.serviceInfo.proType;
        switch (this.orderInfo.type) {
          case orderType.create:
            // 展示变更的前提，操作集存在非首次、任意的操作
            isShow = proType ? this.proTypeMapCreateFun[proType]() : false;
            break;
          case orderType.change:
            isShow = proType ? this.proTypeMapCreateFun[proType]() : false;
            break;
          default:
            break;
        }
        return isShow
      },
      getDeployUnitList() {
        if (this.serviceInfo.proType === this.proTypeSet.main) {
          requestMethod.getDeployUnitList('get', {
            app_id: this.orderInfo.app_id
          }).then(res => {
            if (res.code === 200) {
              this.deployUnitList = res.data;
            }
          });
        }
      },
      getCloudList() {
        requestMethod.getCloudList('get', {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id
        }).then(res => {
          if (res.code === 200) {
            this.cloudList = res.data.items;
          }
        });
      },
      resetServiceInfo() {
        if (this.originServiceInfo) {
          this.serviceInfo = Object.assign(this.serviceInfo, this.originServiceInfo);
          this.createMethod = this.createMethodSet[this.serviceInfo.create_operation_method] || this.createMethodSet.new;
          this.saveServiceName = this.serviceInfo.name;
          this.saveOrderVal = this.serviceInfo.order;
        }
      },
      resetLayoutPosition(position) {
        this.$refs['layout-c'].style.left = position.left + 'px';
        this.$refs['layout-c'].style.top = position.top + 'px';
      },
      getAppsList() {
        requestMethod.getAppsList('get', {}).then(res => {
          if (res.code === 200) {
            this.appsList = res.data.items;
          }
        });
      },
      handleMethodChange() {
        this.selectDeployUnit = '';
      },
      handleAppsChange() {
        if (this.copyAppInfo.app_uuid) {
          let param = {
            app_uuid: this.copyAppInfo.app_uuid,
          };
          requestMethod.getBaseServiceListFormApps('get', param).then(res => {
            if (res.code === 200) {
              let baseServiceList = res.data.items;
              this.baseServiceList = baseServiceList.filter(item => this.serviceInfo.proType === item.pro_type);
            }
          });
          this.copyAppInfo.service_uuid = '';
        }
      },
      handleBaseServiceChange() {
        this.currentBaseService = this.baseServiceList.find(item => item.canvas_uuid === this.copyAppInfo.service_uuid);
        if (this.serviceInfo.proType === this.proTypeSet.main) {
          if (this.currentBaseService) {
            let param = {
              node_uuid: this.currentBaseService.node_uuid,
            };
            requestMethod.getAffiliateListFormApps('get', param).then(res => {
              if (res.code === 200) {
                this.affiliateServiceList = res.data.items;
              }
            });
            this.copyAppInfo.service_children_ids = [];
          }
        }
      },
      handleAffiliateChange() {
        this.currentAffiliateServiceList = this.affiliateServiceList.filter(item => this.copyAppInfo.service_children_ids.includes(item.canvas_uuid));
      },
      saveNodeName() {
        this.serviceInfo.name = this.saveServiceName;
        this.$emit('saveNodeName', this.saveServiceName);
        this.serviceNameStatus = 'off';
      },
      cancelName() {
        this.saveServiceName = this.serviceInfo.name;
        this.serviceNameStatus = 'off';
      },
      // 保存交互顺序
      saveNodeDeliverOrder() {
        this.serviceInfo.order = this.saveOrderVal;
        this.$emit('saveNodeDeliverOrder', this.saveOrderVal);
        this.deliverOrderStatus = 'off';
      },
      cancelDeliverOrder() {
        this.saveOrderVal = this.deliverOrderVal;
        this.deliverOrderStatus = 'off';
      },
      // 添加部署单元
      addDeployUnitFun(event, cell) {
        let name = cell ? cell.addDeployUnitValue : this.addDeployUnitValue;
        if (this.serviceInfo.proType === this.proTypeSet.main && name) {
          let param = {
            app_id: this.orderInfo.app_id,
            name: name
          };
          requestMethod.addDeployUnit('post', param).then(res => {
            if (res.code === 200) {
              this.getDeployUnitList();
              this.cancelDeployUnitFun(null, cell);
              this.$message.success('新建部署单元成功');
            }else {
              this.$message.error(res.message)
            }
          });
        }else {
          this.cancelDeployUnitFun(null, cell);
        }
      },
      cancelDeployUnitFun(event, cell) {
        if (cell) {
          cell.addDeployUnitValue = '';
          cell.addDeployStatus = 'off';
        }else {
          this.addDeployUnitValue = '';
          this.addDeployStatus = 'off';
        }
      },
      // 添加云主机-部署单元 cell
      addCell() {
        let item = {
          vmware_id: '',
          deployment_unit_id: '',
          addDeployUnitValue: '',
          addDeployStatus: 'off'
        };
        this.cellList.push(item)
      },
      // 删除云主机-部署单元 cell
      deleteCell(index) {
        this.cellList.splice(index, 1)
      },
      // 改变云主机
      handleCloudChange(cloudId,cell) {
        let cloud = this.cloudList.find(item => item.vmware_id === cloudId);
        cell.deployment_unit_id = cloud.deployment_unit_id;
      },
      getCanSelectCloudList(status,cell) {
        if (status) {
          this.canSelectCloudList = [];
          this.cloudList.forEach(cloud => {
            if (!this.cellList.find(item => item.vmware_id === cloud.vmware_id)) {
              this.canSelectCloudList.push(cloud.vmware_id)
            }
          });
          if (cell.vmware_id) {
            this.canSelectCloudList.push(cell.vmware_id)
          }
        }
      },
      // 变更选择操作集
      changeSelectedOperation() {
        this.newOperationList = this.operationList.map(item => {
          item.is_selected = 0;
          this.checkOperationIds.forEach(id => {
            if (item.service_set_id === id) {
              item.is_selected = 1;
            }
          });
          return item;
        });
      },
      confirm() {
        let operationList = this.newOperationList.length ? this.newOperationList : this.operationList;
        let selectDeployUnit = this.selectDeployUnit;
        if (this.serviceInfo.operation === 'edit') {
          // 编辑
          if (operationList.length) {
            this.$emit('handleOperationList', {
              operationList
            }, 'edit');
          }
        } else {
          // 新建
          switch (this.createMethod) {
            case this.createMethodSet.new:
              if (operationList.length) {
                this.$emit('handleOperationList', {
                  operationList,
                  selectDeployUnit
                }, 'add_new');
              }
              break;
            case this.createMethodSet.copy:
              let param = {
                app_uuid: this.copyAppInfo.app_uuid,
                service_uuid: this.copyAppInfo.service_uuid,
              };
              let serviceSet = {
                base: this.currentBaseService,
                affiliateArr: this.currentAffiliateServiceList,
              };
              if (this.serviceInfo.proType === this.proTypeSet.main) {
                param.service_children_ids = this.copyAppInfo.service_children_ids;
              }
              this.$emit('handleOperationList', {
                param,
                serviceSet,
                selectDeployUnit
              }, 'add_copy');
              break;
            case this.createMethodSet.change:
              this.cellError = this.cellList.some(cell => { return cell.vmware_id === '' });
              if (this.cellError) { return false }
              let deployment_infos = this.cellList.map(cell => {
                return {
                  deployment_unit_id : cell.deployment_unit_id ? cell.deployment_unit_id : null,
                  vmware_id: cell.vmware_id
                };
              });
              this.$emit('handleOperationList', {
                operationList,
                deployment_infos
              }, 'change');
              break;
            default:
              break;
          }
        }
        this.close();
      },
      close() {
        this.$emit('closeOperationDialog');
      }
    },
    computed: {
      changeRadioShow: function () {
        let isShow = false;
        let orderType = this.orderType;
        let proType = this.serviceInfo.proType;
        switch (this.orderInfo.type) {
          case orderType.create:
            // 展示变更的前提，操作集存在非首次、任意的操作
            isShow = this.proTypeMapCreateFun[proType]();
            break;
          case orderType.change:
            isShow = this.proTypeMapChangeFun[proType]();
            break;
          default:
            break;
        }
        return isShow
      }
    },
    watch: {
      'originServiceInfo': function (val) {
        this.resetServiceInfo();
      },
      'operationList': function (val) {
        this.checkOperationIds = [];
        this.operationList.forEach(item => {
          if (item.is_selected === 1) {
            this.checkOperationIds.push(item.service_set_id);
          }
        });
        // TODO: 考虑异步数据获取延迟
        this.changeRadioIsShow = this.getChangeRadioIsShow();
      },
    },
  };
</script>

<style lang="less" scoped>
    .layout-c {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        /*width: calc((100vw / 1366) * 400);*/
        /*max-height: calc((100vw / 1366) * 300);*/
        width: 400px;
        max-height: 300px;
        overflow-y: auto;
        background-color: #ffffff;
        box-shadow: 0 6px 12px 0 rgba(48, 107, 255, 0.1);
        border: 1px solid @g-border-color;
        border-radius: 5px;
        .header {
            @flex();
            height: 40px;
            padding: 0 20px;
            border-bottom: 1px solid @g-border-color;
            .name-c {
                @flex();
                height: 50px;
                .name {
                    font-size: 16px;
                }
                .order-val {
                    margin-left: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                & > .el-button {
                    margin-left: 8px;
                }
                .input-c {
                    @flex();
                    .el-input {
                        width: 200px;
                    }
                }
            }
        }
        .deliver-order-c {
            @flex();
            padding-left: 20px;
            height: 50px;
            border-bottom: 1px solid @g-border-color;
            .name {
                font-size: 12px;
            }
            .order-val {
                margin-left: 4px;
                font-size: 12px;
                font-weight: 500;
            }
            & > .el-button {
                margin-left: 8px;
            }
            .input-c {
                @flex();
                .el-input {
                    width: 80px;
                }
            }
        }
        .create-method-c {
            @flex();
            padding-left: 20px;
            height: 50px;
            border-bottom: 1px solid @g-border-color;
            font-size: 12px;
            label {
                margin-right: 10px;
            }
            .el-radio-group {
                /deep/ .el-radio__label {
                    font-size: 12px;
                }
            }
        }
        .operation-c {
            padding: 0 20px 20px 20px;
            border-bottom: 1px solid @g-border-color;
            font-size: 12px;
            .el-checkbox-group {
                display: flex;
                flex-direction: column;
                .el-checkbox {
                    margin-top: 15px;
                    color: @g-font-color-c;
                }
                /deep/ .el-checkbox__label {
                    font-size: 12px;
                }
            }
            .unit-c {
                @flex();
                margin-top: 10px;
                font-size: 12px;
                label {
                    margin-right: 12px;
                }
                .select-c {
                    @flex();
                    .el-select {
                        width: 200px;
                        /deep/ .el-input--small {
                            font-size: 12px;
                        }
                    }
                    .add-btn-c {
                        @flex();
                        cursor: pointer;
                        margin-left: 5px;
                        /*span {*/
                            /*margin-left: 5px;*/
                            /*color: rgba(48,107,255,1)*/
                        /*}*/
                    }
                }
                .add-c {
                    @flex();
                    .el-input {
                        width: 160px;
                    }
                }
            }
        }
        .copy-apps-c {
            padding-left: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid @g-border-color;
            font-size: 12px;
            .el-form {
                .el-form-item {
                    margin: 20px 0 0 0;
                    .el-select {
                        width: 200px;
                        /deep/ .el-input--small {
                            font-size: 12px;
                        }
                    }
                    /deep/ .el-form-item__label {
                        font-size: 12px;
                    }
                    .unit-c {
                        @flex();
                        font-size: 12px;
                        .select-c {
                            @flex();
                            .el-select {
                                width: 200px;
                                /deep/ .el-input--small {
                                    font-size: 12px;
                                }
                            }
                            .add-btn-c {
                                @flex();
                                cursor: pointer;
                                margin-left: 5px;
                                /*span {*/
                                    /*margin-left: 5px;*/
                                    /*color: rgba(48,107,255,1)*/
                                /*}*/
                            }
                        }
                        .add-c {
                            @flex();
                            .el-input {
                                width: 160px;
                            }
                        }
                    }
                }
            }
        }
        .change-c {
            padding: 0 20px 20px 20px;
            .cellList {
                margin-top: 16px;
                & > li {
                    @flex();
                    padding: 16px;
                    margin-bottom: 8px;
                    background: rgba(48,107,255,0.03);
                    border-radius: 14px;
                    font-size: 12px;
                    /*border-bottom: 1px solid rgba(231,237,243,1);*/
                    .left-c {
                        .cloud-c {
                            position: relative;
                            @flex();
                            label {
                                width: 60px;
                            }
                            label::before {
                                content: '*';
                                color: #F56C6C;
                                margin-right: 4px;
                            }
                            .error-hint {
                                position: absolute;
                                top: 100%;
                                left: 60px;
                                color: #F56C6C;
                                font-size: 12px;
                                line-height: 1;
                                padding-top: 4px;
                            }
                            .el-select {
                                width: 200px;
                                /deep/ .el-input--small {
                                    font-size: 12px;
                                }
                            }
                        }
                        .unit-c {
                            margin-top: 16px;
                            @flex();
                            label {
                                width: 60px;
                            }
                            .select-c {
                                @flex();
                                .el-select {
                                    width: 200px;
                                    /deep/ .el-input--small {
                                        font-size: 12px;
                                    }
                                }
                                .add-btn-c {
                                    @flex();
                                    cursor: pointer;
                                    margin-left: 5px;
                                    /*span {*/
                                        /*margin-left: 5px;*/
                                        /*color: rgba(48,107,255,1)*/
                                    /*}*/
                                }
                            }
                            .add-c {
                                @flex();
                                .el-input {
                                    width: 160px;
                                }
                            }
                        }
                    }
                    .right-c {
                        @flex();
                        margin-left: auto;
                        & > div:last-child {
                            margin-left: 16px;
                        }
                    }
                }
            }
            .el-checkbox-group {
                display: flex;
                flex-direction: column;
                .el-checkbox {
                    margin-top: 15px;
                    color: @g-font-color-c;
                }
                /deep/ .el-checkbox__label {
                    font-size: 12px;
                }
            }
        }
        .el-checkbox-group {
            display: flex;
            flex-direction: column;
            .el-checkbox {
                margin-top: 15px;
                color: @g-font-color-c;
            }
            /deep/ .el-checkbox__label {
                font-size: 12px;
            }
        }
        .operation-line-c {
            @flex();
            margin-top: 16px;
            span.line {
                flex: 1;
                height: 1px;
                background-color: @g-border-color;
            }
            span.title {
                font-size: 12px;
                margin: 0 8px;
            }
        }
        .svg-icon {
            font-size: 14px;
        }
        .footer-c {
            @flex();
            justify-content: center;
            height: 50px;
            & > .el-button:last-child {
                margin-left: 20px;
            }
        }
    }
    @media screen and (min-width: 1440px){
        .layout-c {
            width: 420px;
            max-height: 320px;
        }
    }
</style>
