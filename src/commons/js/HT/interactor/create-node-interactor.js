const CreateNodeInteractor = function(graphView) {
  CreateNodeInteractor.superClass.constructor.call(this, graphView);
};

/**
 * @method ht.Default.def
 * @Description 定义类函数
 * @param className, superClass, methods
 * 作用：继承父类后，扩展方法
 */
ht.Default.def(CreateNodeInteractor, ht.graph.Interactor, {
  handle_mousedown: function(e) {
    this.handle_touchstart(e);
  },
  handle_touchstart: function(e) {
    this.isLeftClick = ht.Default.isLeftButton(e) && ht.Default.getTouchCount(e) === 1;
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
  handle_mouseup: function(e) {
    this.handle_touchend(e);
  },
  handle_touchend: function(e) {
    var graphView = this._graphView;
    if (!graphView._panning && this.isLeftClick) {
      var node = new ht.Node();
      node.setImage({
        width: 10,
        height: 10,
        comps: [
          {
            type: 'circle',
            rect: [0, 0, 10, 10],
            borderWidth: 1,
            borderColor: '#d8d8d8',
            background: '#fff',
          }
        ]
      });
      node.setPosition(graphView.getLogicalPoint(e));
      node.setParent(graphView.getCurrentSubGraph());
      graphView.getDataModel().add(node);
      graphView.getSelectionModel().setSelection(node);
      delete this.isLeftClick;
    }
  }
});

export default CreateNodeInteractor
