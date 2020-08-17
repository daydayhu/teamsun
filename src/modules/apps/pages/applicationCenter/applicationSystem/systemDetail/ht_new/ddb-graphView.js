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

const onHoverDelay = 100;
let onHoverTimer = null;

class GraphView {
  constructor(vue) {
    this.$graphView = new ht.graph.GraphView();
    this.$vue = vue;
  }

  init() {
    this.currentClickElement = null;
    this._addInteractorListener();
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
    this.$graphView.setEditable(true);
  }

  // 序列化拓扑
  deserialize(json, rootParent) {
    this.$graphView.dm().deserialize(json, rootParent);
    this.$graphView.fitContent(true, 20, true);
    this._restoreGraphStyle();
  }

  // 添加交互事件
  _addInteractorListener() {
    let graphView = this.$graphView;
    graphView.addInteractorListener(e => {
      if (e.kind === "clickData") {
        console.log("点击图元");
      } else if (e.kind === "clickBackground") {
        console.log("单击背景");
        graphView
          .dm()
          .sm()
          .cs();
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
        if (onHoverTimer) { clearTimeout(onHoverTimer); }
        onHoverTimer = setTimeout(() => {
          let currentElement = e.data;
          let point = {
            x: e.event.clientX,
            y: e.event.clientY - 25,
          };
          switch (currentElement.a('elementType')) {
            case 'node':
              this._createDomElement(currentElement, point);
              break;
            case 'group':
              break;
            case 'edge':
              break;
            default:
              break;
          }
        }, onHoverDelay);
      } else if (e.kind === "onEnter") {
        console.log('鼠标进入图元');
        if (onHoverTimer) { clearTimeout(onHoverTimer); }
        onHoverTimer = setTimeout(() => {
          let currentElement = e.data;
          let point = {
            x: e.event.clientX,
            y: e.event.clientY - 25,
          };
          switch (currentElement.a('elementType')) {
            case 'node':
              this._createDomElement(currentElement, point);
              break;
            case 'group':
              break;
            case 'edge':
              break;
            default:
              break;
          }
        }, onHoverDelay);
      } else if (e.kind === "onHover") {
        console.log('鼠标在图元上悬停');
        if (onHoverTimer) { clearTimeout(onHoverTimer); }
        onHoverTimer = setTimeout(() => {
          let currentElement = e.data;
          let point = {
            x: e.event.clientX,
            y: e.event.clientY - 25,
          };
          switch (currentElement.a('elementType')) {
            case 'node':
              this._createDomElement(currentElement, point);
              break;
            case 'group':
              break;
            case 'edge':
              break;
            default:
              break;
          }
        }, onHoverDelay);
      } else if (e.kind === "onLeave") {
        console.log('鼠标离开图元');
        let currentElement = e.data;
        switch (currentElement.a('elementType')) {
          case 'node':
            if (onHoverTimer) { clearTimeout(onHoverTimer); }
            this._removeDomElement(currentElement);
            break;
          case 'group':
            break;
          case 'edge':
            break;
          default:
            break;
        }
      } else if (e.kind === "onBeginDrag") {
        console.log("图元开始拖拽");
        let currentElement = e.data;
        switch (currentElement.a('elementType')) {
          case 'node':
            if (onHoverTimer) { clearTimeout(onHoverTimer); }
            this._removeDomElement(currentElement);
            break;
          case 'group':
            break;
          case 'edge':
            break;
          default:
            break;
        }
      } else if (e.kind === "onDrag") {
        console.log("图元拖拽");
      } else if (e.kind === "onUp") {
        console.log("在图元处放开");
      } else if (e.kind === "onEndDrag") {
        console.log("图元结束拖拽");
      }
    });
  }

  _createDomElement(node, point) {
    let label = node.s('label');
    let label2 = node.s('label2');
    let uuid = node.a('uuid');
    let el = document.getElementById(uuid);
    if (!el && label) {
      el = document.createElement('div');
      el.id = uuid;
      el.className = 'graph_node_tip';
      el.innerText = label2 ? `${label2}\n${label}` : label;
      el.style.top = point.y + 'px';
      el.style.left = point.x + 'px';
      document.body.appendChild(el);
    } else {
      el.style.top = point.y + 'px';
      el.style.left = point.x + 'px';
    }
  }

  _removeDomElement(node) {
    let uuid = node.a('uuid');
    let el = document.getElementById(uuid);
    if (el) {
      document.body.removeChild(el);
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
    graphView.handleDelete = function(e) {};
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

  // 添加底部网络视图
  _addBottomPainter() {
    let graphView = this.$graphView;
    graphView.addBottomPainter(new ht.graph.GridPainter(graphView));
  }

  // 恢复拓扑画布样式
  _restoreGraphStyle() {

    const proTypeMapText = {
      1: '主机服务', // 计算服务
      2: '附加服务', // 附加服务
      3: '网络服务', // 网络服务
      4: '集成服务', // 集成服务
    };

    this.$graphView.dm().each(data => {
      let dmObj = data;
      if (dmObj.a("elementType") === "node") {
        if (dmObj.a("proType")) {
          dmObj.s({'interactive': true});
          this._addIconForNode(dmObj,'restore');
          // console.log('dmObj',dmObj);
          // console.log('name',dmObj.s('label'));
          // console.log('name2',dmObj.s('label2'));
          // console.log('proType',proTypeMapText[dmObj.a("proType")]);
        }
      } else if (dmObj.a("elementType") === "group") {
      }
    });
  }
}

export default GraphView;
