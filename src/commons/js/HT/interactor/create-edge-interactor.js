import "@/commons/js/HT/ht-edgetype.js"; // 连线类型js文件

const proTypeSet = {
  main: 1, // 主产品
  affiliate: 2, // 附加产品
  networkArea: 3, // 网络区域
  networkStrategy: 4, // 网络策略
};

const CreateEdgeInteractor = function(selfGraphView, edgeType) {
    CreateEdgeInteractor.superClass.constructor.call(
    this,
    selfGraphView.$graphView
  );
  this._edgeType = edgeType;
  this._selfGraphView = selfGraphView;
};
ht.Default.def(CreateEdgeInteractor, ht.graph.Interactor, {
  setUp: function() {
    CreateEdgeInteractor.superClass.setUp.call(this);
    this._autoMakeVisible = this._graphView.isAutoMakeVisible();
    this._graphView.setAutoMakeVisible(false);
  },
  tearDown: function() {
    CreateEdgeInteractor.superClass.tearDown.call(this);
    this._graphView.setAutoMakeVisible(this._autoMakeVisible);
    this._graphView.getSelectionModel().clearSelection();
  },
  handle_mousedown: function(e) {
    this.handle_touchstart(e);
  },
  handle_touchstart: function(e) {
    let currentClickNode = this.getNodeAt(e);
    if (currentClickNode && currentClickNode.a('proType') === proTypeSet.main) {
      this._sourceNode = currentClickNode.getParent();
    }else {
      this._sourceNode = currentClickNode;
    }
    if (this._sourceNode) {
      this._targetNode = null;
      this.startDragging(e);
      this._graphView.addTopPainter(this);
      this._graphView.getSelectionModel().setSelection(this._sourceNode);
    }
  },
  getNodeAt: function(e) {
    if (ht.Default.isLeftButton(e) && ht.Default.getTouchCount(e) === 1) {
      var data = this._graphView.getDataAt(e);
      if (data instanceof ht.Node) {
        return data;
      }
    }
    return null;
  },
  handleWindowMouseMove: function(e) {
    this.handleWindowTouchMove(e);
  },
  handleWindowMouseUp: function(e) {
    this.handleWindowTouchEnd(e);
  },
  handleWindowTouchMove: function(e) {
    let graphView = this._graphView;
    let currentClickNode = this.getNodeAt(e);
    this.redraw();
    this._logicalPoint = graphView.getLogicalPoint(e);
    this.autoScroll(e);
    if (currentClickNode && currentClickNode.a('proType') === proTypeSet.main) {
      this._targetNode = currentClickNode.getParent();
    }else {
      this._targetNode = currentClickNode;
    }
    if (this._targetNode) {
      graphView
        .getSelectionModel()
        .setSelection([this._sourceNode, this._targetNode]);
    } else {
      graphView.getSelectionModel().setSelection([this._sourceNode]);
    }
    this.redraw();
  },
  handleWindowTouchEnd: function(e) {
    this.redraw();
    if (this._targetNode) {
      let edge = new ht.Edge(this._sourceNode, this._targetNode);
      // TODO: 不能连线情况分析
      // 1 两个节点 为组内兄弟图元

      // 2.两个节点 为父子图元

      // 3.两个节点 为子父图元

      // 4.两个节点 都为网卡

      // 5.两个节点 已存在连线

      // 同一起点和终点间不可存在连线
      if (edge.isLooped()) {//判断连线的起点和终点是否为同一节点
        this._graphView.getDataModel().remove(edge);
      }else {
        edge.setParent(this._graphView.getCurrentSubGraph());
        edge.a({
          elementType: "edge"
        });
        this._graphView.getDataModel().add(edge);
        this._graphView.getSelectionModel().setSelection(edge);
        // edge.setLayer(2);
        //配置线样式
        switch (this._edgeType) {
          case "ortho": // 折线
            edge.s({
              "edge.type": this._edgeType,
              "edge.expanded": true,
              "edge.color": "rgba(48,107,255,1)"
            });
            break;
          case "h.v": // 直角线
            edge.s({
              "edge.gap": 30,
              "edge.type": 'h.v', // h.v2
              "edge.expanded": true,
              "edge.color": "rgba(48,107,255,1)",
              "edge.corner.radius": 15
            });
            break;
          case "dottedLine": // 虚线
            edge.s({
              "edge.pattern": [6, 6],
              "edge.expanded": true,
              "edge.color": "rgba(48,107,255,1)"
            });
            break;
          default:
            edge.s({
              // 'edge.center': false,
              // 'edge.offset': 4,
              "edge.type": "boundary", // 默认样式可编辑
              "edge.toggleable": false,
              "edge.pattern": [8, 2],
              "select.width": 1,
              "select.color": "rgba(48,107,255,1)",
              "select.padding": 0,
              "edge.offset": 0,
              "edge.source.offset.x": 0,
              "edge.source.offset.y": 0,
              "edge.target.offset.x": 0,
              "edge.target.offset.y": 0,
              "edge.color": "rgba(55,198,196,1)",
              "edge.independent": true,
              "edge.source.position": 17,
              "edge.target.position": 17,
              "edge.width": 1
            });
            break;
        }
        edge.addStyleIcon("fromArrow", {
          width: 7,
          height: 7,
          position: 15,
          keepOrien: true,
          names: ["fromArrow"]
        });
        edge.addStyleIcon('toArrow', {
          width: 18,//30
          height: 12,//20
          position: 19,
          keepOrien: true,
          names: ["toArrow"]
        });
        if (typeof this._selfGraphView.createEdgeSuccess === 'function') {
          this._selfGraphView.createEdgeSuccess();
        }
      }
    }
    this._graphView.removeTopPainter(this);
  },
  redraw: function() {
    var p1 = this._sourceNode.getPosition(),
      p2 = this._logicalPoint;
    if (p1 && p2) {
      var rect = ht.Default.unionPoint(p1, p2);
      ht.Default.grow(rect, 1);
      this._graphView.redraw(rect);
    }
  },
  draw: function(g) {
    var p1 = this._sourceNode.getPosition(),
      p2 = this._logicalPoint;
    if (p1 && p2) {
      g.lineWidth = 1;
      g.strokeStyle = "#1ABC9C";
      g.beginPath();
      g.moveTo(p1.x, p1.y);
      g.lineTo(p2.x, p2.y);
      g.stroke();
    }
  }
});

export default CreateEdgeInteractor;
