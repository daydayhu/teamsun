<template>
  <div class="applyServiceFirst">
    <div class="row ts-content-form" id="pdfDom">
      <div class="header">
        <span>部署视图</span>
        <div class="save" @click="saveCanvasData">
          <span>保存</span>
          <svg-icon icon-class="save" class="operat-icon"></svg-icon>
        </div>
      </div>
      <div class="content">
        <div class="canvas-c" ref="canvas-c">
          <div class="service-show-c" ref="service-show-c" v-show="currentNodeData">
            <div class="component-view-header">
              <div class="point-c">▪︎ ▪︎ ▪︎</div>
              <div class="btn-c">
                <el-button type="text" @click="changCanvasScreenRate(0.75)">
                  <svg-icon icon-class="screen_x"></svg-icon>
                </el-button>
                <el-button type="text" @click="changCanvasScreenRate(0.5)">
                  <svg-icon icon-class="screen_z"></svg-icon>
                </el-button>
                <el-button type="text" @click="changCanvasScreenRate(0)">
                  <svg-icon icon-class="screen_d"></svg-icon>
                </el-button>
              </div>
            </div>
            <div class="table-c">
              <FormComponents :formComponentInfo="formComponentInfo"></FormComponents>
            </div>
          </div>
        </div>
      </div>
      <!-- ------------------------底部区域 --------------------->
      <div class="footer">
        <div class="btn-c">
          <el-button @click="onCancal">取消</el-button>
          <el-button @click="onPrevious">上一步：基本信息</el-button>
          <el-button @click="onSubmit" :type="(+orderInfo.step === stepSet.collect_approval || +orderInfo.step === stepSet.plan_approval)?'':'primary'">下一步：交付计划</el-button>
          <el-button type="primary" v-if="+orderInfo.step === stepSet.collect_approval || +orderInfo.step === stepSet.plan_approval" @click="collectApprove">审 批</el-button>
        </div>
      </div>
      <Approval v-if="dialogTableVisible" :dialog-table-visible="dialogTableVisible" @approveCancel="approveCancel" :instance_id="+orderInfo.instance_id" :ticket_id="+orderInfo.ticket_id"
        :operation="'edit'" :app_id="+orderInfo.app_id" :from="'app'"></Approval>
    </div>
    <Approval v-if="dialogTableVisible" :dialog-table-visible="dialogTableVisible" @approveCancel="approveCancel" :instance_id="+orderInfo.instance_id" :ticket_id="+orderInfo.ticket_id"
      :operation="'edit'" :app_id="+orderInfo.app_id" :from="currentFrom"></Approval>
  </div>
</template>

<script>
//引入画布代码
import "@/commons/js/HT/ht-common.js";
//import Palette from '@/commons/ht/ddb-palette'
import GraphView from "./ht/ddb-graphView";
import Toolbar from "./ht/ddb-toolbar";
import "./ht/ddb-config";

import FormComponents from "../../../components/formComponentContent.vue";
import Approval from "./../../../applicationSystem/addOrder/addOrderFirst/components/approval.vue"
import * as requestMethod from "@/modules/apps/api/applicationCenter/applicationSystem.js";
import * as requestMethodOlder from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';
import { Bus, canvasEvent } from '@/modules/apps/bus/form.bus.js';

//引入API
//import * as requestMethod from "../../../../../api/applicationCenter/applicationSystem"
export default {
  name: "applyServiceFirst",
  components: {
    FormComponents,
    Approval
  },
  data() {
    return {
      htmlTitle: '页面导出PDF文件名',  //这个也是固定写法，pdf文件下载的名称
      canvas: {
        // palette: null,
        graphView: null,
        toolbar: null
      },
      formComponentInfo: null,
      currentNodeData: null,
      currentNodeUuid: "",
      //表单相关
      formTitle: "Mysql-v1.0",
      activeNames: ["1"],
      //相关参数数据
      orderInfo: {
        app_id: '',
        ticket_id: '',
        bus_id: '',
        step: '',
        instance_id: '',
        ticket_step_id: '',
        service_id: null,
        ticket_name:''
      },
      stepSet: {
        collect: 1, // 需求收集
        collect_approval: 2, // 需求收集审批
        plan: 3, // 资源规划
        plan_approval: 4, // 资源规划审批
        deploy: 5 // 资源部署
      },
      //从哪个页面跳转而来的所有可能情况
      from:{
        'service':'/applicationCenter/serviceCatalog',
        'order':'/applicationCenter/myOrder',
        'app':'/applicationCenter/applicationSystem'
      },
      //当前从哪个页面跳转而来
      currentFrom:'',
      current_ticket_id: null,
      isLive: false,
      dialogTableVisible: false,
      service_name: '',
      //approvalFrom: '',
      ticket_num: '',
    };
  },
  created() {
    this.$emit("changeStep", 1);
    // start
    this.getOrderInfo()
  },
  mounted() {
    this.getCanvasIsLive();
    this.createCanvas();
    this.layoutCanvas();
    this.startCanvas()
    this.getClickData();
    this.startBusMonitor();
    // this.getCanvasData();
  },
  watch: {
    currentNodeUuid(val) {
      this.formComponentInfo.uuid = val;
      console.log('this.formComponentInfo',this.formComponentInfo);
    }
  },
  methods: {
    // start
    getOrderInfo() {
      this.orderInfo.app_id = this.$route.query.app_id;
      this.orderInfo.ticket_id = this.$route.query.ticket_id;
      this.orderInfo.bus_id = this.$route.query.bus_id;
      this.orderInfo.step = this.$route.query.step;
      this.orderInfo.instance_id = this.$route.query.instance_id;
      this.orderInfo.ticket_step_id = this.$route.query.step_id;
      this.orderInfo.service_id = this.$route.query.service_id
      this.currentFrom = this.$route.query.from
      this.ticket_num = this.$route.query.ticket_num
      this.orderInfo.ticket_name = this.$route.query.ticket_name
      //获取订单类型：1:快速申请，2:蓝图定义
      this.orderInfo.ticket_type = this.$route.query.ticket_type
      console.log('this.orderInfo', this.orderInfo)
      //当是新增，并且新增的是快速服务申请时：
      if (this.orderInfo.ticket_type == 1) {
        this.service_name = this.$route.query.service_name
        //修改页面标题
        this.$emit("changeTitle", this.service_name,this.orderInfo.ticket_name)
      } else {
        //蓝图定义时
        //修改页面标题
        this.$emit("changeTitle", Number(this.orderInfo.step), this.orderInfo.ticket_name)
      }

    },
    //--------------------------------画布相关--------------------------------------
    // 创建画布
    createCanvas() {
      // 1.创建拓扑组件
      let graphView = new GraphView(this);

      // 2.创建工具栏
      let toolbar = new Toolbar(this);

      // 3.生成canvas
      this.canvas = { graphView, toolbar };
    },
    // 布局画布
    layoutCanvas() {
      // 1 获取画布容器
      let containerDom = this.$refs["canvas-c"];
      // 3 创建视图
      let rightMainView = new ht.widget.SplitView(
        this.canvas.toolbar.$toolbar,
        this.canvas.graphView.$graphView,
        "v",
        40
      );
      let rightFooterView = this.$refs["service-show-c"];
      let rightView = new ht.widget.SplitView(
        this.canvas.graphView.$graphView,
        rightFooterView,
        "v",
        -280
      );
      // 5 样式配置
      rightMainView.setDividerBackground("#E7EDF3");
      rightMainView.setDragOpacity("1");
      rightMainView.setDraggable(false);
      rightMainView.getView().style.backgroundColor = "#fff";
      rightView.setDividerBackground("#E7EDF3");
      rightView.setDragOpacity("1");
      rightView.getView().className = "canvas-style-c";
      // 6 注入容器
      containerDom.appendChild(rightView.getView());
      this.canvas.graphView.$graphView.setEditable(false);
      this.canvas.mainView = rightView;
      // 4 布局变化事件监听
      rightView.addViewListener(function (e) {
        if (e.kind === "layout") {
          let splitP = mainView.getPosition();
          console.log("splitP", splitP);
        }
      });
    },
    // 启动画布
    startCanvas() {
      for (let component of Object.values(this.canvas)) {
        if (component.init) {
          component.init();
        }
      }
    },
    // 注册图元icon
    registerNodeIcon() {
      for (let group of Object.values(this.paletteList)) {
        group.items.forEach(node => {
          if (node && node.image) {
            ht.Default.setImage(`${node.name}-${node.id}`, node.image);
          }
        });
      }
    },
    // 拖拽时元素数据注入
    elementDragStart(e, node, key) {
      e.dataTransfer.setData("nodeId", node.id);
      e.dataTransfer.setData("groupKey", key);
    },
    // 添加图元到画布
    addNodeForCanvas(node) {
      return new Promise((resolve, reject) => {
        let res = { code: 200 };
        let err = null;
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    },

    // 删除图元从画布
    deleteNodeFromCanvas() {
      return new Promise((resolve, reject) => {
        let res = { code: 200 };
        let err = null;
        if (res) {
          resolve(res);
        } else {
          reject(err);
        }
      });
    },
    changCanvasScreenRate(position) {
      this.canvas.mainView.setPosition(position);
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
    getCanvasData() {
      let param = {
        component_id: this.$route.query.service_id,
      };
      requestMethod.componentsCanvas('get', param).then(res => {
        if (res.code === 200) {
          console.log(res);
          let canvas_json = res.data.canvas_json;
          if (canvas_json) {
            this.canvas.graphView.deserialize(canvas_json);
            //this.canvas.graphView.updateAllNodeUUidFromCanvas();
          }
        } else {
          this.$message(res.message)
        }
      });
    },
    // 保存画布关联关系
    saveCanvasRelation(data) {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        relations: {
          group: data.group,
          edge: data.edge
        }
      };
      console.log('param Relation: ', JSON.stringify(param));
      requestMethodOlder.saveCanvasRelation('post', param).then(res => {
        return res
      });
    },
    //保存事件
    saveCanvasData() {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        "is_app_canvas": 0,
        "canvas_type": 2,
        "canvas_text": JSON.parse(JSON.stringify(this.canvas.graphView.$graphView.dm().serialize()))
      };
      requestMethod.getCanvasDataJg('post', param).then(res => {
        if (res.code === 200) {
          this.$message.success("保存成功")
        } else {
          this.$message.error(res.message)
        }
      });
    },
    //取消事件
    onCancal(){
      // if(this.currentFrom === "service"){
      //   this.$router.push({
      //     path: '/applicationCenter/myOrder?menu_id=1044'
      //   });
      // }else{
      //     history.back()
      // }
      history.back()
    },
    //上一步事件
    onPrevious() {
      this.$router.replace({
        path: '/applicationCenter/applicationSystem/addOrder/addOrderFirst',
        query: {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          step: this.orderInfo.step,
          operation: 'edit',
          ticket_type: 1,//1:快速申请，2:蓝图定义
          step_id: this.orderInfo.ticket_step_id,
          service_name: this.service_name,
          from: this.currentFrom,
          ticket_num: this.ticket_num,
          ticket_name:this.orderInfo.ticket_name
        }
      })
    },
    onSubmit() {
      this.$emit("changeStep", 1);
      this.$router.replace({
        path: '/applicationCenter/applicationSystem/addOrder/addOrderThird',
        query: {
          app_id: this.orderInfo.app_id,
          ticket_id: this.orderInfo.ticket_id,
          step: this.orderInfo.step,
          instance_id: this.orderInfo.instance_id,
          ticket_type: 1,//1:快速申请，2:蓝图定义,
          step_id: this.orderInfo.ticket_step_id,
          service_name: this.service_name,
          from: this.currentFrom,
          ticket_num: this.ticket_num,
          ticket_name: this.orderInfo.ticket_name
        }
      })
    },
    collectApprove() {
      this.dialogTableVisible = true
    },
    approveCancel() {
      this.dialogTableVisible = false
    },
    getCanvasIsLive() {
      let param = {
        ticket_id: this.$route.query.ticket_id,
        component_id: this.$route.query.service_id
      };
      requestMethod.getCanvasIsLive('get', param).then(res => {
        if (res.code === 200) {
          this.isLive = res.data.is_created;
          if (res.data.canvas_json) {
            this.canvas.graphView.deserialize(res.data.canvas_json);
          }
        } else {
          this.$message(res.message)
        }
      });
    },
    getClickData() {
      this.canvas.graphView.$graphView.addInteractorListener(e => {
        if (e.kind === "clickData") {
          console.log(e.data);
          this.formComponentInfo = {
            service_uuid: e.data._attrObject.uuid,
            app_id: this.$route.query.app_id,
            ticket_id: this.$route.query.ticket_id,
            bus_id: this.$route.query.bus_id,
            step: this.$route.query.step
          }
        }
      })
    },
    quick_group_services(arr) {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        // app_id: 43,
        // ticket_id: 33,
        data_info: {
          component_id: this.$route.query.service_id,
          base_service_infos: arr
        }
      };
      return requestMethod.quick_group_services("post", param).then(res => {
        return res
      });
    },

    // quick_group_services(arr) {
    //   let param = {
    //     app_id: this.$route.query.app_id,
    //     ticket_id: this.$route.query.ticket_id,
    //     // app_id: 43,
    //     // ticket_id: 33,
    //     data_info: {
    //       component_id: this.$route.query.service_id,
    //       base_service_infos: arr
    //     }
    //   };
    //   return requestMethod.quick_group_services("post", param).then(res => {
    //     return res
    //   });
    // }
    //下一步提交
    /* async onSubmit() {
      var saveMess= await this.$refs.theChild[0].saveData();
      if(saveMess.flag==true){
        console.log(saveMess,'saveMess');
        this.$message.success(`${saveMess.mess}`);
        this.$emit("stepChange",1)
        this.$router.push({
          path: '/applicationCenter/serviceCatalog/applyService/applyServiceSecond',
          query:{res:saveMess.data}
        })
      }else{
        this.$message.error(`${saveMess.mess}`);
      }
    }, */
  }
};
</script>

<style lang="less" scoped>
.applyServiceFirst {
  background-color: #ffffff;
  .header {
    width: 100%;
    line-height: 30px;
    overflow: hidden;
    padding: 10px 20px;
    border-bottom: 1px solid #e7edf3;
    margin-bottom: 4px;
    span {
      float: left;
    }
    .save {
      float: right;
    }
  }
  .theFooter {
    @flex();
    border-top: 1px solid @g-border-color;
    height: 50px;
    .btn-c {
      margin: 0 32px 0 auto;
    }
  }
  .content {
    @flex();
    height: 800px;
    .canvas-c {
      height: 100%;
      flex: 1;
      position: relative;
      background-color: #ffffff;
      /deep/.canvas-style-c {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .service-show-c {
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
        .table-c {
          position: relative;
          height: calc(100% - 40px);
        }
      }
    }
  }
}
</style>
