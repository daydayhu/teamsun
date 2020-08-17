<template>
  <div>
    <div class="baseForm_content">
      <!-- ------------------------画布区域 --------------------->
      <!-- <div class="shadow"></div> -->
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
            <el-table ref="nodeData" :data="[]" v-loading="loading" style="width:100%">
              <el-table-column prop="date" label="服务实例"></el-table-column>
              <el-table-column prop="date" label="依赖服务实例"></el-table-column>
              <el-table-column prop="date" label="操作名称"></el-table-column>
              <el-table-column prop="date" label="时间窗口"></el-table-column>
              <el-table-column prop="date" label="启动策略"></el-table-column>
              <el-table-column prop="date" label="交付负责人"></el-table-column>
              <el-table-column prop="date" label="复核人"></el-table-column>
              <el-table-column prop="date" label="复核策略"></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <div class="baseForm_footer">
      <el-button type="primary" @click="onBack">上一步：部署视图</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import '@/commons/js/HT/ht-common.js';
import GraphView from './ht/ddb-graphView';
import Toolbar from './ht/ddb-toolbar';
import './ht/ddb-config';
import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';

export default {
  name: "addOrderThird",
  data() {
    return {
      loading: false,
      paletteList: null,
      canvas: {
        palette: null,
        graphView: null,
        toolbar: null,
      },
    };
  },
  created() {
    //---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
//---------------------------------------已废弃！！！！！！-------------------------------------
    this.$emit("stepChange", 2)
    this.createCanvas();
  },
  mounted() {
    this.layoutCanvas();
    this.startCanvas();
    this.getCanvasData();
  },
  methods: {
    changCanvasScreenRate(position) {
      this.canvas.mainView.setPosition(position);
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
      let containerDom = this.$refs['canvas-c'];
      // 3 创建视图
      let rightMainView = new ht.widget.SplitView(this.canvas.toolbar.$toolbar, this.canvas.graphView.$graphView, 'v', 40);

      //let rightMainView = new ht.widget.SplitView(this.canvas.toolbar.$toolbar, this.canvas.graphView.$graphView, 'v', 40);
      let rightFooterView = this.$refs['service-show-c'];
      let rightView = new ht.widget.SplitView(this.canvas.graphView.$graphView, rightFooterView, 'v', -280);
      // 5 样式配置
      rightMainView.setDividerBackground('#E7EDF3');
      rightMainView.setDragOpacity('1');
      rightMainView.setDraggable(false);
      rightMainView.getView().style.backgroundColor = '#fff';
      this.canvas.graphView.$graphView.getView().style.backgroundColor = '#fff';

      rightView.setDividerBackground('#E7EDF3');
      rightView.setDragOpacity('1');
      rightView.getView().className = 'canvas-style-c';
      // 6 注入容器
      containerDom.appendChild(rightView.getView());
      this.canvas.graphView.$graphView.setEditable(false);
      this.canvas.mainView = rightView;
      // 4 布局变化事件监听
      rightView.addViewListener(function (e) {
        if (e.kind === 'layout') {
          let splitP = mainView.getPosition();
          console.log('splitP', splitP);
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
        })
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
      })
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
      })
    },
    getCanvasData() {
      let param = {
        component_id: 30
      };
      requestMethod.getCanvasData('get', param).then(res => {
        if (res.code === 200) {
          let canvas_json = res.data.canvas_json;
          if (canvas_json) {
            this.canvas.graphView.deserialize(canvas_json);
            this.canvas.graphView.updateAllNodeUUidFromCanvas();
          }
        }
      });
    },
    changeSize(val) {
      switch (val) {
        case 1:
          this.$refs["service-show-c"].style.top = "";
          this.$refs["service-show-c"].style.bottom = "0";
          this.$refs["service-show-c"].style.height = "280px";
          break;
        case 2:
          this.$refs["service-show-c"].style.top = "";
          this.$refs["service-show-c"].style.bottom = "0";
          this.$refs["service-show-c"].style.height = "400px";
          break;
        case 3:
          this.$refs["service-show-c"].style.top = "";
          this.$refs["service-show-c"].style.bottom = "0";
          this.$refs["service-show-c"].style.height = "500px";
          break;
        default:
      }
    },
    //上一步
    onBack() {
      this.$emit("stepChange", 1)
      this.$router.push({
        path: '/applicationCenter/serviceCatalog/applyService/applyServiceFirst',
        //query:{res:this.theid}
      })
    },
    //提交事件
    onSubmit() {

    },
    //保存事件
    onSave() { }

  }
};
</script>

<style lang="less" scoped>
.shadow {
  width: 90%;
  height: 480px;
  position: fixed;
  top: 110px;
  z-index: 100;
}
.baseForm_content {
  height: 700px;
  padding: 0px;
}
.form-show {
  width: 98%;
  height: 300px;
  transition: height 0.5s;
  border: 1px solid #ccc;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  .operate-button {
    width: 100px;
    height: 30px;
    float: right;
    span {
      border: 1px solid red;
    }
  }
}
.canvas-c {
  @flex();
  height: 100%;
  position: relative;
  /deep/ .canvas-style-c {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    + div {
      height: 100%;
    }
  }
  .service-show-c {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #ffffff;
    transition: height 0.5s;
    z-index: 100;
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
        right: 10px;
        width: 60px;
        height: 100%;
      }
    }
    /*padding-left: 200px;*/
    // height: 280px;
    .operate-button {
      width: 100px;
      height: 30px;
      float: right;
      span {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #343952;
      }
      span:nth-child(1) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 70%,
          transparent 70%,
          transparent 100%
        );
      }
      span:nth-child(2) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 50%,
          transparent 50%,
          transparent 100%
        );
      }
      span:nth-child(3) {
        background-image: linear-gradient(
          top,
          #343952,
          #343952 30%,
          transparent 30%,
          transparent 100%
        );
      }
    }
    .header-c {
      @flex();
      height: 50px;
      border: 1px solid @g-border-color;
      padding-left: 24px;
      .title {
        font-size: 14px;
      }
    }

    .table-c {
      padding: 15px 15px 60px 15px;
      position: relative;
      z-index: 99;
      height: 100%;
      overflow: auto;
      .deliver-order-c {
        @flex();
        height: 50px;
        .name {
          font-size: 12px;
        }
        .order-val {
          margin-left: 4px;
          font-size: 14px;
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
    }
  }
}
.baseForm_footer {
  text-align: right;
  padding-right: 10px;
}
</style>
