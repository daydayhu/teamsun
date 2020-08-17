<template>
  <div class="serviceConfigPage">
    <div class="ts-content-wrap">
      <div class="canvas-c" ref="canvas-c"></div>
    </div>
  </div>
</template>

<script>

import * as requestMethod from '@/modules/ops/api/operationsCenter/productManage/productDesign.js';
import * as requestMethodFromBase from '@/modules/rbac/api/systemConfig/baseData.js';

import '@/commons/js/HT/iwewdRmhQ3Q2.js'; // 许可证文件
import '@/commons/js/HT/ht.js';  // hightopo核心文件
import '@/commons/js/HT/product_generated.js'; // 生成图元必要文件

// import CreateNodeInteractor from '@/commons/js/HT/interactor/create-node-interactor';
// import CreateEdgeInteractor from '@/commons/js/HT/interactor/create-edge-interactor';
// import CreateShapeInteractor from '@/commons/js/HT/interactor/create-shape-interactor';

/*
*  画布组件需求分析
*  1.基本图元，节点、线、锚点
*  2.组，作为父容器包裹图元
*  3.分割面板组件、分割面板组件--用于实现整体布局
*  4.工具条
*  5.组件面板--用于实现侧边栏，由多个组组成
*
* */

/*
* 1.网络栅格
* 2.动态图元
* 3.线条
*
*
* */
export default {
 
  data() {
    return {
      serviceId: '',
      statusSet: {
        add: '新建服务',
        edit: '编辑服务',
      },
      step: 1,
      formLabelWidth: '150px',
      labelPosition: 'right',
      stepsList: [
        {
          step: 1,
          name: '基本信息',
        },
        {
          step: 2,
          name: '服务配置',
        },
      ],
      currentOperation: '',
      submitLoading: false,

      // 画布相关属性
      palette: null,
      paletteList: {
        operation: {
          name: '云服务器',
          items: [
            {
              id: '01',
              name: '虚拟机',
              image: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
              draggable: true,
              proType: 1, // 1 主产品  2 附加产品
            },
            {
              id: '02',
              name: '金属裸机',
              image: '',
              draggable: true,
              proType: 2, // 1 主产品  2 附加产品
            },
          ],
        },
        web: {
          name: 'Web',
          items: [
            {
              id: '03',
              name: 'Apache',
              image: '',
              draggable: true,
              proType: 1, // 1 主产品  2 附加产品
            },
            {
              id: '04',
              name: 'Nginx',
              image: '',
              draggable: true,
              proType: 2, // 1 主产品  2 附加产品
            },
          ],
        },
      },
      graphView: null,
      paletteDM: null,
      graphDM: null,
      defaultIconUrl: require('@/commons/images/default_icon.svg'),
      currentClickNode: '',
      proTypeSet: {
        main: 1, // 主产品
        affiliate: 2, // 附加产品
      },
    };
  },
  created() {
    //this.getServiceStatus();
  },
  mounted() {
    this.createCanvas();
    this.resetGraphLayout();
  },
  methods: {
    // 创建画布
    createCanvas() {
      // 0.初始化默认HT
      this.initHtDefault();

      // 1.创建拓扑组件
      let graphView = new ht.graph.GraphView();
      this.graphView = graphView;
      this.graphDM = graphView.getDataModel();
      let containerDom = this.$refs['canvas-c'];
      // 4.5注入容器
      let view = graphView.getView();
      view.className = 'canvas-style-c';
      containerDom.appendChild(view);

      // 5.构建底层网络
      graphView.addBottomPainter(new ht.graph.GridPainter(graphView));

      // 6.初始化拓扑组件事件
      this.initGraphEvents(graphView);
      //graphView.setEditable(true);
    },

    initHtDefault() {
      ht.Default.setImage('toArrow', {
        width: 30,
        height: 20,
        comps: [
          {
            type: 'shape',
            points: [5, 2, 10, 10, 5, 18, 20, 10],
            closePath: true,
            background: '#d8d8d8',
            borderWidth: 0.4,
            borderColor: '#d8d8d8',
          },
        ],
      });
      ht.Default.setImage('fromArrow', {
        width: 6,
        height: 6,
        comps: [
          {
            type: 'circle',
            background: '#d8d8d8',
          },
        ],
      });
      ht.Default.setImage('defaultIcon', this.defaultIconUrl);
    },
    createPalette() {
      // 初始化面板
      let palette = new ht.widget.Palette(),
        dataModel = palette.getDataModel();
      this.palette = palette;

      // 创建面板组
      for (let groupData of Object.values(this.paletteList)) {
        let group = this.createGroup(groupData, dataModel, true);
        groupData.items.forEach(item => {
          this.createNode(item, group, dataModel);
        });
      }

      // 配置面板样式
      palette.setItemImageWidth(50); // 设置按钮元素宽度
      palette.setItemImageHeight(50);// 设置按钮元素高度
      palette.setItemMargin(32); // 设置元素之间间距
      palette.setItemImagePadding(4); // 设置按钮元素图片与边框的距离

      return palette;
    },
    createToolbar(graphView) {
      let btnIconColor = 'rgb(159, 159, 159)',
        btnSelectColor = 'rgb(231, 231, 231)',
        btBgColor = '#fff';

      let fp = new ht.widget.FormPane();
      let g2d = graphView;

      // 工具栏样式配置
      fp.setVGap(0); // 表单组件垂直间距
      fp.setHGap(0); // 表单组件水平间距
      fp.setHPadding(0); // 设置表单左边和右边与组件内容的间距，默认值为8
      fp.setVPadding(5); // 设置表单顶部和底部与组件内容的间距，默认值为8
      fp.setRowHeight(40) // 设置表单行高
      // fp.getView().style.backgroundColor = '#fff';

      // 工具栏初始化
      // @param { items, widths, height, params }
      fp.addRow(
        [
          '',
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/select.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              togglable: true,
              groupId: 't',
              selected: true,
              toolTip: '选择',
              onClicked: () => {
                g2d.setEditable(false);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/zoom-in.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              toolTip: '放大',
              onClicked: () => {
                g2d.zoomIn(true);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/zoom-out.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              toolTip: '缩小',
              onClicked: () => {
                g2d.zoomOut(true);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/proportion.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              toolTip: '1:1',
              onClicked: () => {
                g2d.setZoom(1, true);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/full-screen.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              toolTip: '纵览',
              onClicked: () => {
                g2d.fitContent(true);
              },
            },
          },
          '',
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/node.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              togglable: true,
              groupId: 't',
              toolTip: '节点',
              onClicked: () => {
                g2d.setInteractors([
                  new ht.graph.DefaultInteractor(g2d),
                  new ht.graph.TouchInteractor(g2d, {
                    selectable: false,
                  }),
                  new CreateNodeInteractor(g2d),
                ]);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/line.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              togglable: true,
              groupId: 't',
              toolTip: '直线',
              onClicked: () => {
                g2d.setInteractors([
                  new ht.graph.DefaultInteractor(g2d),
                  new ht.graph.TouchInteractor(g2d, {
                    selectable: false,
                  }),
                  new CreateEdgeInteractor(g2d),
                ]);
              },
            },
          },
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/right-angle.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              togglable: true,
              groupId: 't',
              toolTip: '直角线',
              onClicked: () => {
                g2d.setInteractors([
                  new ht.graph.DefaultInteractor(g2d),
                  new ht.graph.TouchInteractor(g2d, {
                    selectable: false,
                  }),
                  new CreateEdgeInteractor(g2d, 'h.v'),
                ]);
              },
            },
          },
          '',
          {
            button: {
              background: btBgColor,
              icon: require('@/commons/icons/ht/export.json'),
              iconColor: btnIconColor,
              selectBackground: btnSelectColor,
              toolTip: '导出',
              onClicked: () => {
                var doc = window.open().document;
                doc.open();
                doc.write('<pre>' + g2d.dm().serialize() + '</pre>');
                doc.close();
                doc.body.style.margin = '0';
                doc.title = 'Export JSON at ' + new Date();
              },
            },
          }, ''], [0.1, 36, 36, 36, 36, 36, 20, 36, 36, 36, 20, 36, 0.1], 30);

      return fp;
    },
    initGraphEvents(graphView) {
      this.addEventListener(graphView);
      this.addInteractorListener(graphView);
    },
    addEventListener(graphView) {
      // 监听组件拖拽事件
      // 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
      graphView.getView().addEventListener('dragover', function (e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
      });
      // 在一个拖动过程中，释放鼠标键时触发此事件
      graphView.getView().addEventListener('drop', (e) => {
        let palette = this.palette,
          proTypeSet = this.proTypeSet,
          dataModel = this.graphDM;
        e.preventDefault();
        e.stopPropagation();
        let nodeId = e.dataTransfer.getData('Text').replace(/nodeid:/g, '');
        if (nodeId) {
          let paletteNode = palette.dm().getDataById(nodeId),
            lp = graphView.lp(e);
          if (paletteNode) {
            let gNode = this.paletteNodeMapGraphNode(paletteNode);
            switch (paletteNode.a('proType')) {
              case proTypeSet.main:
                let gGroup = this.createGraphGroup();
                gGroup.addChild(gNode);
                gGroup.p(lp.x, lp.y);
                dataModel.add(gNode);
                dataModel.add(gGroup);
                break;
              case proTypeSet.affiliate:
                dataModel.add(gNode);
                gNode.p(lp.x, lp.y);
                this.currentClickNode = gNode;
                // 添加节点到组
                this.addNodeToGroup(graphView);
                break;
              default:
                break;
            }
          }
        }
      });
    },
    isRectContains(targetRect, moveRect) {
      console.log('targetRect', targetRect);
      console.log('moveRect', moveRect);
      return moveRect.x > targetRect.x &&
        moveRect.y > targetRect.y &&
        (moveRect.x + moveRect.width) < (targetRect.x + targetRect.width) &&
        (moveRect.y + moveRect.height) < (targetRect.y + targetRect.height);
    },
    addInteractorListener(graphView) {
      graphView.addInteractorListener(e => {
        if (e.kind === 'endMove') {
          this.addNodeToGroup(graphView);
        }
        else if (e.kind === 'clickData') {
          this.currentClickNode = e.data;
          console.log('点击图元', this.currentClickNode)
        }
        else if (e.kind === 'onUp') {
          console.log('在图元处放开');
        }
        else if (e.kind === 'onEndDrag') {
          console.log('图元结束拖拽');
        }
        else if (e.kind === 'doubleClickData') {
          console.log(e.data + '被双击');
        }
        else if (e.kind === 'clickBackground') {
          console.log('单击背景');
        }
        else if (e.kind === 'doubleClickBackground') {
          console.log('双击背景');
        }
        else if (e.kind === 'beginRectSelect') {
          console.log('开始框选图元');
        }
        else if (e.kind === 'betweenRectSelect') {
          console.log('正在框选图元');
        }
        else if (e.kind === 'endRectSelect') {
          console.log('结束框选图元');
        }
        else if (e.kind === 'beginMove') {
          console.log('开始移动图元');
        }
        else if (e.kind === 'betweenMove') {
          console.log('正在移动图元');
        }
        else if (e.kind === 'endMove') {
          console.log('结束移动图元');
        }
        else if (e.kind === 'beginPan') {
          console.log('开始手抓图平移');
        }
        else if (e.kind === 'betweenPan') {
          console.log('正在手抓图平移');
        }
        else if (e.kind === 'endPan') {
          console.log('结束手抓图平移');
        }
        else if (e.kind === 'beginEditRect') {
          console.log('开始编辑图元大小和位置');
        }
        else if (e.kind === 'betweenEditRect') {
          console.log('正在编辑图元大小和位置');
        }
        else if (e.kind === 'endEditRect') {
          console.log('结束编辑图元大小和位置');
        }
        else if (e.kind === 'beginEditPoint') {
          console.log('开始编辑多边形Shape或多点Edge的具体点');
        }
        else if (e.kind === 'betweenEditPoint') {
          console.log('正在编辑多边形Shape或多点Edge的具体点');
        }
        else if (e.kind === 'endEditPoint') {
          console.log('结束编辑多边形Shape或多点Edge的具体点');
        }
        else if (e.kind === 'beginEditRotation') {
          console.log('开始旋转图元');
        }
        else if (e.kind === 'betweenEditRotation') {
          console.log('正在旋转图元');
        }
        else if (e.kind === 'endEditRotation') {
          console.log('结束旋转图元');
        }
        else if (e.kind === 'moveLeft') {
          console.log('左方向键左移图元一个像素');
        }
        else if (e.kind === 'moveRight') {
          console.log('右方向键右移图元一个像素');
        }
        else if (e.kind === 'moveUp') {
          console.log('上方向键上移图元一个像素');
        }
        else if (e.kind === 'moveDown') {
          console.log('下方向键下移图元一个像素');
        }
        else if (e.kind === 'toggleNote') {
          console.log('切换note标注的展开合并');
        }
        else if (e.kind === 'toggleNote2') {
          console.log('切换note2标注的展开合并');
        }
        else if (e.kind === 'beginEditPoints') {
          console.log('开始进入曲线的点编辑状态');
        }
        else if (e.kind === 'endEditPoints') {
          console.log('结束曲线的点编辑状态');
        }
        else if (e.kind === 'hover') {
          console.log('鼠标停留');
        }
        else if (e.kind === 'onClick') {
          console.log('单击图元');
        }
        else if (e.kind === 'onDoubleClick') {
          console.log('双击图元');
        }
        else if (e.kind === 'onContextMenu') {
          console.log('右击图元');
        }
        else if (e.kind === 'onDown') {
          console.log('在图元处按下');
        }
        else if (e.kind === 'onUp') {
          console.log('在图元处放开');
        }
        else if (e.kind === 'onMove') {
          console.log('鼠标在图元上移动');
        }
        else if (e.kind === 'onEnter') {
          console.log('鼠标进入图元');
        }
        else if (e.kind === 'onHover') {
          console.log('鼠标在图元上悬停');
        }
        else if (e.kind === 'onLeave') {
          console.log('鼠标离开图元');
        }
        else if (e.kind === 'onBeginDrag') {
          console.log('图元开始拖拽');
        }
        else if (e.kind === 'onDrag') {
          console.log('图元拖拽');
        }
        else if (e.kind === 'onUp') {
          console.log('在图元处放开');
        }
        else if (e.kind === 'onEndDrag') {
          console.log('图元结束拖拽');
        }
        else if (e.kind === 'onScroll') {
          console.log('鼠标图元上滚动');
        }
      });
    },
    addNodeToGroup(graphView) {
      let proTypeSet = this.proTypeSet;
      let isRectContains = this.isRectContains;
      let currentClickNode = this.currentClickNode;
      if (currentClickNode.a('proType') === proTypeSet.affiliate && !currentClickNode.getParent()) {
        let cRect = currentClickNode.getRect();
        graphView.each(data => {
          if (data.a('proType') === proTypeSet.main) {
            let group = data.getParent();
            let gRect = group.getRect();
            if (!group.isParentOf(currentClickNode)) {
              let range = {
                minX: '',
                minY: '',
                maxX: '',
                maxY: '',
              };
              group.eachChild(child => {
                let childP = child.p();
                let childS = child.getSize();
                let minX = childP.x - childS.width / 2 - 14;
                let minY = childP.y - childS.height / 2 - 14;
                let maxX = childP.x + childS.width / 2 + 14;
                let maxY = childP.y + childS.height / 2 + 70;
                if (!range.minX || minX < range.minX) {
                  range.minX = minX;
                }
                if (!range.minY || minY < range.minY) {
                  range.minY = minY;
                }
                if (!range.maxX || maxX > range.maxX) {
                  range.maxX = maxX;
                }
                if (!range.maxY || maxY > range.maxY) {
                  range.maxY = maxY;
                }
              });
              let kRect = {
                x: range.minX,
                y: range.minY,
                width: range.maxX - range.minX,
                height: range.maxY - range.minY,
              };
              if (isRectContains(kRect, cRect)) {
                currentClickNode.setParent(group);
              }
            }
          }
        });
      }
    },

    // 创建元素
    createDiv(background) {
      let div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.background = background;
      return div;
    },
    // 创建组
    createGroup(data, dataModel, isExpanded = false) {
      let group = new ht.Group();
      group.setName(data.name);
      group.setExpanded(isExpanded);
      dataModel.add(group);
      return group;
    },
    // 创建节点
    createNode(item, parent, dataModel) {
      let node = new ht.Node();
      node.setName(item.name);
      node.setAttrObject({
        name: item.name,
        id: item.id,
        proType: item.proType,
        image: item.image
      });
      node.setSize(10, 10);
      node.s('draggable', item.draggable);
      node.setParent(parent);
      dataModel.add(node);
      this.registerNodeIcon(node);
      return node;
    },
    // 注册节点Icon
    registerNodeIcon(node) {
      if (node && node.a('image')) {
        ht.Default.setImage(`${node.a('name')}-${node.a('id')}`, node.a('image'));
      }
    },
    getNodeIconName(node) {
      let iconImage = '';
      if (node && node.a('image')) {
        iconImage = ht.Default.getImage(`${node.a('name')}-${node.a('id')}`, node.a('image'));
      }
      return iconImage ? `${node.a('name')}-${node.a('id')}` : ''
    },
    addIconForNode(node) {
      let iconName = this.getNodeIconName(node) ? this.getNodeIconName(node) : 'defaultIcon';
      node.addStyleIcon(iconName, {
        position: 10,
        direction: 'east',
        offsetX: 15,
        offsetY: 15,
        gap: 10,
        width: 25,
        height: 25,
        names: [iconName],
      });
    },

    // 面板节点映射拓扑节点
    paletteNodeMapGraphNode(paletteNode, style) {
      let node = new ht.Node();
      node.setName(paletteNode.getName());
      node.setImage({
        width: 150,
        height: 55,
        comps: [
          {
            type: 'roundRect',
            rect: [0, 0, 150, 55],
            borderWidth: 1,
            borderColor: 'blue',
            borderPattern: [3, 3],
            background: null,
            cornerRadius: 6,
          },
        ],
      });
      node.s({
        label: paletteNode.getName(),
        'label.position': 10,
        'label.offset.x': 60,
        'label.offset.y': 20,
      });
      node.setAttrObject(paletteNode.getAttrObject());
      this.addIconForNode(node);
      return node;
    },
    createGraphGroup() {
      let group = new ht.Group();
      group.setSize(100, 50);
      group.s({
        'select.width': 0,
        'note': '我是主产品',
        'group.type': 'roundRect',
        'group.padding': 10,
        'group.padding.left': 0,
        'group.padding.right': 0,
        'group.padding.bottom': 60,
        'group.background': null,
        'group.border.width': 2,
        'group.border.pattern': [8, 3, 3, 3],
      });
      group.setExpanded(true);
      return group;
    },
    // 重置视图布局
    resetGraphLayout() {
      let json = {
        "v": "6.2.6",
        "p": {
          "autoAdjustIndex": true,
          "hierarchicalRendering": false
        },
        "d": [
          {
            "c": "ht.Node",
            "i": 18,
            "p": {
              "name": "金属裸机",
              "image": {
                "width": 150,
                "height": 55,
                "comps": [
                  {
                    "type": "roundRect",
                    "rect": [
                      0,
                      0,
                      150,
                      55
                    ],
                    "borderWidth": 1,
                    "borderColor": "blue",
                    "borderPattern": [
                      3,
                      3
                    ],
                    "background": null,
                    "cornerRadius": 6
                  }
                ]
              },
              "position": {
                "x": 84.24291,
                "y": 100.36577
              }
            },
            "s": {
              "label": "金属裸机",
              "label.position": 10,
              "label.offset.x": 60,
              "label.offset.y": 20,
              "icons": {
                "defaultIcon": {
                  "position": 10,
                  "direction": "east",
                  "offsetX": 15,
                  "offsetY": 15,
                  "gap": 10,
                  "width": 25,
                  "height": 25,
                  "names": [
                    "defaultIcon"
                  ]
                }
              }
            },
            "a": {
              "name": "金属裸机",
              "id": "02",
              "proType": 2,
              "image": ""
            }
          },
          {
            "c": "ht.Group",
            "i": 22,
            "p": {
              "position": {
                "x": 254.45041,
                "y": 257.03471
              },
              "width": 100,
              "height": 50,
              "expanded": true
            },
            "s": {
              "select.width": 0,
              "note": "我是主产品",
              "group.type": "roundRect",
              "group.padding": 10,
              "group.padding.bottom": 60,
              "group.background": null,
              "group.border.width": 2,
              "group.border.pattern": [
                8,
                3,
                3,
                3
              ]
            }
          },
          {
            "c": "ht.Node",
            "i": 21,
            "p": {
              "name": "虚拟机",
              "parent": {
                "__i": 22
              },
              "image": {
                "width": 150,
                "height": 55,
                "comps": [
                  {
                    "type": "roundRect",
                    "rect": [
                      0,
                      0,
                      150,
                      55
                    ],
                    "borderWidth": 1,
                    "borderColor": "blue",
                    "borderPattern": [
                      3,
                      3
                    ],
                    "background": null,
                    "cornerRadius": 6
                  }
                ]
              },
              "position": {
                "x": 254.45041,
                "y": 257.03471
              }
            },
            "s": {
              "label": "虚拟机",
              "label.position": 10,
              "label.offset.x": 60,
              "label.offset.y": 20,
              "icons": {
                "虚拟机-01": {
                  "position": 10,
                  "direction": "east",
                  "offsetX": 15,
                  "offsetY": 15,
                  "gap": 10,
                  "width": 25,
                  "height": 25,
                  "names": [
                    "虚拟机-01"
                  ]
                }
              }
            },
            "a": {
              "name": "虚拟机",
              "id": "01",
              "proType": 1,
              "image": "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            }
          },
          {
            "c": "ht.Group",
            "i": 24,
            "p": {
              "position": {
                "x": 568.07041,
                "y": 299.18623
              },
              "width": 100,
              "height": 50,
              "expanded": true
            },
            "s": {
              "select.width": 0,
              "note": "我是主产品",
              "group.type": "roundRect",
              "group.padding": 10,
              "group.padding.bottom": 60,
              "group.background": null,
              "group.border.width": 2,
              "group.border.pattern": [
                8,
                3,
                3,
                3
              ]
            }
          },
          {
            "c": "ht.Node",
            "i": 23,
            "p": {
              "name": "Apache",
              "parent": {
                "__i": 24
              },
              "image": {
                "width": 150,
                "height": 55,
                "comps": [
                  {
                    "type": "roundRect",
                    "rect": [
                      0,
                      0,
                      150,
                      55
                    ],
                    "borderWidth": 1,
                    "borderColor": "blue",
                    "borderPattern": [
                      3,
                      3
                    ],
                    "background": null,
                    "cornerRadius": 6
                  }
                ]
              },
              "position": {
                "x": 568.07041,
                "y": 259.16471
              }
            },
            "s": {
              "label": "Apache",
              "label.position": 10,
              "label.offset.x": 60,
              "label.offset.y": 20,
              "icons": {
                "defaultIcon": {
                  "position": 10,
                  "direction": "east",
                  "offsetX": 15,
                  "offsetY": 15,
                  "gap": 10,
                  "width": 25,
                  "height": 25,
                  "names": [
                    "defaultIcon"
                  ]
                }
              }
            },
            "a": {
              "name": "Apache",
              "id": "03",
              "proType": 1,
              "image": ""
            }
          },
          {
            "c": "ht.Node",
            "i": 28,
            "p": {
              "name": "Nginx",
              "parent": {
                "__i": 24
              },
              "image": {
                "width": 150,
                "height": 55,
                "comps": [
                  {
                    "type": "roundRect",
                    "rect": [
                      0,
                      0,
                      150,
                      55
                    ],
                    "borderWidth": 1,
                    "borderColor": "blue",
                    "borderPattern": [
                      3,
                      3
                    ],
                    "background": null,
                    "cornerRadius": 6
                  }
                ]
              },
              "position": {
                "x": 568.07041,
                "y": 339.20774
              }
            },
            "s": {
              "label": "Nginx",
              "label.position": 10,
              "label.offset.x": 60,
              "label.offset.y": 20,
              "icons": {
                "defaultIcon": {
                  "position": 10,
                  "direction": "east",
                  "offsetX": 15,
                  "offsetY": 15,
                  "gap": 10,
                  "width": 25,
                  "height": 25,
                  "names": [
                    "defaultIcon"
                  ]
                }
              }
            },
            "a": {
              "name": "Nginx",
              "id": "04",
              "proType": 2,
              "image": ""
            }
          },
          {
            "c": "ht.Node",
            "i": 25,
            "p": {
              "image": {
                "width": 10,
                "height": 10,
                "comps": [
                  {
                    "type": "circle",
                    "rect": [
                      0,
                      0,
                      10,
                      10
                    ],
                    "borderWidth": 1,
                    "borderColor": "#d8d8d8",
                    "background": "#fff"
                  }
                ]
              },
              "position": {
                "x": 721.04647,
                "y": 100.36577
              }
            }
          },
          {
            "c": "ht.Edge",
            "i": 26,
            "p": {
              "source": {
                "__i": 18
              },
              "target": {
                "__i": 25
              }
            },
            "s": {
              "edge.offset": 4,
              "edge.color": "rgba(48,107,255,1)",
              "edge.source.position": 19,
              "icons": {
                "toArrow": {
                  "width": 18,
                  "height": 12,
                  "position": 19,
                  "keepOrien": true,
                  "names": [
                    "toArrow"
                  ]
                }
              }
            }
          },
          {
            "c": "ht.Edge",
            "i": 29,
            "p": {
              "source": {
                "__i": 18
              },
              "target": {
                "__i": 22
              }
            },
            "s": {
              "edge.type": "h.v",
              "edge.color": "rgba(48,107,255,1)",
              "icons": {
                "toArrow": {
                  "width": 18,
                  "height": 12,
                  "position": 19,
                  "keepOrien": true,
                  "names": [
                    "toArrow"
                  ]
                }
              }
            }
          },
          {
            "c": "ht.Edge",
            "i": 30,
            "p": {
              "source": {
                "__i": 18
              },
              "target": {
                "__i": 24
              }
            },
            "s": {
              "edge.type": "h.v",
              "edge.color": "rgba(48,107,255,1)",
              "icons": {
                "toArrow": {
                  "width": 18,
                  "height": 12,
                  "position": 19,
                  "keepOrien": true,
                  "names": [
                    "toArrow"
                  ]
                }
              }
            }
          }
        ]
      }
      this.deserialize(this.graphView, json)
      this.restoreGraphStyle();
    },
    // 序列化画布
    deserialize(graphView, json) {
      this.graphDM.deserialize(json);
      graphView.fitContent(true, 20, true);
    },
    // 恢复视图样式
    restoreGraphStyle() {
      let proTypeSet = this.proTypeSet
      this.graphDM.each(data => {
        if (data instanceof ht.Group) {
          console.log('group', data)
          let group = data;
        } else if (data instanceof ht.Node) {
          console.log('node', data)
          let node = data
          if (node.a('proType') === proTypeSet.affiliate) {
            this.addIconForNode(node)
          }
        }
      })
    },

    // 获取所需数据
    getServiceStatus() {
      this.currentOperation = this.$route.query.operation || 'add';
    },
    getServiceInfo() { },
    // 处理创建/编辑
    next() { },
    baseServicePage() {
      this.$router.push({
        path: 'componentService',
      });
    },
    // 返回
    previous() {
      this.$router.push({
        path: 'cServiceBaseInfo',
        query: {
          operation: 'edit',
          id: this.serviceId,
        },
      });
    },
  },
  watch: {},
  computed: {},
  components: {},
};
</script>
<style lang="less" scoped>
.serviceConfigPage {
  .nav-c {
    @flex();
    .back-c {
      @flex();
      .icon {
        font-size: 25px;
        color: @g-font-color-m;
        cursor: pointer;
      }
      & > .title {
        margin-left: 16px;
        font-size: 16px;
        font-family: @g-font-family-m;
        font-weight: 500;
      }
    }
    .steps-c {
      margin-left: auto;
      .steps-list {
        @flex();
        & > li {
          @flex();
          color: @g-font-color-n;
          .step-line {
            margin: 0 16px;
            width: 40px;
            height: 1px;
            background: rgba(0, 0, 0, 0.15);
            border: 0;
          }
          .step-num {
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(216, 222, 233, 1);
            font-size: 12px;
            border-radius: 100%;
          }
          .step-name {
            margin-left: 8px;
            font-size: 14px;
          }
        }
        & > li.active {
          .step-num {
            background: @g-m-color;
            border: 1px solid @g-m-color;
            color: #ffffff;
          }
          .step-name {
            color: @g-font-color-c;
          }
        }
      }
    }
  }
  .ts-content-wrap {
    margin: 24px 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 4px 12px 0 rgba(52, 69, 99, 0.04);
    border-radius: 4px;
    .header {
      @flex();
      height: 54px;
      border-bottom: 1px solid @g-border-color;
      span {
        margin-left: 30px;
        font-size: 14px;
        font-family: @g-font-family-m;
        font-weight: 500;
      }
    }
    .canvas-c {
      @flex();
      height: 600px;
      position: relative;
      background-color: #fff;
      /deep/ .canvas-style-c {
        position: absolute;
        left: 0;
        right: 0;
        width: 100%;
        height: 600px;
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
}
</style>
