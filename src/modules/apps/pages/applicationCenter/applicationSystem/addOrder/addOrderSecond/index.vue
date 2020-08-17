<template>
    <div class="addOrderSecond ts-content-form">
        <div class="header">
            <el-button type="primary" @click="showTemplateDialog" style="margin-left: 20px" v-if="true">导入JSON(后台人员测试用)
            </el-button>
            <el-button type="primary" @click="createDeployUnit" style="margin-left: 20px" v-if="false">创建部署单元</el-button>
            <el-button type="primary" @click="tempEmit(2)" v-if="false">测试交互</el-button>
            <!-- <span>部署视图</span> -->
            <div class="header_btn">
                 <el-button size="mini" @click="showTemplateDialog" v-show="false">模板导入(后台人员临时使用)</el-button>
                <el-button size="mini" @click="showTemplateExportDialog">模板导入</el-button>
                <el-button size="mini" @click="onConfig">集中配置下发</el-button>
            </div>
        </div>
        <div class="content">
            <div class="left-c" v-show="paletteAllowShowSteps[orderInfo.step]">
                <div class="title">服务列表</div>
                <div class="search-c">
                    <el-input
                            placeholder="搜索"
                            v-model="searchValue"
                            @input="handleSearchChange"
                            suffix-icon="el-icon-search">
                    </el-input>
                </div>
                <ul class="service-list">
                    <li v-for="(group, g_key) in paletteList" :key="g_key">
                        <div class="group-head" @click="group.expanded = !group.expanded">
                            <div class="title">{{group.name}}</div>
                            <div class="icon"><i
                                    :class="group.expanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i></div>
                        </div>
                        <ul class="group-list" :class="{'expanded': group.expanded}">
                            <li v-for="(node, n_index) in group.items" :key="n_index" draggable="true"
                                @dragstart="elementDragStart($event,node,g_key)">
                                <el-tooltip effect="dark"
                                            :content="`${node.name}`"
                                            placement="top-start">
                                    <div class="icon-c">
                                        <img :src="node.image ? node.image : defaultIconUrl" alt="">
                                    </div>
                                </el-tooltip>
                                <div class="name">{{node.name}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="right-c">
                <div class="canvas-c" ref="canvas-c">
                    <div class="toolbar-view" ref="toolbar-view">
                        <ul class="toolbarList">
                            <li v-for="(item,index) in toolbarList" :key="index"
                                :class="{'none': !item}"
                                :style="{
                            'border-left': item.borderLeft,
                            'border-top-left-radius': item.borderRadius ? item.borderRadius.topLeft : '',
                            'border-top-right-radius': item.borderRadius ? item.borderRadius.topRight : '',
                            'border-bottom-left-radius': item.borderRadius ? item.borderRadius.bottomLeft : '',
                            'border-bottom-right-radius': item.borderRadius ? item.borderRadius.bottomRight : ''
                        }"
                            >
                                <el-tooltip class="item" effect="dark" :content="item.toolTip" placement="top-start"
                                            :open-delay=300 v-if="item">
                                    <button :style="{backgroundColor: item.selected ? item.selectBackground : item.background}"
                                            :class="{disabled: item.disabled}" @click="handleToolBarEvent(item)">
                                        <img :src="item.icon" alt="">
                                    </button>
                                </el-tooltip>
                            </li>
                        </ul>
                    </div>
                    <div class="component-view" ref="component-view" @click="closeOperationDialog">
                        <div class="component-view-header">
                            <div class="point-c">▪︎ ▪︎ ▪︎</div>
                            <div class="btn-c">
                                <el-button type="text" @click="changCanvasScreenRate(0.75)">
                                    <svg-icon icon-class='screen_x'></svg-icon>
                                </el-button>
                                <el-button type="text" @click="changCanvasScreenRate(0.5)">
                                    <svg-icon icon-class='screen_z'></svg-icon>
                                </el-button>
                                <el-button type="text" @click="changCanvasScreenRate(0)">
                                    <svg-icon icon-class='screen_d'></svg-icon>
                                </el-button>
                            </div>
                        </div>
                        <div class="component-view-content">
                            <!--TODO: 此处放置component-->
                            <FormComponents :formComponentInfo="formComponentInfo"
                                            ref="formComponents"></FormComponents>
                        </div>
                    </div>
                    <div id="node-c" ref="node" style="width: 250px; height: 50px; margin: 0" v-if="false">
                        <div class="icon"></div>
                        <div class="value"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="btn-c">
                <el-button @click="cancel">取 消</el-button>
                <el-button @click="previous">上一步：基本信息</el-button>
                <el-button @click="serviceSetCheck" :loading="submitLoading"
                           :type="(+orderInfo.step === stepSet.collect_approval || +orderInfo.step === stepSet.plan_approval)?'':'primary'">
                    {{ submitLoading ? '提交中...' : '下一步：交付计划' }}
                </el-button>
                <el-button type="primary"
                           v-if="+orderInfo.step === stepSet.collect_approval || +orderInfo.step === stepSet.plan_approval"
                           @click="collectApprove">审 批
                </el-button>
            </div>
        </div>
        <OperationDialog v-if="operationDialogFlag"
                         @closeOperationDialog="closeOperationDialog"
                         @handleOperationList="handleOperationList"
                         @saveNodeName="saveNodeName"
                         @saveNodeDeliverOrder="saveNodeDeliverOrder"
                         :operationList="operationList"
                         :originServiceInfo="serviceInfo"
                         :orderInfo="orderInfo"
                         ref="operationDialog"></OperationDialog>
        <!--------------------------------------- 模板导入 -------------------------------------->
        <TemplateDialog v-if="templateDialogFlag" @closeTemplateDialog="closeTemplateDialog"
                        @getCanvasData="getCanvasData"></TemplateDialog>

        <TemplateExportDialog
          :dialogVisible="templateExportDialogFlag"
          @closeTemplateExport="closeTemplateExportDialog"
          :orderInfo="orderInfo"
          :from="currentFrom"
          :operation="operation"
          :ticket_num="ticket_num"
        >
        </TemplateExportDialog>
        <Approval
                v-if="dialogTableVisible"
                :dialog-table-visible="dialogTableVisible"
                @approveCancel="approveCancel"
                :instance_id="+orderInfo.instance_id"
                :ticket_id="+orderInfo.ticket_id"
                :operation="'edit'"
                :app_id="+orderInfo.app_id"
                :from="currentFrom"
        ></Approval>
        <!--------------------------------------- 集中配置下发 -------------------------------------->
        <ConfigDrawer v-if="configDrawerVisible" :configDrawerVisible='configDrawerVisible' :configDrawerData="configDrawerData"
          @handleSuccess="configSuccess" @closeDrawer="configCancel"></ConfigDrawer>
    </div>
</template>

<script>
  //引入画布代码
  import '@/commons/js/HT/ht-common.js';
  import GraphView from '../../../../../ht/ddb-graphView';
  // import Toolbar from '../../../../../ht/ddb-toolbar';
  import ToolbarList from '../../../../../ht/ddb-toolbarList';
  import '../../../../../ht/ddb-config';
  // 组件
  import TemplateDialog from './components/templateDialog';
  import TemplateExportDialog from './components/templateExportDialog';
  import OperationDialog from './components/operationDialog';
  //集中配置下发
  import ConfigDrawer from './components/configDrawer.vue';
  import FormComponents from '../../../components/formComponentContent.vue';
  import Approval from './../addOrderFirst/components/approval.vue';

  // api
  import * as requestMethod from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';
  import {Bus, canvasEvent} from '@/modules/apps/bus/form.bus.js';

  const operationPositionY = 60;

  export default {
    name: 'addOrderSecond',
    data() {
      return {
        // 状态管理
       // approvalFrom:"",
        ticket_num:'',
        operation: 'add', // add、edit
        service_name: '',
        stepSet: {
          collect: 1, // 需求收集
          collect_approval: 2, // 需求收集审批
          plan: 3, // 资源规划
          plan_approval: 4, // 资源规划审批
          deploy: 5, // 资源部署
        },
        paletteAllowShowSteps: {
          1: true,
          2: false,
          3: true,
          4: false,
          5: false,
        },
        toolBarAllowEditSteps: {
          1: true,
          2: false,
          3: true,
          4: false,
          5: false,
        },
        operationAllowEditSteps: {
          1: true,
          2: false,
          3: true,
          4: false,
          5: true,
        },
        //从哪个页面跳转而来的所有可能情况
      from:{
        'service':'/applicationCenter/serviceCatalog',
        'order':'/applicationCenter/myOrder',
        'app':'/applicationCenter/applicationSystem'
      },
      //当前从哪个页面跳转而来
      currentFrom:'',
        // 画布相关属性
        originPaletteList: null,
        paletteList: null,
        toolbarList: null,
        canvas: {
          palette: null,
          graphView: null,
          toolbar: null,
        },
        currentNodeData: null, // => saveNodeName
        lastNodeData: null, // TODO: 上一次选中节点（目前不过滤无数据情况，保留所有可能性）
        currentOperationPosition: {
          top: 0,
          left: 0,
        },
        // 数据管理
        formComponentInfo: null,
        orderInfo: {
          app_id: '',
          ticket_id: '',
          bus_id: '',
          step: 1,
          instance_id: '',
          ticket_step_id: '',
          type: 1, // 1 新建订单   2 变更订单
          ticket_name:'',
          ticket_type:1
        },
        orderType: {
          create: 1,
          change: 2
        },
        serviceInfo: null, // <= currentNodeData
        operationList: [],
        proTypeSet: {
          main: 1, // 计算服务
          affiliate: 2, // 附加服务
          network: 3, // 网络服务
          integrate: 4, // 集成服务
          mix: 5, // 混合
        },
        serviceTypeSet: {
          base: 1, // 基础服务
          component: 2, // 组件服务
        },
        // 其他
        searchValue: '',
        submitLoading: false,
        defaultIconUrl: require('@/commons/images/default_icon.svg'),
        templateDialogFlag: false,
        operationDialogFlag: false,
        dialogTableVisible: false,
        //集中配置下发
        configDrawerVisible: false,
        configDrawerData:{},
        templateExportDialogFlag: false,
      };
    },
    created() {
      this.getOrderInfo();
      this.getPaletteList();
      this.getToolbarList();
      this.createCanvas();
      this.getCanvasData();
      this.startBusMonitor();
      this.resetSteps();
    },
    mounted() {
      this.layoutCanvas();
      this.startCanvas();
    },
    methods: {
      serviceSetCheck(){ //应用系统-基础服务操作集校验
        var params={
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
        }
        requestMethod.checkServiceSet(params).then(res => {
          if (res.code === 200) {
            if(res.status==true){
              this.validationCheck()
            }else{
              this.$message.error(res.message);
            }
          }else{
            this.$message.error(res.message);
          }
        });
      },
      validationCheck(){ //应用系统-必填项校验
        var params={
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
        }
        requestMethod.checkValidation(params).then(res => {
          if (res.code === 200) {
            if(res.status==true){
              this.next()
            }else{
              this.$message.error(res.message);
            }
          }else{
            this.$message.error(res.message);
          }
        });
      },
      // start
      getOrderInfo() {
        this.operation = this.$route.query.operation;
        this.orderInfo.app_id = this.$route.query.app_id;
        this.orderInfo.ticket_id = this.$route.query.ticket_id;
        this.orderInfo.bus_id = this.$route.query.bus_id;
        this.orderInfo.step = this.$route.query.step;
        this.orderInfo.instance_id = this.$route.query.instance_id;
        this.orderInfo.ticket_step_id = this.$route.query.step_id;
        this.orderInfo.type = this.$route.query.ticket_level ? (this.$route.query.ticket_level.toString() === '1' ? 1 : 2) : 2;
        this.currentFrom = this.$route.query.from;
        this.ticket_num = this.$route.query.ticket_num;
        this.orderInfo.ticket_name = this.$route.query.ticket_name;
        //获取订单类型：1:快速申请，2:蓝图定义
        this.orderInfo.ticket_type = this.$route.query.ticket_type;
        //当是新增，并且新增的是快速服务申请时：
        if (this.orderInfo.ticket_type.toString() === '1') {
          this.service_name = this.$route.query.service_name;
          this.$emit('changeTitle', this.service_name, this.orderInfo.ticket_name);
        } else {
          //蓝图定义时
          //修改页面标题
          this.$emit('changeTitle', Number(this.orderInfo.step), this.orderInfo.ticket_name);
        }
      },
      resetSteps() {
        this.$emit('changeStep', 1);
      },
      //--------------------------------画布相关--------------------------------------
      // 创建画布
      createCanvas() {
        // 1.创建拓扑组件
        let graphView = new GraphView(this);

        // 2.创建工具栏
        // let toolbar = new Toolbar(this);

        // 3.生成canvas
        this.canvas = {graphView};
      },
      // 布局画布
      layoutCanvas() {
        // 1 获取画布容器
        let containerDom = this.$refs['canvas-c'];
        // 2.创建视图
        // 2.1 创建顶部视图
        let topView;
        let toolbarView = this.$refs['toolbar-view'];
        let topMainView = new ht.widget.SplitView(toolbarView, this.canvas.graphView.$graphView, 'v', 40);
        let topSpaceView = '';
        topView = new ht.widget.SplitView(topMainView, topSpaceView, 'h', -20);
        topMainView.setDividerBackground('#E7EDF3');
        topMainView.setDragOpacity('1');
        topMainView.setDraggable(false);
        topMainView.getView().style.backgroundColor = '#fff';
        topView.setDividerBackground('#E7EDF3');
        topView.setDragOpacity('1');
        // if (this.allowEditSteps[this.orderInfo.step]) {
        //   let toolbarView = this.$refs['toolbar-view'];
        //   let topMainView = new ht.widget.SplitView(toolbarView, this.canvas.graphView.$graphView, 'v', 40);
        //   let topSpaceView = '';
        //   topView = new ht.widget.SplitView(topMainView, topSpaceView, 'h', -20);
        //   topMainView.setDividerBackground('#E7EDF3');
        //   topMainView.setDragOpacity('1');
        //   topMainView.setDraggable(false);
        //   topMainView.getView().style.backgroundColor = '#fff';
        //   topView.setDividerBackground('#E7EDF3');
        //   topView.setDragOpacity('1');
        // }else {
        //   topView = this.canvas.graphView.$graphView
        // }
        // 2.2 创建底部视图
        let bottomView = this.$refs['component-view'];
        // 2.3 创建主视图
        let mainView = new ht.widget.SplitView(topView, bottomView, 'v', 0.75);
        this.canvas.mainView = mainView;
        // 2.4 主视图配置视图样式
        mainView.setDividerBackground('#E7EDF3');
        mainView.setDragOpacity('1');
        mainView.getView().className = 'canvas-view';
        // 3 注入容器
        containerDom.appendChild(mainView.getView());
        // 4 布局变化事件监听
        // topView.addViewListener(function (e) {
        //   if (e.kind === 'layout') {
        //     let splitP = mainView.getPosition();
        //     console.log('splitP', splitP);
        //   }
        // });
      },
      // 启动画布
      startCanvas() {
        for (let component of Object.values(this.canvas)) {
          if (typeof component.init === 'function') {
            component.init();
          }
        }
      },
      // 启动总线监听
      startBusMonitor() {
        Bus.$on('dispatchCanvasEvent', (eventName, param) => {
          this.dispatchCanvasEvent(eventName, param);
        });
      },
      // 画布派发事件
      dispatchCanvasEvent(eventName, ...param) {
        if (typeof this[eventName] === 'function') {
          this[eventName](...param);
        }
      },
      updateNetworkNodeData(...param) {
        console.log('param updateNetwork', param);
        if (param && param.length) {
          let data = param[0];
          let node = this.canvas.graphView.getNodeByUUID(data.service_uuid);
          if (node) {
            node.s({
              'note': `${data.network_area}-${data.network_type}-${data.network_cidr}`,
              'note.position': 3,
              'note.background': 'rgba(0,122,255,0.15)',
              'note.offset.x': 0,
              'note.offset.y': -10,
              'note.color': 'rgba(0,0,0,1)',
            });
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());
          }
        }
      },
      updateEdgeIpData(...param) {
        console.log('updateEdgeIpData param', param);
        if (param && param.length) {
          let data = param[0];
          let sourceNode = this.canvas.graphView.getNodeByUUID(data.source_uuid);
          let targetNode = this.canvas.graphView.getNodeByUUID(data.target_uuid);
          let edgeArr = this.canvas.graphView.getAllEdgeFromCanvas();
          if (sourceNode && targetNode) {
            let currentEdge = edgeArr.find(edge => {
              let isNeedEdge = false;
              let sourceNodeData = this.canvas.graphView.getEdgeOriginNodeData(edge.getSource());
              let targetNodeData = this.canvas.graphView.getEdgeOriginNodeData(edge.getTarget());
              if (sourceNodeData.uuid === sourceNode.a('uuid') && targetNodeData.uuid === targetNode.a('uuid')) {
                isNeedEdge = true;
              }
              return isNeedEdge;
            });
            if (currentEdge) {
              // currentEdge.s({
              //   'note': data.ip,
              //   'note.color': 'rgba(25,34,59,1)',
              //   'note.position': 17,
              //   'note.background': '#e7ed2463'
              // });
              // let ip;
              // if (data.ip instanceof Array) {
              //    ip = data.ip.join('/n')
              // }else {
              //    ip = data.ip
              // }
              let ipArr = data.ip.filter(ip => { return ip });
              let ipColumnArr = this.mergeArrElements(ipArr);
              let ip = ipColumnArr.join(' \n');
              if (ip) {
                currentEdge.s({
                  'label': ip,
                  'label.color': 'rgba(0,0,0,1)',
                  'label.position': 17,
                  'label.background': 'rgba(0,122,255,0.15)',
                  'label.offset.y': -15,
                  'label.position.fixed': true,
                  'label.align': 'left'
                });
              }else {
                currentEdge.s({
                  'label': '',
                  'label.background': 'rgba(0,0,0,0)',
                });
              }
              this.saveCanvasData(this.canvas.graphView.getCanvasJson());
            }
          }
        }
      },
      /**
       * @author DDB
       * @method  mergeArrElements
       * @Description  用于合并数组元素个数，可将数组的多个元素合并成一个
       * @param arr: 原始数组、 num：个数，多少个合并为一个
       * @return newArr 合并后的数组
      */
      mergeArrElements(arr, num = 2) {
        let newArr = [];
        if (arr instanceof Array && num > 0) {
          for(let i=0; i < arr.length; i++) {
            if (i%num === 0) {
              let rowEl = '';
              for (let j=0; j < num; j++) {
                if (arr[i+j]) { rowEl += `${arr[i+j]}，` }
              }
              rowEl = rowEl.slice(0, rowEl.length - 1);
              newArr.push(rowEl);
            }
          }
        }
       return newArr;
      },
      updateVirtualData(...param) {
        console.log('param updateVirtualData', param);
        if (param && param.length) {
          let data = param[0];
          let node = this.canvas.graphView.getNodeByUUID(data.service_uuid);
          if (node) {
            let group = node.getParent();
            let iconName = 'numIcon';
            group.addStyleIcon(iconName, {
              position: 8,
              offsetX: -10,
              offsetY: 10,
              direction: 'east',
              width: 16,
              height: 16,
              positionFixed: true,
              names: [iconName],
            });
            group.s({
              label2: data.virtual_num,
              'label2.offset.x': -10,
              'label2.offset.y': 10,
              'label2.position': 8,
              'label2.font': '14px sans-serif',
              'label2.color': '#000',
              // "label2.background": "#fff"
            });
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());
          }
        }
      },
      backLastNodeData(...param) {
        this.currentNodeData = this.lastNodeData;
        console.log('this.lastNodeData',this.lastNodeData);
        if (this.currentNodeData) {
          let lastNode = this.canvas.graphView.getNodeByUUID(this.currentNodeData.uuid);
          if (lastNode.a('proType') === this.proTypeSet.main) { lastNode = lastNode.getParent() }
          this.canvas.graphView.setSelectNode(lastNode);
          this.getServiceInfo(lastNode);
        }
      },
      // 获取面板数据
      getPaletteList() {
        requestMethod.getPaletteList('get', {
          bus_id: this.orderInfo.bus_id,
        }).then(res => {
          if (res.code === 200) {
            this.originPaletteList = res.data;
            this.paletteList = this.filterPaletteData(res.data);
          }
        });
      },
      // 获取工具栏列表
      getToolbarList() {
        let toolbarList = new ToolbarList().self;
        if (this.toolBarAllowEditSteps[this.orderInfo.step]) {
          this.toolbarList = toolbarList;
        } else {
          let excludeArr = ['直线', '直角线', '删除', '清空'];
          this.toolbarList = toolbarList.map(item => {
            if (excludeArr.includes(item.toolTip)) {
              item.disabled = true;
            }
            return item;
          });
        }
      },
      handleToolBarEvent(item) {
        if (typeof item.onClicked === 'function' && !item.disabled) {
          if (item.groupId) {
            this.toolbarList.forEach(obj => {
              if (item.groupId === obj.groupId) {
                this.$set(obj, 'selected', false);
              }
            });
            this.$set(item, 'selected', true);
          }
          item.onClicked(this.canvas.graphView.$graphView, this);
        }
      },
      // 过滤面板数据
      filterPaletteData(data) {
        let paletteList = {};
        for (let [key, group]  of Object.entries(data)) {
          paletteList[key] = {};
          paletteList[key].name = group.name;
          paletteList[key].expanded = true;
          paletteList[key].items = group.items.map(item => {
            return {
              name: item.pro_service_name,
              serviceId: item.pro_service_id,
              serviceType: item.pro_service_type,
              proType: item.pro_type,
              image: item.service_img_url,
            };
          });
        }
        return paletteList;
      },
      handleSearchChange() {
        let paletteList = {};
        for (let [key, group]  of Object.entries(this.originPaletteList)) {
          paletteList[key] = {};
          paletteList[key].name = group.name;
          paletteList[key].expanded = true;
          let items = group.items.filter(item => {
            return item.pro_service_name.indexOf(this.searchValue) >= 0;
          });
          paletteList[key].items = items.map(item => {
            return {
              name: item.pro_service_name,
              serviceId: item.pro_service_id,
              serviceType: item.pro_service_type,
              proType: item.pro_type,
              image: item.service_img_url,
            };
          });
        }
        this.paletteList = paletteList;
      },
      // 获取画布数据
      getCanvasData(canvasJson) {
        if (canvasJson) {
          this.canvas.graphView.deserialize(canvasJson);
        }else {
          let param = {
            app_id: this.orderInfo.app_id,
            ticket_id: this.orderInfo.ticket_id,
            is_app_canvas: 0, // 1为应用画布；0为订单画布
            canvas_type: 2, // 1为应用架构图；2为部署视图；3为数据流向图；4交付视图；
          };
          requestMethod.getCanvasData('get', param).then(res => {
            if (res.code === 200) {
              let canvas_json = res.data.canvas_text;
              if (canvas_json) {
                this.canvas.graphView.deserialize(canvas_json);
              }
            }
          });
        }
      },
      // 获取组件服务画布数据
      getComponentCanvasJson(data) {
        let param = {
          component_id: data.serviceId,
        };
        return requestMethod.getComponentCanvasJson('get', param).then(res => {
          if (res.data) {
            return res.data.canvas_json;
          }
        });
      },
      // 拖拽时元素数据注入
      elementDragStart(e, node, key) {
        e.dataTransfer.setData('nodeId', node.serviceId);
        e.dataTransfer.setData('groupKey', key);
      },
      // 保存基础服务图元数据,
      saveBaseServiceData(data) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          data_info: {
            base_service_id: data.service_id,
            node_canvas_uuid: data.uuid,
          },
        };
        return requestMethod.saveBaseServiceData('post', param).then(res => {
          return res;
        });
      },
      // 保存组件服务图元数据
      saveComponentServiceData(data) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          data_info: {
            component_id: data.component_id,
            base_service_infos: data.base_service_infos,
          },
        };
        return requestMethod.saveComponentServiceData('post', param).then(res => {
          return res;
        });
      },
      // 删除图元从画布
      deleteNodeFromCanvas(deleteList, elementStatus) {
        let hint;
        if (elementStatus.isAll) {
          hint = '确认清除画布数据?';
        } else {
          hint = elementStatus.isGroup ? '确认删除组？' : elementStatus.isMain ? '确认删除主图元，删除主图元将删除整个组！' : '确认删除图元？';
        }
        return this.$confirm(hint, '提示', {
          type: 'warning',
        }).then(_ => {
          let deleteArr = deleteList.map(item => {
            return item.canvas_uuid;
          });
          let param = {
            app_id: this.orderInfo.app_id,
            ticket_id: this.orderInfo.ticket_id,
            deleteArr: deleteArr,
          };
          console.log('param delete:', JSON.stringify(param));
          return requestMethod.deleteNodeFromCanvas('delete', param).then(res => {
            let data;
            if (res.code === 200) {
              data = res;
              this.$message.success(elementStatus.isAll ? '清除画布成功' : elementStatus.isGroup ? '删除组成功' : '删除图元成功');
            } else {
              this.$message.error(res.message);
            }
            return data;
          });
        }).catch(err => {
          console.error('err: ', err);
        });
      },
      // 保存画布
      saveCanvasData(canvasJson, status) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          is_app_canvas: 0, // 1为应用画布；0为订单画布
          canvas_type: 2, // 1为应用架构图；2为部署视图；3为数据流向图；4交付视图；
          canvas_text: canvasJson,
        };
        requestMethod.saveCanvasData('post', param).then(res => {
          if (res.code === 200) {
            if (status === 'show') {
              this.$message.success('保存成功');
            }
          }
        });
      },
      // 保存画布关联关系
      saveCanvasRelation(data) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          relations: {
            group: data.group,
            edge: data.edge,
          },
        };
        console.log('param Relation: ', JSON.stringify(param));
        requestMethod.saveCanvasRelation('post', param).then(res => {
          return res;
        });
      },
      //----------------------------------数据交互------------------------------------
      //  async initNodeOperationList(node) {
      //   if (this.operationAllowEditSteps[this.orderInfo.step]) {
      //     let nodeP = node.p();
      //     let realP = this.canvas.graphView.$graphView.getScreenPoint(nodeP);
      //     this.currentOperationPosition.left = realP.x;
      //     this.currentOperationPosition.top = realP.y - operationPositionY;
      //     if (node.a('operation') && node.a('operation') === 'edit') {
      //       await this.getNodeServiceOperationList();
      //     } else {
      //       await this.getOriginServiceOperationList();
      //     }
      //     this.showOperationDialog();
      //     this.resetOperationDialogLayout();
      //   }
      // },
      initNodeOperationList(node) {
        if (this.operationAllowEditSteps[this.orderInfo.step]) {
          if (!this.operationDialogFlag) {
            let nodeP = node.p();
            let realP = this.canvas.graphView.$graphView.getScreenPoint(nodeP);
            this.currentOperationPosition.left = realP.x;
            this.currentOperationPosition.top = realP.y - operationPositionY;
            if (node.a('operation') && node.a('operation') === 'edit') {
              this.getNodeServiceOperationList();
            } else {
              this.getOriginServiceOperationList();
            }
            this.showOperationDialog();
            this.resetOperationDialogLayout();
          }
        }
      },
      getServiceInfo(node) {
        if (node.a('operation') && node.a('operation') === 'edit') {
          this.getNodeServiceOperationList();
        } else {
          this.getOriginServiceOperationList();
        }
      },
      getOriginServiceOperationList() {
        let param = {
          service_id: this.currentNodeData.service_id,
          node_canvas_uuid: this.currentNodeData.uuid,
        };
        return requestMethod.getOriginServiceOperationList('get', param).then(res => {
          if (res.code === 200) {
            this.operationList = res.data.set_list;
            this.serviceInfo = {
              uuid: this.currentNodeData.uuid,
              proType: this.currentNodeData.proType,
              operation: this.currentNodeData.operation,
              create_operation_method: this.currentNodeData.create_operation_method,
              name: this.currentNodeData.name,
              order: res.data.node_index
            };
          }
        });
      },
      getNodeServiceOperationList() {
        let param = {
          canvas_uuid: this.currentNodeData.uuid,
        };
        requestMethod.getNodeServiceOperationList('get', param).then(res => {
          if (res.code === 200) {
            this.operationList = res.data.items;
            this.serviceInfo = {
              uuid: this.currentNodeData.uuid,
              proType: this.currentNodeData.proType,
              operation: this.currentNodeData.operation,
              create_operation_method: this.currentNodeData.create_operation_method,
              name: res.data.node_name,
              order: res.data.node_index
            };
          }
        });
      },
      handleOperationList(data, status) {
        let node = this.canvas.graphView.getNodeByUUID(this.currentNodeData.uuid);
        switch (status) {
          case 'add_new':
            this.addServiceOperationList(data, node);
            break;
          case 'add_copy':
            this.copyServiceFromApps(data, node);
            break;
          case 'change':
            this.changeServiceFromApps(data, node);
            break;
          case 'edit':
            this.editServiceOperationList(data, node);
            break;
          default:
            break;
        }
      },
      addServiceOperationList(data, node) {
        let operationList = data.operationList;
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          node_canvas_uuid: this.currentNodeData.uuid,
          set_infos: operationList,
          deployment_unit_id: data.selectDeployUnit ? data.selectDeployUnit : null
        };
        // if (data.selectDeployUnit) {
        //   param.deployment_unit_id = data.selectDeployUnit
        // }
        requestMethod.addServiceOperationList('post', param).then(res => {
          if (res.code === 200) {
            let selecetdOperationList = [];
            operationList.forEach(item => {
              if (item.is_selected === 1) {
                selecetdOperationList.push(item.service_set_id);
              }
            });
            node.a({
              operation: 'edit',
              create_operation_method: 'new',
              operationList: selecetdOperationList
            });
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());

            // TODO: 表单组件执行更新
            this.$refs.formComponents.getParasByUUID(this.currentNodeData.uuid);
            // this.$message.success('添加操作集成功');
          } else {
            this.$message.error(`添加操作集失败 message:${res.message}`);
          }
        });
      },
      copyServiceFromApps(data, node) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          original_uuid: this.currentNodeData.uuid,
          copy_uuid: data.param.service_uuid,
          new_uuid: this.canvas.graphView.createUUID(),
          deployment_unit_id: data.selectDeployUnit ? data.selectDeployUnit : null
        };
        if (this.serviceInfo.proType === this.proTypeSet.main) {
          param.child_uuid_set = data.param.service_children_ids.map(item => {
            return {
              copy_uuid: item,
              new_uuid: this.canvas.graphView.createUUID(),
            };
          });
        }
        // if (data.selectDeployUnit) {
        //   param.deployment_unit_id = data.selectDeployUnit
        // }
        requestMethod.copyBaseServiceFromApps('post', param).then(res => {
          if (res.code === 200) {
            node.removeStyleIcon(`${node.a('name')}-${node.a('service_id')}`);
            node.removeStyleIcon('defaultIcon');
            node.a({
              name: data.serviceSet.base.node_name,
              service_id: data.serviceSet.base.pro_service_id,
              image: data.serviceSet.base.image_url,
              uuid: param.new_uuid,
              operation: 'edit',
              create_operation_method: 'copy',
            });
            node.s({
              label: data.serviceSet.base.node_name,
            });
            // 更改图标
            this.canvas.graphView.addIconForNode(node);
            if (this.serviceInfo.proType === this.proTypeSet.main) {
              let group = node.getParent();
              let deleteList = [];
              group.eachChild(child => {
                if (child.a('proType') === this.proTypeSet.affiliate) {
                  deleteList.push(child);
                }
              });
              if (deleteList.length) {
                deleteList.forEach(item => {
                  this.canvas.graphView.deleteAttachesNode(item);
                  this.canvas.graphView.removeNode(item);
                });
              }
              if (data.serviceSet.affiliateArr.length) {
                data.serviceSet.affiliateArr.forEach((item, index) => {
                  let currentChild = param.child_uuid_set.find(child => child.copy_uuid === item.canvas_uuid);
                  let nodeData = {
                    elementType: 'node',
                    name: item.node_name,
                    service_id: item.pro_service_id,
                    serviceType: this.serviceTypeSet.base,
                    proType: item.pro_type,
                    image: item.image_url,
                  };
                  let childNode = this.canvas.graphView.createNode(nodeData, this.proTypeSet.affiliate);
                  let dataModel = this.canvas.graphView.getDateModel();
                  let childD = 70;
                  group.addChild(childNode);
                  dataModel.add(childNode);
                  this.canvas.graphView.addAttachesElementToCanvas(childNode);
                  childNode.a({
                    operation: 'edit',
                    uuid: currentChild.new_uuid,
                  });
                  childNode.s('2d.move.mode', 'y');
                  childNode.p({
                    x: node.p().x,
                    y: node.p().y + childD * (index + 1),
                  });
                });
              }
            }
            this.canvas.graphView.saveGraphData();
            this.canvas.graphView.saveGraphRelations();
            // TODO: 表单组件执行更新
            this.$refs.formComponents.getParasByUUID(param.new_uuid);
            // this.$message.success('复制并创建基础服务成功');
          } else {
            this.$message.error(`复制并创建基础服务失败 message:${res.message}`);
          }
        });
      },
      changeServiceFromApps(data, node) {
        let operationList = data.operationList;
        let deployment_infos = data.deployment_infos;
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          node_canvas_uuid: this.currentNodeData.uuid,
          set_infos: operationList,
          deployment_infos: deployment_infos
        };
        requestMethod.changeServiceOperationList('post', param).then(res => {
          if (res.code === 200) {
            let selecetdOperationList = [];
            operationList.forEach(item => {
              if (item.is_selected === 1) {
                selecetdOperationList.push(item.service_set_id);
              }
            });
            node.a({
              operation: 'edit',
              create_operation_method: 'change',
              operationList: selecetdOperationList
            });
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());
            // TODO: 表单组件执行更新
            this.$refs.formComponents.getParasByUUID(this.currentNodeData.uuid);
            // this.$message.success('添加操作集成功');
          } else {
            this.$message.error(`添加操作集失败 message:${res.message}`);
          }
        });
      },
      editServiceOperationList(data, node) {
        let operationList = data.operationList;
        let set_infos = operationList.map(item => {
          return {
            service_set_id: item.service_set_id,
            is_selected: item.is_selected,
          };
        });
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          canvas_uuid: this.currentNodeData.uuid,
          set_infos: set_infos,
        };
        requestMethod.editServiceOperationList('put', param).then(res => {
          if (res.code === 200) {
            let selecetdOperationList = [];
            operationList.forEach(item => {
              if (item.is_select === 1) {
                selecetdOperationList.push(item.service_set_id);
              }
            });
            node.a('operationList', selecetdOperationList);
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());
            // TODO: 表单组件执行更新
            this.$refs.formComponents.getParasByUUID(this.currentNodeData.uuid);
            // this.$message.success('编辑操作集成功');
          } else {
            this.$message.error(`编辑操作集失败 message:${res.message}`);
          }
        });
      },
      saveNodeName(name) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          canvas_uuid: this.currentNodeData.uuid,
          node_name: name,
        };
        requestMethod.editServiceBaseInfo('put', param).then(res => {
          if (res.code === 200) {
            this.$message.success('修改名称成功');
            let node = this.canvas.graphView.getNodeByUUID(this.currentNodeData.uuid);
            node.s({
              label: name,
            });
            // TODO: 更新serviceInfo
            this.serviceInfo.name = name;
            this.saveCanvasData(this.canvas.graphView.getCanvasJson());
          }
        });
      },
      saveNodeDeliverOrder(index) {
        let param = {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          canvas_uuid: this.currentNodeData.uuid,
          node_index: index,
        };
        requestMethod.editServiceBaseInfo('put', param).then(res => {
          if (res.code === 200) {
            // TODO: 更新serviceInfo
            this.serviceInfo.order = index;
            this.$message.success('修改交付顺序成功');
          }
        });
      },
      resetOperationDialogLayout() {
        this.$nextTick(() => {
          this.$refs.operationDialog.resetLayoutPosition(this.currentOperationPosition);
        });
      },
      //--------------------------------操作按钮--------------------------------------
      changCanvasScreenRate(position) {
        this.canvas.mainView.setPosition(position);
      },
      showTemplateDialog() {
        this.templateDialogFlag = true;
      },
      createDeployUnit() {
        this.canvas.graphView.createDeployUnit();
      },
      showTemplateExportDialog() {
        this.templateExportDialogFlag = true
      },
      closeTemplateExportDialog() {
        this.templateExportDialogFlag = false
      },
      closeTemplateDialog() {
        this.templateDialogFlag = false;
      },
      showOperationDialog() {
        this.operationDialogFlag = true;
      },
      closeOperationDialog() {
        this.operationDialogFlag = false;
      },
      //集中配置下发
      onConfig() {
        this.configDrawerData={
          ticket_id:Number(this.orderInfo.ticket_id)
        };
        this.configDrawerVisible = true;
      },
      //集中配置下发关闭事件
      configCancel() {
        this.configDrawerVisible = false;
      },
      //集中配置下发成功事件
      configSuccess(){
        this.configDrawerVisible = false;
      },
      cancel() {
        // if(this.currentFrom === "service"){
        //   this.$router.push({
        //     path: '/applicationCenter/myOrder?menu_id=1044'
        //   });
        // }else{

        // }
        history.back()

        // this.$router.push({
        //   path: this.from[this.currentFrom]
        // });
      },
      previous() {
        this.$router.replace({
          path: './addOrderFirst',
          query: {
            app_id: this.orderInfo.app_id,
            ticket_id: this.orderInfo.ticket_id,
            step: this.orderInfo.step,
            operation: this.operation,
            ticket_type: this.orderInfo.ticket_type,//1:快速申请，2:蓝图定义
            from: this.currentFrom,
            ticket_num:this.ticket_num,
            ticket_name:this.orderInfo.ticket_name,
            service_name: this.service_name,
          },
        });
      },
      next(){
       this.$router.replace({
              path: './addOrderThird',
              query: {
                app_id: this.orderInfo.app_id,
                ticket_id: this.orderInfo.ticket_id,
                bus_id: this.orderInfo.bus_id,
                step: this.orderInfo.step,
                operation: this.operation,
                instance_id: this.orderInfo.instance_id,
                step_id: this.orderInfo.ticket_step_id,
                ticket_type: this.orderInfo.ticket_type,//1:快速申请，2:蓝图定义
                from: this.currentFrom,
                ticket_num:this.ticket_num,
                ticket_name:this.orderInfo.ticket_name,
                service_name: this.service_name

              },
        });
      },
      next_bf() {
        this.$refs.formComponents.submitForm(false).then((result)=>{
          if(result){
            this.$router.replace({
              path: './addOrderThird',
              query: {
                app_id: this.orderInfo.app_id,
                ticket_id: this.orderInfo.ticket_id,
                step: this.orderInfo.step,
                operation: this.operation,
                instance_id: this.orderInfo.instance_id,
                step_id: this.orderInfo.ticket_step_id,
                ticket_type: 2,//1:快速申请，2:蓝图定义
                from: this.currentFrom,
                ticket_num:this.ticket_num,
                ticket_name:this.orderInfo.ticket_name,
                service_name: this.service_name,
              },
            });
          }else{
            this.$confirm("填写数据有误，是否进行下一步?", "提示", {
              type: "warning"
            }).then(() => {
              this.$router.replace({
                path: './addOrderThird',
                query: {
                  app_id: this.orderInfo.app_id,
                  ticket_id: this.orderInfo.ticket_id,
                  step: this.orderInfo.step,
                  operation: this.operation,
                  instance_id: this.orderInfo.instance_id,
                  step_id: this.orderInfo.ticket_step_id,
                  ticket_type: 2,//1:快速申请，2:蓝图定义
                  from: this.currentFrom,
                  ticket_num:this.ticket_num,
                  ticket_name:this.orderInfo.ticket_name,
                  service_name: this.service_name,
                },
              });
            }).catch(() => {

            });
          }
        });
      },
      collectApprove() {
        this.dialogTableVisible = true;
      },
      approveCancel() {
        this.dialogTableVisible = false;
      },
      tempEmit(type) {
        if (type === 1) {
          let param = {
            network_area: '电子银行区',
            network_type: '管理网',
            network_cidr: '172.30.126.0/24',
            service_uuid: 'CBCFEAA6-F572-4B76-884E-51FE5FAA72CC',
          };
          Bus.$emit('dispatchCanvasEvent', canvasEvent.network_event_1, param);
        } else if (type === 2) {
          this.updateEdgeIpData({
            source_uuid: 'B7314658-F91C-47CE-A05B-BB3F7E2C5F52',
            target_uuid: 'EBD3F59A-3D9E-4F84-A46E-226CE2F89DAC',
            ip: [],
          });
        } else if (type === 3) {
          Bus.$emit('dispatchCanvasEvent', canvasEvent.vmware_event_2, {
            service_uuid: '985BA688-4771-46EB-B33A-5D927F73E6DF',
            virtual_num: 2,
          });
        }
      },
    },
    watch: {
      'currentNodeData': {
        handler(val, oldVal) {
          this.lastNodeData = oldVal;
          if (!val) { this.serviceInfo = null; }
        },
        deep: true,
      },
      'serviceInfo': {
        handler(val, oldVal) {
          if (val) {
            this.formComponentInfo = {
              step: this.orderInfo.step,
              app_id: this.orderInfo.app_id,
              ticket_id: this.orderInfo.ticket_id,
              bus_id: this.orderInfo.bus_id,
              service_uuid: val.uuid,
              service_name: val.name,
              service_index: val.order,
              // operation_id_set: val.operationList,
            };
          } else {
            this.formComponentInfo = null;
          }
          console.log('this.formComponentInfo', this.formComponentInfo);
        },
        deep: true,
      },

    },
    components: {
      TemplateDialog,
      FormComponents,
      OperationDialog,
      Approval,
      ConfigDrawer,
      TemplateExportDialog
    },
  };
</script>

<style lang="less" scoped>
    .addOrderSecond {
        background-color: #ffffff;
        & > .header {
            @flex();
            height: 54px;
            border-bottom: 1px solid @g-border-color;
            .title {
                margin-left: 32px;
                font-size: 14px;
                font-weight: bold;
                color: @g-font-color-c
            }
        }
        & > .content {
            @flex();
            height: calc(100vh - 24px - 34px - 24px - 54px - 50px - 24px - 2px);
            .left-c {
                width: 200px;
                height: 100%;
                border-right: 1px solid @g-border-color;
                box-sizing: border-box;
                padding: 0 16px;
                & > .title {
                    @flex();
                    height: 54px;
                    font-weight: bold;
                }
                .service-list {
                    overflow-x: hidden;
                    overflow-y: auto;
                    max-height: calc(100vh - 24px - 32px - 24px - 54px - 50px - 24px - 100px);
                    &::-webkit-scrollbar {
                        display: none
                    }
                    & > li {
                        margin-top: 10px;
                        .group-head {
                            @flex();
                            justify-content: space-between;
                            height: 36px;
                            border-bottom: 1px solid @g-border-color;
                            transition: all 100ms;
                            .title {
                                color: @g-font-color-c;
                            }
                            .icon {
                                color: @g-font-color-n;
                                cursor: pointer;
                            }
                        }
                        .group-head:hover {
                            background-color: #f8f8fa;
                        }
                        .group-list {
                            @flex();
                            flex-wrap: wrap;
                            transition: all 400ms;
                            max-height: 0;
                            margin-bottom: 20px;
                            overflow: hidden;
                            &.expanded {
                                max-height: 2000px;
                            }
                            padding: 0 8px;
                            & > li {
                                margin-top: 16px;
                                width: 64px;
                                .icon-c {
                                    @flex();
                                    justify-content: center;
                                    width: 100%;
                                    height: 64px;
                                    background: rgba(255, 255, 255, 1);
                                    border-radius: 4px;
                                    border: 1px solid rgba(216, 222, 233, 1);
                                    overflow: hidden;
                                    cursor: pointer;
                                    & > img {
                                        width: 70%;
                                        height: 70%;
                                    }
                                    transition: all 100ms;
                                }
                                .icon-c:hover {
                                    box-shadow: 4px 4px 6px 0 rgba(0, 0, 0, 0.15);
                                }
                                .name {
                                    width: 100%;
                                    margin-top: 4px;
                                    font-size: 14px;
                                    text-align: center;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                }
                            }
                            & > li:nth-child(2n) {
                                margin-left: 22px;
                            }
                        }

                    }
                }

            }
            .right-c {
                flex: 1;
                height: 100%;
                .canvas-c {
                    height: 100%;
                    position: relative;
                    background-color: #ffffff;
                    /deep/ .canvas-view {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                    }
                    .toolbar-view {
                        @flex();
                        justify-content: center;
                        .toolbarList {
                            @flex();
                            & > li {
                                @flex();
                                justify-content: center;
                                width: 30px;
                                height: 30px;
                                border-top: 1px solid @g-border-color;
                                border-bottom: 1px solid @g-border-color;
                                border-right: 1px solid @g-border-color;
                                overflow: hidden;
                                button {
                                    @flex();
                                    justify-content: center;
                                    border: 0;
                                    outline: none;
                                    outline-width: 0;
                                    width: 100%;
                                    height: 100%;
                                    cursor: pointer;
                                    & > img {
                                        width: 16px;
                                        height: 16px;
                                    }

                                }
                                button.disabled {
                                    cursor: not-allowed;
                                    opacity: 0.4;
                                }
                                button:active {
                                    background-color: #f3f5e9 !important;
                                }
                            }
                            & > li.none {
                                width: 20px;
                                height: 0;
                                border: 0;
                            }
                        }
                    }
                    .component-view {
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        padding-right: 20px;
                        width: 100%;
                        height: 30%;
                        .component-view-header {
                            @flex();
                            position: relative;
                            height: 40px;
                            padding-right: 20px;
                            .point-c {
                                flex: 1;
                                text-align: center;
                            }
                            .btn-c {
                                @flex();
                                justify-content: space-between;
                                position: absolute;
                                right: 0;
                                width: 60px;
                                height: 100%;
                            }
                        }
                        .component-view-content {
                            position: relative;
                            height: calc(100% - 40px);
                        }
                    }

                }

            }
        }
        & > .footer {
            @flex();
            border-top: 1px solid @g-border-color;
            height: 50px;
            .btn-c {
                margin: 0 32px 0 auto;
            }
        }
        #node-c {
            @flex();
            border: 1px solid @g-font-color-c;
            background-color: #2db7f5;
            margin: 0;
            .icon {
                width: 25px;
                height: 25px;
                border-radius: 100%;
                background-color: cornsilk;
            }
            .value {
                width: 100px;
                height: 40px;
                margin-left: 20px;
                white-space: normal;
                word-break: break-all;
                overflow: hidden;
            }
        }
    }
</style>
