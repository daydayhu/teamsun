import "@/commons/js/HT/ht-htmlnode.js"; //
import "@/commons/js/HT/ht-gridPainter.js"; // 网络绘制

const groupPadding = 10;
const groupPaddingTop = 10;
const groupPaddingBottom = 10;
const operationPositionY = 60;
const nodeWidth = 180;
const nodeHeight = 55;
const attachNodeWidth = 15;
const attachNodeHeight = 15;
const polylineDefaultLong = 400;
const labelMax = nodeWidth - 55;

const proTypeSet = {
  main: 1, // 计算服务
  affiliate: 2, // 附加服务
  network: 3, // 网络服务
  integrate: 4, // 集成服务
  mix: 5 // 混合
};

const serviceTypeSet = {
  base: 1, // 基础服务
  component: 2 // 组件服务
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
    this._addSelectionChangeListener();
    this._handleDelete();
    this._addBottomPainter();
    this._adjustZoom();
    window.addEventListener(
      "resize",
      e => {
        this.$graphView.invalidate();
      },
      false
    );
    // 设置拓扑画布可编辑
    this.$graphView.setEditable(true);
    // 设置拓扑图元只能单选
    this.$graphView.dm().sm().setSelectionMode('single');
  }

  // 序列化拓扑
  deserialize(json, rootParent) {
    this.$graphView.dm().deserialize(json, rootParent);
    this.$graphView.fitContent(true, 20, true);
    this._restoreGraphStyle();
  }

  // 更新画布Node uuid
  updateAllNodeUUidFromCanvas() {
    this.$graphView.dm().each(data => {
      let dmObj = data;
      if (dmObj.a("elementType") === "node") {
        if (dmObj.a("proType")) {
          dmObj.a("uuid", this._createUUID());
        }
      }
    });
  }

  // 通过uuid获取图元
  getNodeByUUID(uuid) {
    let node;
    if (uuid) {
      this.$graphView.dm().each(element => {
        if (element.a("uuid") === uuid) {
          node = element;
        }
      });
    }
    return node;
  }

  // 获取画布json
  getCanvasJson() {
    return JSON.stringify(JSON.parse(this.$graphView.dm().serialize()));
  }

  // 创建连线成功回调
  createEdgeSuccess() {
    this.$vue.currentNodeData = null;
    this._saveGraphData();
    this._saveGraphRelations();
  }

  // 创建uuid
  createUUID() {
    return this._createUUID()
  }

  // 创建节点
  createNode(data, type) {
    return this._createNode(data, type)
  }

  // 添加吸附节点到dm
  addAttachesElementToCanvas(node) {
    this._addAttachesElementToCanvas(node)
  }

  // 添加图标
  addIconForNode(node) {
    this._addIconForNode(node)
  }

  // 保存画布
  saveGraphData() {
    this._saveGraphData();
  }

  // 保存关联关系
  saveGraphRelations() {
    this._saveGraphRelations();
  }

  // 获取dataModel
  getDateModel() {
    return this.$graphView.dm()
  }

  // 删除图元
  removeNode(node) {
    this.$graphView.dm().remove(node)
  }

  // 删除吸附图元
  deleteAttachesNode(host) {
    this._deleteAttachesNode(host)
  }

  // TODO：生成部署单元合并组 用于给后端人员提供反向生成画布结构
  createDeployUnit() {
    let graphView = this.$graphView,
        dataModel = graphView.dm(),
        group = new ht.Group(),
        groupArr = [];
    group.setSize(400, 200);
    group.setAttrObject({
      elementType: "Unit"
    });
    group.s({
      'select.width': 1,
      'select.color': 'rgba(48,107,255,1)',
      'select.padding': 0,
      'group.depth': 0,
      'group.padding': groupPadding,
      'group.padding.top': groupPaddingTop,
      'group.padding.bottom': groupPaddingBottom,
      'group.border.color': 'rgba(51, 42, 124, 1)',
      'group.background': 'rgba(255,255,255,0.6)',
      'group.border.width': 2,
      'group.border.pattern': [5,5],
      'group.toggleable': false,
      '2d.editable': false,
      'group.border.radius': 4,
      'label2': '部署单元',
      'label2.position': 10,
      'label2.offset.x': 0,
      'label2.offset.y': 0,
      // 'group.padding.left': 0,
      // 'group.padding.right': 0,
      // 'select.type':'roundRect',
      // 'group.type': 'roundRect',
      // '2d.move.mode': 'xy'
      // 'group.background': 'rgba(0,122,255,0.15)',
      // 'group.border.color': '#306BFF',
      // 'group.border.pattern': [8, 3, 3, 3],
    });
    group.setExpanded(true);
    dataModel.add(group);
    this.$graphView.dm().each(element => {
      if (element.a("elementType") === 'group') { groupArr.push(element); }
    });
    groupArr.forEach(el => { el.setParent(group) })
  }

  // 设置选中图元
  setSelectNode(node) {
    if (node instanceof Object) {
      this.$graphView.getSelectionModel().setSelection(node);
      // this.$graphView.dm().sm().setSelection(node);
    }
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
    // 监听右击事件
    graphView.getView().addEventListener("contextmenu", e => {
      e.preventDefault();
      e.stopPropagation();
      let node = graphView.getDataAt(e);
      console.log("右击：", node);
      // graphView.dm().moveDown(node);
      // graphView.dm().moveSelectionUp();
      // graphView.dm().moveSelectionDown();
    });
  }

  // 监听选择变化事件   // TODO: 只用于后期样式修改
  _addSelectionChangeListener() {
    let graphView = this.$graphView;
    graphView
      .dm()
      .sm()
      .addSelectionChangeListener(e => {
        // if (e.kind === 'set') {
        //   console.log('e.kind set');
        // } else if (e.kind === 'remove') {
        //   console.log('e.kind remove');
        // } else if (e.kind === 'append') {
        //   console.log('e.kind append');
        // } else if (e.kind === 'clear') {
        //   console.log('e.kind clear');
        // }
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
        switch (currentElement.a("elementType")) {
          case "node":
            if (currentElement.a("proType")) {
              let _data = currentElement.getAttrObject();
              if (currentElement.a("proType") === proTypeSet.main) { graphView.getSelectionModel().setSelection(currentElement.getParent());}
              if (!this.$vue.currentNodeData || this.$vue.currentNodeData.uuid !== _data.uuid) {
                this.$vue.currentNodeData = _data;
                if (typeof this.$vue.getServiceInfo === "function") {
                  this.$vue.getServiceInfo(currentElement);
                }
              }
            }
            break;
          case "group":
            currentElement.eachChild(child => {
                if (child.a("proType") === proTypeSet.main) {
                  let _data = child.getAttrObject();
                  if (!this.$vue.currentNodeData || this.$vue.currentNodeData.uuid !== _data.uuid) {
                    this.$vue.currentNodeData = _data;
                    if (typeof this.$vue.getServiceInfo === "function") {
                      this.$vue.getServiceInfo(child);
                    }
                  }
                }
            });
            break;
          case "edge":
            this.$vue.currentNodeData = null;
            break;
          default:
            this.$vue.currentNodeData = null;
            break;
        }
      } else if (e.kind === "onUp") {
        console.log("在图元处放开");
      } else if (e.kind === "onEndDrag") {
        console.log("图元结束拖拽");
      } else if (e.kind === "doubleClickData") {
        let node = e.data;
        if (node.a("elementType") === "node") {
          this.$vue.currentNodeData = node.getAttrObject();
          if (typeof this.$vue.initNodeOperationList === "function") {
            this.$vue.initNodeOperationList(node);
          }
        }else if (node.a("elementType") === "group") {
          // TODO: 增加双击组事件处理
          node.eachChild(child => {
            if (child.a("proType") === proTypeSet.main) {
              this.$vue.currentNodeData = child.getAttrObject();
              if (typeof this.$vue.initNodeOperationList === "function") {
                this.$vue.initNodeOperationList(child);
              }
            }
          });
        }
      } else if (e.kind === "clickBackground") {
        console.log("单击背景");
        // 取消所有选中对象
        graphView
          .dm()
          .sm()
          .cs();
        // 清除当前记录的图元数据
        this.$vue.currentNodeData = null;
        // 关闭操作集弹框
        if (this.$vue.closeOperationDialog) {
          this.$vue.closeOperationDialog();
        }
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
        if (this.$vue.closeOperationDialog) {
          this.$vue.closeOperationDialog();
        }
      } else if (e.kind === "betweenMove") {
        console.log("正在移动图元");
        return false;
      } else if (e.kind === "endMove") {
        console.log("结束移动图元");
      } else if (e.kind === "beginPan") {
        console.log("开始手抓图平移");
      } else if (e.kind === "betweenPan") {
        console.log("正在手抓图平移");
      } else if (e.kind === "endPan") {
        console.log("结束手抓图平移");
      } else if (e.kind === "beginEditRect") {
        console.log("开始编辑图元大小和位置=============");
      } else if (e.kind === "betweenEditRect") {
        console.log("正在编辑图元大小和位置=============");
      } else if (e.kind === "endEditRect") {
        console.log("结束编辑图元大小和位置===============");
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
        console.log('在图元处放开');
      } else if (e.kind === "onMove") {
        console.log('鼠标在图元上移动');
      } else if (e.kind === "onEnter") {
        console.log('鼠标进入图元');
      } else if (e.kind === "onHover") {
        console.log('鼠标在图元上悬停');
      } else if (e.kind === "onLeave") {
        console.log('鼠标离开图元');
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
            width: nodeWidth,
            height: nodeHeight,
            comps: [
              {
                type: "roundRect",
                rect: [0, 0, nodeWidth, nodeHeight],
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
          width: nodeWidth,
          height: nodeHeight,
          comps: [
            {
              type: "roundRect",
              rect: [0, 0, nodeWidth, nodeHeight],
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

  // 调整缩放大小范围
  _adjustZoom() {
    this.$graphView.adjustZoom = function(value) {
      if (value < ht.Default.zoomMin) {
        return ht.Default.zoomMin;
      }
      if (value > ht.Default.zoomMax) {
        return ht.Default.zoomMax;
      }
      return value;
    };
  }

  // 处理键盘删除
  _handleDelete() {
    let graphView = this.$graphView;
    // 处理删除节点，可重载为空函数，阻止按Delete删除节点
    graphView.handleDelete = function(e) {
      console.log("e==", e);
    };
  }

  // 禁止组的默认双击事件
  _disabledGroupDoubleClicked() {
    let graphView = this.$graphView;
    graphView.onGroupDoubleClicked = function(data, event) {};
  }

  _createElementToGraphView(e) {
    let graphView = this.$graphView,
      dataModel = graphView.dm(),
      nodeId = e.dataTransfer.getData("nodeId"),
      groupKey = e.dataTransfer.getData("groupKey"),
      groupList = this.$vue.paletteList[groupKey].items,
      paletteNodeData = groupList.find(
        node => node.serviceId.toString() === nodeId
      ),
      lp = graphView.lp(e);
    if (paletteNodeData) {
      if (paletteNodeData.serviceType === serviceTypeSet.base) {
        let newNode = this._createNode(
          paletteNodeData,
          paletteNodeData.proType
        );
        this.$vue.saveBaseServiceData(newNode.getAttrObject()).then(res => {
          if (res.code === 200) {
            let _serviceInfo = res.data;
            switch (paletteNodeData.proType) {
              case proTypeSet.main:
                let gGroup = this._createGroup();
                gGroup.addChild(newNode);
                gGroup.p(lp.x, lp.y);
                dataModel.add(newNode);
                dataModel.add(gGroup);
                // 创建吸附图标
                let attachD = 12;
                let leftAttachP_1 = {x: lp.x - nodeWidth / 2 - groupPadding, y: lp.y - attachD};
                let leftAttachP_2 = {x: lp.x - nodeWidth / 2 - groupPadding, y: lp.y + attachD};
                let rightAttachP_1 = {x: lp.x + nodeWidth / 2 + groupPadding, y: lp.y - attachD};
                let rightAttachP_2 = {x: lp.x + nodeWidth / 2 + groupPadding, y: lp.y + attachD};
                this._createAttachNode(gGroup, leftAttachP_1, 'left');
                this._createAttachNode(gGroup, leftAttachP_2, 'left');
                this._createAttachNode(gGroup, rightAttachP_1, 'right');
                this._createAttachNode(gGroup, rightAttachP_2, 'right');
                // 暂弃 this._addAttachesElementToCanvas(gGroup);
                // 聚焦选中图元
                graphView.getSelectionModel().setSelection(gGroup);
                // 指定当前图元数据
                // this.$vue.currentNodeData = newNode.getAttrObject();
                break;
              case proTypeSet.network:
                dataModel.add(newNode);
                newNode.p(lp.x, lp.y);
                // 创建网络管线
                let sourceP = { x: lp.x + newNode.getWidth() / 2, y: lp.y};
                let targetP = {
                  x: lp.x + newNode.getWidth() / 2 + polylineDefaultLong,
                  y: lp.y
                };
                this._createPolyline(newNode, sourceP, targetP);
                // 暂弃 this._addAttachesElementToCanvas(newNode);
                // 聚焦选中图元
                graphView.getSelectionModel().setSelection(newNode);
                // 指定当前图元数据
                // this.$vue.currentNodeData = newNode.getAttrObject();
                break;
              case proTypeSet.affiliate:
              case proTypeSet.integrate:
                dataModel.add(newNode);
                newNode.p(lp.x, lp.y);
                // 创建吸附图标
                let leftAttachP = { x: lp.x - newNode.getWidth() / 2, y: lp.y };
                let rightAttachP = { x: lp.x + newNode.getWidth() / 2, y: lp.y };
                this._createAttachNode(newNode, leftAttachP, "left");
                this._createAttachNode(newNode, rightAttachP, "right");
                // 暂弃 this._addAttachesElementToCanvas(newNode);
                // 聚焦选中图元
                graphView.getSelectionModel().setSelection(newNode);
                // 指定当前图元数据
                // this.$vue.currentNodeData = newNode.getAttrObject();
                // 添加节点到组
                if (paletteNodeData.proType === proTypeSet.affiliate) {
                  this._addNodeToGroup(graphView);
                }
                break;
              default:
                break;
            }
            // TODO: 查找对应node， 更新node下name
            let uuid = Object.keys(_serviceInfo)[0];
            let serviceName = _serviceInfo[uuid];
            let node = this.getNodeByUUID(Object.keys(_serviceInfo)[0]);
            node.a({ name: serviceName });
            node.s({ label: serviceName });
            this.$vue.currentNodeData = node.getAttrObject();
            // TODO: 新增创建图元后ServiceInfo更新
            if (typeof this.$vue.getServiceInfo === "function") {
              this.$vue.getServiceInfo(node);
            }
            // console.log('uuid',uuid);
            // console.log('serviceName',serviceName);
            // console.log('node',node);
            this._saveGraphData(graphView);
            this._saveGraphRelations(graphView);
          } else {
            this.$vue.$message.error("创建失败");
          }
        });
      } else {
        // TODO: 获取json
        let canvasJson = {};
        if (typeof this.$vue.getComponentCanvasJson === "function") {
          this.$vue.getComponentCanvasJson(paletteNodeData).then(data => {
            let rootParent = new ht.Data();
            let componentData = {
              component_id: paletteNodeData.serviceId,
              base_service_infos: []
            };
            rootParent.setAttrObject({
              elementType: "component",
              serviceType: paletteNodeData.serviceType,
              service_id: paletteNodeData.service_id
            });
            canvasJson = data;
            this.deserialize(canvasJson, rootParent);
            dataModel.add(rootParent);
            rootParent.eachChild(child => {
              switch (child.a("elementType")) {
                case "group":
                  child.eachChild(groupChild => {
                    if (groupChild.a("proType")) {
                      let service_new_uuid = this._createUUID();
                      let base_service_item = {
                        base_service_id: groupChild.a("service_id"),
                        node_canvas_uuid: service_new_uuid
                      };
                      groupChild.a("uuid", service_new_uuid);
                      componentData.base_service_infos.push(base_service_item);
                    }
                  });
                  break;
                case "node":
                  let node = child;
                  if (node.a("proType")) {
                    let service_new_uuid = this._createUUID();
                    let base_service_item = {
                      base_service_id: node.a("service_id"),
                      node_canvas_uuid: service_new_uuid
                    };
                    node.a("uuid", service_new_uuid);
                    componentData.base_service_infos.push(base_service_item);
                  }
                  break;
                default:
                  break;
              }
            });
            this.$vue.saveComponentServiceData(componentData).then(res => {
              if (res.code === 200) {
                // TODO: 需要重置图元名称
                for (let [key, value] of Object.entries(res.data)) {
                  let node = this.getNodeByUUID(key);
                  node.a({
                    name: value
                  });
                  node.s({
                    label: value
                  });
                }
                this._saveGraphData(graphView);
                this._saveGraphRelations(graphView);
              } else {
                this.$vue.$message.error("创建失败");
                graphView.dm().remove(rootParent);
              }
            });
          });
        }
      }
    }
  }

  _saveGraphData(graphView = this.$graphView) {
    let canvas_json = JSON.stringify(JSON.parse(graphView.dm().serialize()));
    if (typeof this.$vue.saveCanvasData === "function") {
      this.$vue.saveCanvasData(canvas_json, "hide");
    }
  }

  _saveGraphRelations(graphView = this.$graphView) {
    let relations = {
      group: {},
      edge: []
    };
    graphView.each(el => {
      if (el.a("elementType") === "group") {
        let mainKey = "";
        el.eachChild(child => {
          if (child.a("proType") === proTypeSet.main) {
            mainKey = child.a("uuid");
            relations.group[mainKey] = [];
          }
        });
        el.eachChild(child => {
          if (child.a("proType") !== proTypeSet.main) {
            relations.group[mainKey].push(child.a("uuid"));
          }
        });
      }
      if (el.a("elementType") === "edge") {
        let sourceNode = el.getSource();
        let targetNode = el.getTarget();
        let sourceData = this._getEdgeOriginNodeData(sourceNode);
        let targetData = this._getEdgeOriginNodeData(targetNode);
        let edgeRelation = {
          source_uuid: sourceData.uuid,
          target_uuid: targetData.uuid
        };
        relations.edge.push(edgeRelation);
      }
    });
    if (typeof this.$vue.saveCanvasRelation === "function") {
      this.$vue.saveCanvasRelation(relations);
    }
  }

  getAllEdgeFromCanvas(graphView = this.$graphView) {
    let edgeArr = [];
    graphView.each(el => {
      if (el.a("elementType") === "edge") {
        edgeArr.push(el);
      }
    });
    return edgeArr;
  }

  getEdgeOriginNodeData(el) {
    return this._getEdgeOriginNodeData(el);
  }

  _getEdgeOriginNodeData(el) {
    let data = {};
    switch (el.a("elementType")) {
      case "node":
        data = el.getAttrObject();
        break;
      case "group":
        el.eachChild(child => {
          if (child.a("proType") === proTypeSet.main) {
            data = child.getAttrObject();
          }
        });
        break;
      case "attach":
        let hostNode = el.getHost();
        if (hostNode.a("elementType") === "node") {
          data = hostNode.getAttrObject();
        } else if (hostNode.a("elementType") === "group") {
          hostNode.eachChild(child => {
            if (child.a("proType") === proTypeSet.main) {
              data = child.getAttrObject();
            }
          });
        }
        break;
      default:
        break;
    }
    return data;
  }

  _createHtmlNode() {
    let graphView = this.$graphView,
      dataModel = graphView.dm();
    let htmlNode = new ht.HtmlNode();
    let dom = this.$vue.$refs.node;
    htmlNode.s({
      "select.width": 1,
      "select.color": "rgba(48,107,255,1)",
      "select.padding": "-5",
      "2d.editable": false
    });
    htmlNode.setHtml(dom);
    htmlNode.setPosition(200, 100);
    dataModel.add(htmlNode);
  }

  // 为拓扑组件创建节点
  _createNode(data, type) {
    let node = new ht.Node();
    let nodeP;
    node.setName(data.name);
    switch (type) {
      case proTypeSet.main:
        node.setImage({
          width: nodeWidth,
          height: nodeHeight,
          comps: [
            {
              type: "roundRect",
              rect: [0, 0, nodeWidth, nodeHeight],
              borderWidth: 1,
              borderColor: "#fff",
              background: "rgba(255,255,255,0.6)",
              cornerRadius: 4
              // borderPattern: [3, 3],
            }
          ]
        });
        node.s({
          label: data.name,
          "select.width": 0,
          "label.position": 10,
          "label.offset.x": 50,
          "label.offset.y": 20,
          "label.max": labelMax,
          "2d.editable": false,
          // "2d.move.mode": "-"
          // '2d.selectable': false,
          // 'interactive': true
        });
        break;
      case proTypeSet.network:
        node.setImage({
          width: nodeWidth,
          height: nodeHeight,
          comps: [
            {
              type: "roundRect",
              rect: [0, 0, nodeWidth, nodeHeight],
              borderWidth: 1,
              borderColor: "#3A4257",
              background: "rgba(255,255,255,0.6)",
              cornerRadius: 4
              // borderPattern: [3, 3],
            }
          ]
        });
        node.s({
          label: data.name,
          "select.width": 1,
          "select.color": "rgba(48,107,255,1)",
          "select.padding": 0,
          "label.position": 10,
          "label.offset.x": 50,
          "label.offset.y": 20,
          "label.max": labelMax,
          "2d.editable": false
          // 'label.align': 'right',
          // 'attach.points': '[{10, 10}]'
          // 'select.type':'roundRect',
          // 'shape.corner.radius': 50,
          // '2d.move.mode': 'y',
          // 'interactive': true
        });
        // 一期：创建网络管线
        // nodeP = node.p();
        // let sourceP = { x: nodeP.x + node.getWidth() / 2, y: nodeP.y };
        // let targetP = {
        //   x: nodeP.x + node.getWidth() / 2 + polylineDefaultLong,
        //   y: nodeP.y
        // };
        // this._createPolyline(node, sourceP, targetP);
        break;
      case proTypeSet.affiliate:
      case proTypeSet.integrate:
        node.setImage({
          width: nodeWidth,
          height: nodeHeight,
          comps: [
            {
              type: "roundRect",
              rect: [0, 0, nodeWidth, nodeHeight],
              borderWidth: 1,
              borderColor: "#3A4257",
              background: "rgba(255,255,255,0.6)",
              cornerRadius: 4
              // borderPattern: [3, 3],
            }
          ]
        });
        node.s({
          label: data.name,
          "select.width": 1,
          "select.color": "rgba(48,107,255,1)",
          "select.padding": 0,
          "label.position": 10,
          "label.offset.x": 50,
          "label.offset.y": 20,
          "label.max": labelMax,
          "2d.editable": false
          // 'attach.points': '[{10, 10}]'
          // 'select.type':'roundRect',
          // 'shape.corner.radius': 50,
          // '2d.move.mode': 'y',
          // 'interactive': true
        });

        // 一期：创建吸附图标
        // nodeP = node.p();
        // let leftAttachP = { x: nodeP.x - node.getWidth() / 2, y: nodeP.y };
        // let rightAttachP = { x: nodeP.x + node.getWidth() / 2, y: nodeP.y };
        // this._createAttachNode(node, leftAttachP, "left");
        // this._createAttachNode(node, rightAttachP, "right");
        break;
    }

    // 防止浅拷贝，导致数据被重写
    let attrObject = {
      elementType: "node",
      name: data.name,
      service_id: data.serviceId,
      serviceType: data.serviceType,
      proType: data.proType,
      image: data.image,
      uuid: this._createUUID()
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
      'select.width': 1,
      'select.color': 'rgba(48,107,255,1)',
      'select.padding': 0,
      'group.depth': 0,
      'group.padding': groupPadding,
      'group.padding.top': groupPaddingTop,
      'group.padding.bottom': groupPaddingBottom,
      'group.border.color': '#3A4257',
      'group.background': 'rgba(255,255,255,0.6)',
      'group.border.width': 1,
      'group.toggleable': false,
      '2d.editable': false,
      'group.border.radius': 4

      // 'group.padding.left': 0,
      // 'group.padding.right': 0,
      // 'select.type':'roundRect',
      // 'group.type': 'roundRect',
      // '2d.move.mode': 'xy'
      // 'group.background': 'rgba(0,122,255,0.15)',
      // 'group.border.color': '#306BFF',
      // 'group.border.pattern': [8, 3, 3, 3],
    });
    // group.setLayer(-1);
    group.setExpanded(true);

    // 一期：创建吸附图标
    // let groupP = group.p();
    // let attachD = 12;
    // let leftAttachP_1 = {x: groupP.x - nodeWidth / 2 - groupPadding, y: groupP.y - attachD};
    // let leftAttachP_2 = {x: groupP.x - nodeWidth / 2 - groupPadding, y: groupP.y + attachD};
    // let rightAttachP_1 = {x: groupP.x + nodeWidth / 2 + groupPadding, y: groupP.y - attachD};
    // let rightAttachP_2 = {x: groupP.x + nodeWidth / 2 + groupPadding, y: groupP.y + attachD};
    // this._createAttachNode(group, leftAttachP_1, 'left');
    // this._createAttachNode(group, leftAttachP_2, 'left');
    // this._createAttachNode(group, rightAttachP_1, 'right');
    // this._createAttachNode(group, rightAttachP_2, 'right');

    return group;
  }

  // 创建吸附节点
  _createAttachNode(target, position, direction) {
    let graphView = this.$graphView,
        dataModel = graphView.dm(),
        node = new ht.Node();
    node.setImage({
      width: attachNodeWidth,
      height: attachNodeHeight,
      comps: [
        {
          type: "circle",
          rect: [0, 0, attachNodeWidth, attachNodeHeight],
          borderWidth: 1,
          borderColor: "#d8d8d8",
          background: "rgba(255,255,255,0.9)"
        }
      ]
    });
    node.s({
      "2d.editable": false,
      "2d.move.mode": "-"
    });
    node.a({
      elementType: "attach",
      direction: direction
    });
    node.setHost(target);
    node.setPosition(position);
    dataModel.add(node);
    return node;
  }

  // 创建吸附管线
  _createPolyline(node, ...point) {
    let graphView = this.$graphView,
        dataModel = graphView.dm(),
        polyline = new ht.Polyline();
    polyline.setPoints([...point]);
    polyline.s({
      "shape.border.color": "rgba(184,116,27,1)",
      "2d.move.mode": "-",
      "2d.selectable": false
      // '2d.editable': false
    });
    polyline.setHost(node);
    dataModel.add(polyline)
  }

  // 添加吸附元素到画布(dataModel)
  _addAttachesElementToCanvas(node) {
    let graphView = this.$graphView,
      dataModel = graphView.dm(),
      attachesList = node.getAttaches();
    if (attachesList && !attachesList.isEmpty()) {
      [...attachesList._as].forEach(item => {
        dataModel.add(item);
      });
    }
  }

  // 为节点添加图标
  _addIconForNode(node,status) {
    let iconsParam = '';
    let iconName = this._getNodeIconName(node) || "defaultIcon";
    if (status === 'restore') {
      iconsParam = node._styleMap.icons[Object.keys(node._styleMap.icons)[0]];
    }
    node.addStyleIcon(iconName, {
      position: 10,
      direction: "east",
      offsetX: iconsParam ? iconsParam.offsetX : 15,
      offsetY: iconsParam ? iconsParam.offsetY : 15,
      gap: 10,
      width: 25,
      height: 25,
      names: [iconName]
    });
  }

  // 删除吸附图元
  _deleteAttachesNode(host) {
    let graphView = this.$graphView;
    let attachesList = host.getAttaches();
    if (attachesList && !attachesList.isEmpty()) {
      [...attachesList._as].forEach(item=>{
        graphView.dm().remove(item);
      })
    }
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
  _createUUID() {
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
    let currentClickElement = graphView
      .dm()
      .sm()
      .getLastData();
    if (
      currentClickElement &&
      currentClickElement.a("proType") &&
      (currentClickElement.a("proType") === proTypeSet.affiliate ||
        currentClickElement.a("proType") === proTypeSet.integrate) &&
      !currentClickElement.getParent()
    ) {
      let cRect = currentClickElement.getRect();
      graphView.each(data => {
        if (data.a("proType") === proTypeSet.main) {
          let group = data.getParent();
          let lastNodeP;
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
              if (!lastNodeP) {
                lastNodeP = childP;
              } else {
                if (lastNodeP.y < childP.y) {
                  lastNodeP = childP;
                }
              }
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
              let childD = 70;
              currentClickElement.setParent(group);
              currentClickElement.s("2d.move.mode", "y");
              currentClickElement.p({
                x: lastNodeP.x,
                y: lastNodeP.y + childD
              });
              // let attachesList = group.getAttaches();
              // attachesList.each(item => {
              //   let _p = item.p();
              //   _p.y = _p.y - childD / 2;
              //   item.p(_p);
              // });

              this._saveGraphData(graphView);
              this._saveGraphRelations(graphView);
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
    this.$graphView.dm().each(data => {
      let dmObj = data;
      if (dmObj.a("elementType") === "node") {
        if (dmObj.a("proType")) {
          this._addIconForNode(dmObj,'restore');
        }
      } else if (dmObj.a("elementType") === "group") {
      }
    });
  }
}

export default GraphView;
