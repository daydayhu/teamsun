<template>
    <div class="appDeployViewPage">
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
        </div>
    </div>
</template>

<script>
  import '@/commons/js/HT/ht-common.js';
  import GraphView from '../ht_new/ddb-graphView';
  import ToolbarList from '../ht_new/ddb-toolbarList';
  import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';
  export default {
    name: 'appDeployView',
    data() {
      return {
        toolbarList: [],
        canvas: {
          graphView: null,
        },
      }
    },
    created() {
      this.getToolbarList();
      this.createCanvas();
    },
    mounted() {
      this.layoutCanvas();
      this.startCanvas();
      this.getCanvasData();
    },
    methods: {
      // 创建画布
      createCanvas() {
        // 1.创建拓扑组件
        let graphView = new GraphView(this);
        // 2.生成canvas
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
        // 2.4 主视图配置视图样式
        topView.getView().className = 'canvas-view';
        // 3 注入容器
        containerDom.appendChild(topView.getView());
      },

      // 启动画布
      startCanvas() {
        for (let component of Object.values(this.canvas)) {
          if (typeof component.init === 'function') {
            component.init();
          }
        }
      },

      // 获取工具栏列表
      getToolbarList() {
        this.toolbarList = new ToolbarList().self;
      },

      // 获取画布数据
      getCanvasData(canvasJson) {
        if (canvasJson) {
          this.canvas.graphView.deserialize(canvasJson);
        }else {
          if (this.$route.query.app_id) {
            let app_id = this.$route.query.app_id;
            let param = { app_id };
            requestMethod.getAppDeploymentView('get', param).then(res => {
              if (res.code === 200) {
                let canvas_json = res.data.canva_data;
                if (canvas_json) {
                  this.canvas.graphView.deserialize(canvas_json);
                }
              }
            });
          }
        }
      },

      // 处理工具栏按钮事件
      handleToolBarEvent(item) {
        if (typeof item.onClicked === 'function') {
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

      // 保存画布信息
      saveCanvasData(data, status) {
        if (this.$route.query.app_id) {
          let app_id = this.$route.query.app_id;
          let {canvas_text, canvas_node_order} = data;
          let param = {
            app_id,
            canvas_text,
            canvas_node_order
          };
          requestMethod.saveAppDeploymentView('post', param).then(res => {
            if (res.code === 200) {
              if (status === 'show') {
                this.$message.success('保存成功');
              }
            }
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
    .appDeployViewPage {
        width: 100%;
        height: calc(100vh - 316px - 55px);
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
        }
    }
</style>
