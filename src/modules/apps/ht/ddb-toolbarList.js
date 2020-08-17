import CreateNodeInteractor from '@/commons/js/HT/interactor/create-node-interactor';
import CreateEdgeInteractor from '@/commons/js/HT/interactor/create-edge-interactor';

const btnSelectColor = '#f3f5e9', // rgb(231, 231, 231)
      btBgColor = '#fff';

const proTypeSet = {
  main: 1, // 计算服务
  affiliate: 2, // 附加服务
  network: 3, // 网络服务
  integrate: 4, // 集成服务
  mix: 5 // 混合
};

const handleId = 1;

class ToolbarList {
  constructor() {
    this.self = [
      {
        selected: true,
        background: btBgColor,
        selectBackground: btnSelectColor,
        borderLeft: '1px solid rgba(25,34,59,0.08)',
        borderRadius: {
          topLeft: '4px',
          topRight: '0',
          bottomLeft: '4px',
          bottomRight: '0'
        },
        icon: require('@/commons/images/toolbar_select@2x.png'),
        groupId: handleId,
        toolTip: '选择',
        onClicked: (graphView) => {
          graphView.setEditable(true);
        },
      },
      {
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_zoom_in@2x.png'),
        toolTip: '放大',
        onClicked: (graphView) => {
          graphView.zoomIn(true);
        },
      },
      {
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_zoom_out@2x.png'),
        toolTip: '缩小',
        onClicked: (graphView) => {
          graphView.zoomOut(true);
        },
      },
      {
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_proportion@2x.png'),
        toolTip: '1:1',
        onClicked: (graphView) => {
          graphView.setZoom(1, true);
        },
      },
      {
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_full-screen@2x.png'),
        borderRadius: {
          topLeft: '0',
          topRight: '4px',
          bottomLeft: '0',
          bottomRight: '4px'
        },
        toolTip: '纵览',
        onClicked: (graphView) => {
          graphView.fitContent(true);
        },
      },
      '',
      {
        selected: false,
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_line@2x.png'),
        borderLeft: '1px solid rgba(25,34,59,0.08)',
        borderRadius: {
          topLeft: '4px',
          topRight: '0',
          bottomLeft: '4px',
          bottomRight: '0'
        },
        groupId: handleId,
        toolTip: '直线',
        onClicked: (graphView,$vue) => {
          graphView.setInteractors([
            new ht.graph.DefaultInteractor(graphView),
            new ht.graph.TouchInteractor(graphView, {
              selectable: false,
            }),
            new CreateEdgeInteractor($vue.canvas.graphView),
          ]);
        },
      },
      {
        selected: false,
        background: btBgColor,
        selectBackground: btnSelectColor,
        icon: require('@/commons/images/toolbar_right_angle@2x.png'),
        borderRadius: {
          topLeft: '0',
          topRight: '4px',
          bottomLeft: '0',
          bottomRight: '4px'
        },
        groupId: handleId,
        toolTip: '直角线',
        onClicked: (graphView,$vue) => {
          graphView.setInteractors([
            new ht.graph.DefaultInteractor(graphView),
            new ht.graph.TouchInteractor(graphView, {
              selectable: false,
            }),
            new CreateEdgeInteractor($vue.canvas.graphView, 'h.v'),
          ]);
        },
      },
      '',
      {
        background: btBgColor,
        borderLeft: '1px solid rgba(25,34,59,0.08)',
        borderRadius: {
          topLeft: '4px',
          topRight: '0',
          bottomLeft: '4px',
          bottomRight: '0'
        },
        icon: require('@/commons/images/toolbar_clear@2x.png'), // require('@/commons/images/toolbar_delete@2x.png')
        selectBackground: btnSelectColor,
        toolTip: '删除',
        onClicked: (graphView, $vue) => {
          _deleteGraphData(graphView, $vue);
        },
      },
      // {
      //   background: btBgColor,
      //   selectBackground: btnSelectColor,
      //   icon: require('@/commons/images/toolbar_clear@2x.png'),
      //   toolTip: '清空',
      //   onClicked: (graphView, $vue) => {
      //     _deleteAllGraphData(graphView, $vue);
      //   },
      // },
      {
        background: btBgColor,
        selectBackground: btnSelectColor,
        borderRadius: {
          topLeft: '0',
          topRight: '4px',
          bottomLeft: '0',
          bottomRight: '4px'
        },
        icon: require('@/commons/images/toolbar_save@2x.png'),
        toolTip: '保存',
        onClicked: (graphView, $vue) => {
          _saveGraphData(graphView, $vue, 'show');
        },
      },
      // {
      //   background: btBgColor,
      //   selectBackground: btnSelectColor,
      //   borderRadius: {
      //     topLeft: '0',
      //     topRight: '4px',
      //     bottomLeft: '0',
      //     bottomRight: '4px'
      //   },
      //   icon: require('@/commons/images/toolbar_save@2x.png'),
      //   toolTip: '导出',
      //   onClicked: (graphView, $vue) => {
      //     var doc = window.open().document;
      //     doc.open();
      //     doc.write('<pre>' + graphView.dm().serialize() + '</pre>');
      //     doc.close();
      //     doc.body.style.margin = '0';
      //     doc.title = 'Export JSON at ' + new Date();
      //   },
      // }
    ];
  }
}

function _deleteAllGraphData(graphView, $vue) {
  let dm = graphView.dm();
  let deleteList = [];
  let elementStatus = {
    isAll: true
  };
  dm.each(el => {
    if (el.a('proType')) {
      let obj = {
        service_id: el.a('service_id'),
        canvas_uuid: el.a('uuid'),
      };
      deleteList.push(obj)
    }
  });
  if (deleteList.length > 0) {
    if ($vue.deleteNodeFromCanvas) {
       $vue.deleteNodeFromCanvas(deleteList,elementStatus).then(res => {
        if (res) {
          dm.clear();
          $vue.currentNodeData = null;
          _saveGraphData(graphView, $vue);
          _saveGraphRelations(graphView, $vue);
        }
      });
    }
  }else {
    dm.clear();
  }
}
function _deleteGraphData(graphView, $vue) {
  let deleteElement = graphView.dm().sm().getLastData();
  let deleteList = [];
  let elementStatus = {
    isGroup: false,
    isMain: false
  };
  if (deleteElement) {
    switch (deleteElement.a('elementType')) {
      case 'node':
        elementStatus.isGroup = false;
        if (deleteElement.a('proType') === proTypeSet.main) {
          elementStatus.isMain = true;
          deleteElement.getParent().eachChild(child => {
            if (child.a('proType')) {
              let obj = {
                service_id: child.a('service_id'),
                canvas_uuid: child.a('uuid'),
              };
              deleteList.push(obj)
            }
          });
          deleteElement = deleteElement.getParent();
        }else if (deleteElement.a('proType') !== proTypeSet.main) {
          elementStatus.isMain = false;
          let obj = {
            service_id: deleteElement.a('service_id'),
            canvas_uuid: deleteElement.a('uuid')
          };
          deleteList.push(obj)
        }
        break;
      case 'group':
        elementStatus.isGroup = true;
        elementStatus.isMain = false;
        deleteElement.eachChild(child => {
          if (child.a('proType')) {
            let obj = {
              service_id: child.a('service_id'),
              canvas_uuid: child.a('uuid'),
            };
            deleteList.push(obj)
          }
        });
        break;
      case 'edge':
        graphView.dm().remove(deleteElement);
        _saveGraphData(graphView, $vue);
        _saveGraphRelations(graphView, $vue);
        break;
      default:
        graphView.dm().remove(deleteElement);
        break;
    }
    if (deleteList.length > 0) {
      if ($vue.deleteNodeFromCanvas) {
        $vue.deleteNodeFromCanvas(deleteList,elementStatus).then(res => {
          if (res) {
            if (elementStatus.isGroup) {
              deleteElement.eachChild(child => {
                _deleteAttachesNode(child, $vue);
              });
            }
            _deleteAttachesNode(deleteElement, $vue);
            graphView.dm().remove(deleteElement);
            $vue.currentNodeData = null;
            _saveGraphData(graphView, $vue);
            _saveGraphRelations(graphView, $vue);
          }
        });
      }
    }
  }
}
// 删除吸附图元
function _deleteAttachesNode(host, $vue) {
  let graphView = $vue.canvas.graphView.$graphView;
  let attachesList = host.getAttaches();
  if (attachesList && !attachesList.isEmpty()) {
    [...attachesList._as].forEach(item=>{
      graphView.dm().remove(item);
    })
  }
}
function _saveGraphData(graphView, $vue, status) {
  let canvas_json = JSON.stringify(JSON.parse(graphView.dm().serialize()));
  if (typeof $vue.saveCanvasData === 'function') {
    $vue.saveCanvasData(canvas_json, status);
  }
}

function _saveGraphRelations(graphView, $vue) {
  let relations = {
    group: {},
    edge: [],
  };
  graphView.each(el => {
    if (el.a('elementType') === 'group') {
      let mainKey = '';
      el.eachChild(child => {
        if (child.a('proType') === proTypeSet.main) {
          mainKey = child.a('uuid');
          relations.group[mainKey] = [];
        }
      });
      el.eachChild(child => {
        if (child.a('proType') !== proTypeSet.main) {
          relations.group[mainKey].push(child.a('uuid'));
        }
      });
    }
    if (el.a('elementType') === 'edge') {
      let sourceNode = el.getSource();
      let targetNode = el.getTarget();
      let sourceData = _getOriginNodeData(sourceNode);
      let targetData = _getOriginNodeData(targetNode);
      let edgeRelation = {
        source_uuid: sourceData.uuid,
        target_uuid: targetData.uuid
      };
      relations.edge.push(edgeRelation);
    }
  });
  if (typeof $vue.saveCanvasRelation === 'function') {
    $vue.saveCanvasRelation(relations);
  }
}

function _getOriginNodeData(el) {
  let data = {};
  switch (el.a('elementType')) {
    case 'node':
      data = el.getAttrObject();
      break;
    case 'group':
      el.eachChild(child => {
        if (child.a('proType') === proTypeSet.main) {
          data = child.getAttrObject();
        }
      });
      break;
    case 'attach':
      let hostNode = el.getHost();
      if (hostNode.a('elementType') === 'node') {
        data = hostNode.getAttrObject();
      } else if(hostNode.a('elementType') === 'group') {
        hostNode.eachChild(child => {
          if (child.a('proType') === proTypeSet.main) {
            data = child.getAttrObject();
          }
        });
      }
      break;
    default:
      break;
  }
  return data
}

export default ToolbarList
