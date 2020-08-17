import "@/commons/js/HT/ht-gridPainter.js"; // 网络绘制

const groupPadding = 20;
const groupPaddingBottom = 60;
const proTypeSet = {
  main: 1, // 主产品
  affiliate: 2 // 附加产品
};

class GraphView {
  constructor(vue) {
    this.$graphView = new ht.graph.GraphView();
    this.$vue = vue;
  }
  init() {
    this.currentClickElement = null;
    this._addEventListener();
    this._addInteractorListener();
    this._handleDelete();
    this._addBottomPainter();
    window.addEventListener(
      "resize",
      e => {
        this.$graphView.invalidate();
      },
      false
    );
    this.$graphView.setEditable(false);
  }

  // 序列化拓扑
  deserialize(json) {
    this.$graphView.dm().deserialize(json);
    this.$graphView.fitContent(true, 20, true);
    this._restoreGraphStyle();
  }

  // 更新画布Node uuid
  updateAllNodeUUidFromCanvas() {
    this.$graphView.dm().each(data => {
      let dmObj = data;
      if (dmObj.a("elementType") === "node") {
        if (dmObj.a("proType")) {
          dmObj.a("uuid", this._createUuid());
        }
      }
    });
  }

  // 添加监听事件
  _addEventListener() {
    let graphView = this.$graphView;
    // 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
    graphView.getView().addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });
    // 在一个拖动过程中，释放鼠标键时触发此事件
    graphView.getView().addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      this._createElementToGraphView(e);
    });
  }

  // 添加交互事件
  _addInteractorListener() {
    let graphView = this.$graphView;
    graphView.addInteractorListener(e => {
      if (e.kind === "endMove") {
        this._addNodeToGroup(graphView);
      } else if (e.kind === "clickData") {
        let currentElement = e.data;
        let serviceId, uuid;
        this._restoreInactiveElementStyle();
        this._activeElementStyle(currentElement);
        switch (currentElement.a("elementType")) {
          case "node":
            if (currentElement.a("proType")) {
              this.$vue.currentNodeData = currentElement.getAttrObject();
              serviceId = currentElement.a("service_id");
              uuid = currentElement.a("uuid");
            }
            break;
          case "group":
            currentElement.eachChild(child => {
              if (child.a("proType") === proTypeSet.main) {
                this.$vue.currentNodeData = child.getAttrObject();
                serviceId = child.a("service_id");
                uuid = child.a("uuid");
              }
            });
            break;
          default:
            break;
        }
        this.currentClickElement = currentElement;
        // this.$vue.getServiceOperationList(serviceId,uuid);
      } else if (e.kind === "onUp") {
        console.log("在图元处放开");
      } else if (e.kind === "onEndDrag") {
        console.log("图元结束拖拽");
      } else if (e.kind === "doubleClickData") {
        console.log("被双击");
        // setTimeout(()=> { e.data.setExpanded(true); })
      } else if (e.kind === "clickBackground") {
        console.log("单击背景");
      } else if (e.kind === "doubleClickBackground") {
        console.log("双击背景");
      } else if (e.kind === "beginRectSelect") {
        console.log("开始框选图元");
      } else if (e.kind === "betweenRectSelect") {
        console.log("正在框选图元");
      } else if (e.kind === "endRectSelect") {
        console.log("结束框选图元");
      } else if (e.kind === "beginMove") {
        console.log("开始移动图元");
      } else if (e.kind === "betweenMove") {
        console.log("正在移动图元");
      } else if (e.kind === "endMove") {
        console.log("结束移动图元");
      } else if (e.kind === "beginPan") {
        console.log("开始手抓图平移");
      } else if (e.kind === "betweenPan") {
        console.log("正在手抓图平移");
      } else if (e.kind === "endPan") {
        console.log("结束手抓图平移");
      } else if (e.kind === "beginEditRect") {
        console.log("开始编辑图元大小和位置");
      } else if (e.kind === "betweenEditRect") {
        console.log("正在编辑图元大小和位置");
      } else if (e.kind === "endEditRect") {
        console.log("结束编辑图元大小和位置");
      } else if (e.kind === "beginEditPoint") {
        console.log("开始编辑多边形Shape或多点Edge的具体点");
      } else if (e.kind === "betweenEditPoint") {
        console.log("正在编辑多边形Shape或多点Edge的具体点");
      } else if (e.kind === "endEditPoint") {
        console.log("结束编辑多边形Shape或多点Edge的具体点");
      } else if (e.kind === "beginEditRotation") {
        console.log("开始旋转图元");
      } else if (e.kind === "betweenEditRotation") {
        console.log("正在旋转图元");
      } else if (e.kind === "endEditRotation") {
        console.log("结束旋转图元");
      } else if (e.kind === "moveLeft") {
        console.log("左方向键左移图元一个像素");
      } else if (e.kind === "moveRight") {
        console.log("右方向键右移图元一个像素");
      } else if (e.kind === "moveUp") {
        console.log("上方向键上移图元一个像素");
      } else if (e.kind === "moveDown") {
        console.log("下方向键下移图元一个像素");
      } else if (e.kind === "toggleNote") {
        console.log("切换note标注的展开合并");
      } else if (e.kind === "toggleNote2") {
        console.log("切换note2标注的展开合并");
      } else if (e.kind === "beginEditPoints") {
        console.log("开始进入曲线的点编辑状态");
      } else if (e.kind === "endEditPoints") {
        console.log("结束曲线的点编辑状态");
      } else if (e.kind === "hover") {
        console.log("鼠标停留");
      } else if (e.kind === "onClick") {
        console.log("单击图元");
      } else if (e.kind === "onDoubleClick") {
        console.log("双击图元");
      } else if (e.kind === "onContextMenu") {
        console.log("右击图元");
      } else if (e.kind === "onDown") {
        console.log("在图元处按下");
      } else if (e.kind === "onUp") {
        console.log("在图元处放开");
      } else if (e.kind === "onMove") {
        console.log("鼠标在图元上移动");
      } else if (e.kind === "onEnter") {
        console.log("鼠标进入图元");
      } else if (e.kind === "onHover") {
        console.log("鼠标在图元上悬停");
      } else if (e.kind === "onLeave") {
        console.log("鼠标离开图元");
      } else if (e.kind === "onBeginDrag") {
        console.log("图元开始拖拽");
      } else if (e.kind === "onDrag") {
        console.log("图元拖拽");
      } else if (e.kind === "onUp") {
        console.log("在图元处放开");
      } else if (e.kind === "onEndDrag") {
        console.log("图元结束拖拽");
      } else if (e.kind === "onScroll") {
        console.log("鼠标图元上滚动");
      }
    });
  }

  // 还原图元样式到未点击前
  _restoreInactiveElementStyle() {
    let lastElement = this.currentClickElement;
    if (lastElement) {
      switch (lastElement.a("elementType")) {
        case "node":
          lastElement.setImage({
            width: 150,
            height: 55,
            comps: [
              {
                type: "roundRect",
                rect: [0, 0, 150, 55],
                borderWidth: 1,
                borderColor: "#3A4257",
                background: "#ffffff",
                cornerRadius: 4
                // borderPattern: [3, 3],
              }
            ]
          });
          break;
        case "group":
          lastElement.s({
            "group.border.color": "#3A4257",
            "group.background": "#ffffff"
          });
          break;
        default:
          break;
      }
    }
  }

  // 激活元素样式
  _activeElementStyle(currentElement) {
    switch (currentElement.a("elementType")) {
      case "node":
        currentElement.setImage({
          width: 150,
          height: 55,
          comps: [
            {
              type: "roundRect",
              rect: [0, 0, 150, 55],
              borderWidth: 1,
              borderColor: "#306BFF",
              background: "#ffffff",
              cornerRadius: 4
              // borderPattern: [3, 3],
            }
          ]
        });
        break;
      case "group":
        currentElement.s({
          "group.background": "rgba(0,122,255,0.15)",
          "group.border.color": "#306BFF"
          // 'group.border.pattern': [8, 3, 3, 3],
        });
        break;
      default:
        break;
    }
  }

  // 处理键盘删除
  _handleDelete() {
    let graphView = this.$graphView;
    // 处理删除节点，可重载为空函数，阻止按Delete删除节点
    graphView.handleDelete = function(e) {};
  }

  _createElementToGraphView(e) {
    let graphView = this.$graphView,
      dataModel = graphView.dm();
    let nodeId = e.dataTransfer.getData("nodeId");
    let groupKey = e.dataTransfer.getData("groupKey");
    let paletteNodeData = this.$vue.paletteList[groupKey].items.find(
      node => node.id === nodeId
    );
    if (paletteNodeData) {
      let lp = graphView.lp(e);
      let gNode = this._createNode(paletteNodeData);
      this.$vue.addNodeForCanvas(gNode).then(res => {
        if (res.code === 200) {
          switch (gNode.a("proType")) {
            case proTypeSet.main:
              let gGroup = this._createGroup();
              gGroup.addChild(gNode);
              gGroup.p(lp.x, lp.y);
              dataModel.add(gNode);
              dataModel.add(gGroup);
              break;
            case proTypeSet.affiliate:
              dataModel.add(gNode);
              gNode.p(lp.x, lp.y);
              this.currentClickElement = gNode;
              // 添加节点到组
              this._addNodeToGroup(graphView);
              break;
            default:
              break;
          }
          this._saveGraphData(graphView);
        }
      });
    }
  }

  _saveGraphData(graphView) {
    let saveObj = {
      canvas_json: JSON.stringify(JSON.parse(graphView.dm().serialize())),
      relations: {}
    };
    graphView.each(el => {
      if (el.a("elementType") === "group") {
        let mainKey = "";
        el.eachChild(child => {
          if (child.a("proType") === proTypeSet.main) {
            mainKey = child.a("uuid");
            saveObj.relations[mainKey] = [];
          }
        });
        el.eachChild(child => {
          if (child.a("proType") === proTypeSet.affiliate) {
            saveObj.relations[mainKey].push(child.a("uuid"));
          }
        });
      }
    });
    this.$vue.saveCanvasData(saveObj, "hide");
  }

  // 为拓扑组件创建节点
  _createNode(data, style) {
    let node = new ht.Node();
    node.setName(data.name);
    node.setImage({
      width: 150,
      height: 55,
      comps: [
        {
          type: "roundRect",
          rect: [0, 0, 150, 55],
          borderWidth: 1,
          borderColor: "#3A4257",
          background: "#ffffff",
          cornerRadius: 4
          // borderPattern: [3, 3],
        }
      ]
    });
    node.s({
      label: data.name,
      "label.position": 10,
      "label.offset.x": 60,
      "label.offset.y": 20
    });
    // 防止浅拷贝，导致数据被重写
    let attrObject = {
      name: data.name,
      elementType: "node",
      service_id: data.id,
      uuid: this._createUuid(),
      proType: data.proType,
      image: data.image
    };
    node.setAttrObject(attrObject);
    this._addIconForNode(node);
    return node;
  }

  // 为拓扑组件创建组
  _createGroup() {
    let group = new ht.Group();
    group.setSize(100, 50);
    group.setAttrObject({
      elementType: "group"
    });
    group.s({
      "select.width": 0,
      "group.type": "roundRect",
      "group.padding": groupPadding,
      "group.padding.left": 0,
      "group.padding.right": 0,
      "group.padding.bottom": groupPaddingBottom,
      "group.border.color": "#3A4257",
      "group.background": "#ffffff",
      "group.border.width": 1
      // 'group.background': 'rgba(0,122,255,0.15)',
      // 'group.border.color': '#306BFF',
      // 'group.border.pattern': [8, 3, 3, 3],
    });
    group.setExpanded(true);
    return group;
  }

  // 为节点添加图标
  _addIconForNode(node) {
    let iconName = this._getNodeIconName(node) || "defaultIcon";
    node.addStyleIcon(iconName, {
      position: 10,
      direction: "east",
      offsetX: 15,
      offsetY: 15,
      gap: 10,
      width: 25,
      height: 25,
      names: [iconName]
    });
  }

  // 获取节点图标name
  _getNodeIconName(node) {
    let isHasIcon = false;
    if (node && node.a("image")) {
      isHasIcon = !!ht.Default.getImage(
        `${node.a("name")}-${node.a("service_id")}`
      );
      if (!isHasIcon) {
        this._registerNodeIcon(node);
        isHasIcon = true;
      }
    }
    return isHasIcon ? `${node.a("name")}-${node.a("service_id")}` : "";
  }

  // 注册图标
  _registerNodeIcon(node) {
    ht.Default.setImage(
      `${node.a("name")}-${node.a("service_id")}`,
      node.a("image")
    );
  }

  // 创建uuid
  _createUuid() {
    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
        ""
      ),
      uuid = new Array(36),
      rnd = 0,
      r;
    for (let i = 0; i < 36; i++) {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        uuid[i] = "-";
      } else if (i == 14) {
        uuid[i] = "4";
      } else {
        if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join("");
  }

  // 添加底部网络视图
  _addBottomPainter() {
    let graphView = this.$graphView;
    graphView.addBottomPainter(new ht.graph.GridPainter(graphView));
  }

  // 往组里添加图元
  _addNodeToGroup() {
    let graphView = this.$graphView;
    let currentClickElement = this.currentClickElement;
    if (
      currentClickElement.a("proType") === proTypeSet.affiliate &&
      !currentClickElement.getParent()
    ) {
      let cRect = currentClickElement.getRect();
      graphView.each(data => {
        if (data.a("proType") === proTypeSet.main) {
          let group = data.getParent();
          let gRect = group.getRect();
          if (!group.isParentOf(currentClickElement)) {
            let range = {
              minX: "",
              minY: "",
              maxX: "",
              maxY: ""
            };
            group.eachChild(child => {
              let childP = child.p();
              let childS = child.getSize();
              let minX = childP.x - childS.width / 2 - groupPadding;
              let minY = childP.y - childS.height / 2 - groupPadding;
              let maxX = childP.x + childS.width / 2 + groupPadding;
              let maxY =
                childP.y +
                childS.height / 2 +
                groupPaddingBottom +
                groupPadding +
                5;
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
              height: range.maxY - range.minY
            };
            if (this._isRectContains(kRect, cRect)) {
              currentClickElement.setParent(group);
            }
          }
        }
      });
    }
  }

  // 校验移动图元是否在目标图元内
  _isRectContains(targetRect, moveRect) {
    console.log("targetRect", targetRect);
    console.log("moveRect", moveRect);
    return (
      moveRect.x > targetRect.x &&
      moveRect.y > targetRect.y &&
      moveRect.x + moveRect.width < targetRect.x + targetRect.width &&
      moveRect.y + moveRect.height < targetRect.y + targetRect.height
    );
  }

  // 恢复拓扑画布样式
  _restoreGraphStyle() {
    let proTypeSet = this.$vue.proTypeSet;
    this.$graphView.dm().each(data => {
      let dmObj = data;
      if (dmObj.a("elementType") === "node") {
        if (dmObj.a("proType")) {
          this._addIconForNode(dmObj);
        }
      } else if (dmObj.a("elementType") === "group") {
      }
    });
  }
}

export default GraphView;
