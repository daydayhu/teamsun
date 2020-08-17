<template>
  <div class="addOrderSecond">
    <div class="content">
      <div class="right-c">
        <empty-in-table v-if="isNoData"></empty-in-table>
        <div class="canvas-c" ref="canvas-c" v-else></div>
      </div>
    </div>
  </div>
</template>

<script>
//引入画布代码
import '@/commons/js/HT/ht-common.js';
import GraphView from '../ht/ddb-graphView';
import Toolbar from '../ht/ddb-toolbar';
import '../ht/ddb-config';
import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';

export default {
  data() {
    return {
      isNoIcon: false,
      // 画布相关属性
      editData: {},
      isUpload: false,
      paletteList: null,
      canvas: {
        palette: null,
        graphView: null,
        toolbar: null,
      },
      isNoData: false,
      currentNodeData: null,
      submitLoading: false,
      defaultIconUrl: require('@/commons/images/default_icon.svg'),
      dialogFormVisible: false
    };
  },
  created() {
    this.createCanvas();
  },
  mounted() {
    this.layoutCanvas();
    this.startCanvas();
    this.getCanvasData();
  },
  components: {
  },
  methods: {
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
      let topSpaceView = '';
      let topView = new ht.widget.SplitView(this.canvas.graphView.$graphView, topSpaceView, 'h', -10);
      topView.setDividerBackground('#E7EDF3');
      topView.setDragOpacity('1');
      topView.getView().className = 'canvas-view';
      // mainView.setDividerBackground('#E7EDF3');
      // mainView.setDragOpacity('1');
      // mainView.getView().className = 'canvas-view';
      // 3 注入容器
      containerDom.appendChild(topView.getView());
      this.canvas.graphView.$graphView.setEditable(false);
      // 4 布局变化事件监听
      topView.addViewListener(function (e) {
        if (e.kind === 'layout') {
          let splitP = mainView.getPosition();
          console.log('splitP', splitP);
        }
      });
    },
    // 启动画布
    startCanvas() {
      for (let component of Object.values(this.canvas)) { component.init(); }
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
        app_id: this.$route.query.app_id
      };
      requestMethod.getAppsArch('get', param).then(res => {
        if (res.code === 200) {
          let canvas_json = res.data.canvas_text;
          if (canvas_json) {
            this.isNoData = false;
            this.canvas.graphView.deserialize(canvas_json);
          } else {
            this.isNoData = true;
          }
        }
      });

    },
    //--------------------------------操作按钮--------------------------------------
  }
};
</script>

<style lang="less" scoped>
.addOrderSecond {
  background-color: #ffffff;
  .header {
    @flex();
    height: 64px;
    border-bottom: 1px solid @g-border-color;
  }
  .content {
    @flex();
    height: 800px;
    .left-c {
      width: 200px;
      height: 100%;
      border-right: 1px solid @g-border-color;
      box-sizing: border-box;
      padding: 0 16px 0 32px;
      & > .title {
        @flex();
        height: 54px;
        font-weight: bold;
      }
      .service-list {
        & > li {
          margin-top: 10px;
          .group-head {
            @flex();
            height: 36px;
            border-bottom: 1px solid @g-border-color;
          }
          .group-head:hover {
            background-color: #f8f8fa;
          }
          .group-list {
            @flex();
            flex-wrap: wrap;
            padding-top: 10px;
            & > li {
              margin: 8px 24px 0 8px;
              width: 56px;
              .icon-c {
                width: 100%;
                height: 56px;
                background: rgba(255, 255, 255, 1);
                border-radius: 4px;
                border: 1px solid rgba(216, 222, 233, 1);
                overflow: hidden;
                & > img {
                  width: 100%;
                  height: 100%;
                }
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
              margin: 8px 0 0 0;
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
        /deep/.canvas-view {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .component-view {
          position: absolute;
          bottom: 0;
          left: 0;
          background-color: #f8f8fa;
          width: 100%;
          height: 280px;
        }
      }
    }
  }
  .footer {
    @flex();
    border-top: 1px solid @g-border-color;
    height: 50px;
    .btn-c {
      margin: 0 32px 0 auto;
    }
  }
}
</style>
