<template>
  <div class="applyServiceFirst">
    <div class="row" id="pdfDom">
      <div class="content">
        <div class="canvas-c" ref="canvas-c">
          <div class="service-show-c" ref="service-show-c">
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
    </div>
  </div>
</template>

<script>
//引入画布代码
import '@/commons/js/HT/ht-common.js';
import '@/commons/js/HT/ht-contextmenu.js';
import GraphView from '../../../../../ht/ddb-graphView';
import Toolbar from '../../../../../ht/ddb-toolbar';
import '../../../../../ht/ddb-config';

import FormComponents from "../../../components/formComponentDetail.vue";

import * as requestMethod from "@/modules/apps/api/applicationCenter/applicationSystem.js";
import * as requestMethodSecond from '@/modules/apps/api/applicationCenter/addOrder/addOrderSecond.js';

//引入API
export default {
  name: "applyServiceFirst",
  components: {
    FormComponents,
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
      currentNodeData: {
        name: "名称xxxxxxx"
      },
      currentNodeUuid: "",
      //表单相关
      formTitle: "Mysql-v1.0",
      activeNames: ["1"],
      serviceInfo: {},
      //相关参数数据
      orderInfo: {
        app_id: '',
        ticket_id: '',
        service_id: null,
      },
    };
  },
  created() {
    // start
    this.getOrderInfo()
  },
  mounted() {
    this.getCanvasIsLive();
    this.createCanvas();
    this.layoutCanvas();
    this.startCanvas()
    this.getClickData();
    // this.getCanvasData();
  },
  watch: {
    currentNodeUuid(val) {
      this.formComponentInfo.uuid = val
      console.log(this.formComponentInfo);
      console.log(val);
    }
  },
  methods: {
    // start
    getOrderInfo() {
      this.orderInfo.app_id = this.$route.query.app_id;
      this.orderInfo.ticket_id = this.$route.query.ticket_id;
      //获取订单类型：1:快速申请，2:蓝图定义
      console.log('this.orderInfo', this.orderInfo)
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
    changCanvasScreenRate(position) {
      this.canvas.mainView.setPosition(position);
    },
    getCanvasIsLive() {
      let param = {
        app_id: this.$route.query.app_id,
        ticket_id: this.$route.query.ticket_id,
        is_app_canvas: "0",
        canvas_type: "2"
      };
      requestMethod.getCanvasDataJg('get', param).then(res => {
        if (res.code === 200) {
          let canvas_json = res.data.canvas_text;
          if (canvas_json) {
            this.canvas.graphView.deserialize(canvas_json);
          }
        } else {
          this.$message(res.message)
        }
      });
    },
    getOriginServiceOperationList(service_id, uuid) {
      let param = {
        service_id: service_id,
        node_canvas_uuid: uuid,
      };
      return requestMethodSecond.getOriginServiceOperationList('get', param).then(res => {
        if (res.code === 200) {
          //this.operationList = res.data.set_list;
          //   this.serviceInfo = {
          //     uuid: this.currentNodeData.uuid,
          //     proType: this.currentNodeData.proType,
          //     operation: this.currentNodeData.operation,
          //     name: this.currentNodeData.name,
          //     order: res.data.node_index
          //   };
          this.formComponentInfo = {
            service_uuid: this.currentNodeData.uuid,
            app_id: this.$route.query.app_id,
            ticket_id: this.$route.query.ticket_id,
            service_name: this.currentNodeData.name,
            service_index: res.data.node_index,
          }
        }
      });
    },
    getClickData() {
      this.canvas.graphView.$graphView.addInteractorListener(e => {
        if (e.kind === "clickData") {
          console.log(e.data);
          this.getOriginServiceOperationList(e.data._attrObject.service_id, e.data._attrObject.uuid);
        }
      })
    },
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
    height: 600px;
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
