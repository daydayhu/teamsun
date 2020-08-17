import "@/commons/js/HT/ht-form.js"; // 表单组件js文件

import CreateNodeInteractor from "@/commons/js/HT/interactor/create-node-interactor";
import CreateEdgeInteractor from "@/commons/js/HT/interactor/create-edge-interactor";

const btnIconColor = "rgb(159, 159, 159)",
  btnSelectColor = "rgb(231, 231, 231)",
  btBgColor = "#fff";

const proTypeSet = {
  main: 1, // 主产品
  affiliate: 2 // 附加产品
};

class Toolbar {
  constructor(vue) {
    this.$toolbar = new ht.widget.FormPane();
    this.$vue = vue;
  }
  init() {
    this._setToolbarDefaultStyle();
    this._configToolbar();
  }
  _setToolbarDefaultStyle() {
    let fp = this.$toolbar;
    // 工具栏样式配置
    fp.setVGap(0); // 表单组件垂直间距
    fp.setHGap(0); // 表单组件水平间距
    fp.setHPadding(0); // 设置表单左边和右边与组件内容的间距，默认值为8
    fp.setVPadding(5); // 设置表单顶部和底部与组件内容的间距，默认值为8
    fp.setRowHeight(40); // 设置表单行高
    // fp.getView().style.backgroundColor = '#fff';
  }
  _configToolbar() {
    let fp = this.$toolbar;
    let graphView = this.$vue.canvas.graphView.$graphView;
    let buttonList = [
      "",
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/select.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          togglable: true,
          groupId: "t",
          selected: true,
          toolTip: "选择",
          onClicked: () => {
            graphView.setEditable(true);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/zoom-in.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "放大",
          onClicked: () => {
            graphView.zoomIn(true);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/zoom-out.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "缩小",
          onClicked: () => {
            graphView.zoomOut(true);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/proportion.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "1:1",
          onClicked: () => {
            graphView.setZoom(1, true);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/full-screen.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "纵览",
          onClicked: () => {
            graphView.fitContent(true);
          }
        }
      },
      "",
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/node.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          togglable: true,
          groupId: "t",
          toolTip: "节点",
          onClicked: () => {
            graphView.setInteractors([
              new ht.graph.DefaultInteractor(graphView),
              new ht.graph.TouchInteractor(graphView, {
                selectable: false
              }),
              new CreateNodeInteractor(graphView)
            ]);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/line.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          togglable: true,
          groupId: "t",
          toolTip: "直线",
          onClicked: () => {
            graphView.setInteractors([
              new ht.graph.DefaultInteractor(graphView),
              new ht.graph.TouchInteractor(graphView, {
                selectable: false
              }),
              new CreateEdgeInteractor(graphView)
            ]);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/right-angle.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          togglable: true,
          groupId: "t",
          toolTip: "直角线",
          onClicked: () => {
            graphView.setInteractors([
              new ht.graph.DefaultInteractor(graphView),
              new ht.graph.TouchInteractor(graphView, {
                selectable: false
              }),
              new CreateEdgeInteractor(graphView, "h.v")
            ]);
          }
        }
      },
      "",
      {
        button: {
          background: btBgColor,
          label: "删除",
          // icon: require('@/commons/icons/ht/export.json'),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "删除",
          onClicked: () => {
            this._deleteGraphData(graphView);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          label: "清空",
          // icon: require('@/commons/icons/ht/export.json'),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "清空",
          onClicked: () => {
            this._deleteAllGraphData(graphView);
          }
        }
      },
      {
        button: {
          background: btBgColor,
          label: "保存",
          // icon: require('@/commons/icons/ht/export.json'),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "保存",
          onClicked: () => {
            this._saveGraphData(graphView, "show");
          }
        }
      },
      {
        button: {
          background: btBgColor,
          icon: require("@/commons/icons/ht/export.json"),
          iconColor: btnIconColor,
          selectBackground: btnSelectColor,
          toolTip: "导出",
          onClicked: () => {
            var doc = window.open().document;
            doc.open();
            doc.write("<pre>" + graphView.dm().serialize() + "</pre>");
            doc.close();
            doc.body.style.margin = "0";
            doc.title = "Export JSON at " + new Date();
          }
        }
      },
      ""
    ];
    let toolWidthList = [
      0.1,
      36,
      36,
      36,
      36,
      36,
      20,
      36,
      36,
      36,
      20,
      36,
      36,
      36,
      36,
      0.1
    ];
    let toolHeight = 30;
    fp.addRow(buttonList, toolWidthList, toolHeight);
  }
  _deleteAllGraphData(graphView) {
    let dm = graphView.dm();
    let deleteList = [];
    let elementStatus = {
      isAll: true
    };
    dm.each(el => {
      if (el.a("proType")) {
        let obj = {
          service_id: el.a("service_id"),
          canvas_uuid: el.a("uuid")
        };
        deleteList.push(obj);
      }
    });
    if (deleteList.length > 0) {
      this.$vue.deleteNodeFromCanvas(deleteList, elementStatus).then(res => {
        if (res) {
          dm.clear();
          this.$vue.currentNodeData = null;
          this._saveGraphData(graphView, "hide");
        }
      });
    } else {
      dm.clear();
    }
  }
  _deleteGraphData(graphView) {
    let deleteElement = graphView
      .dm()
      .sm()
      .getLastData();
    let deleteList = [];
    let elementStatus = {
      isGroup: false,
      isMain: false
    };
    if (deleteElement) {
      switch (deleteElement.a("elementType")) {
        case "node":
          elementStatus.isGroup = false;
          if (deleteElement.a("proType") === proTypeSet.main) {
            elementStatus.isMain = true;
            deleteElement.getParent().eachChild(child => {
              if (child.a("proType")) {
                let obj = {
                  service_id: child.a("service_id"),
                  canvas_uuid: child.a("uuid")
                };
                deleteList.push(obj);
              }
            });
            deleteElement = deleteElement.getParent();
          } else if (deleteElement.a("proType") === proTypeSet.affiliate) {
            elementStatus.isMain = false;
            let obj = {
              service_id: deleteElement.a("service_id"),
              canvas_uuid: deleteElement.a("uuid")
            };
            deleteList.push(obj);
          }
          break;
        case "group":
          elementStatus.isGroup = true;
          elementStatus.isMain = false;
          deleteElement.eachChild(child => {
            if (child.a("proType")) {
              let obj = {
                service_id: child.a("service_id"),
                canvas_uuid: child.a("uuid")
              };
              deleteList.push(obj);
            }
          });
          break;
        default:
          break;
      }
      if (deleteList.length > 0) {
        this.$vue.deleteNodeFromCanvas(deleteList, elementStatus).then(res => {
          if (res) {
            graphView.dm().remove(deleteElement);
            this.$vue.currentNodeData = null;
            this._saveGraphData(graphView, "hide");
          }
        });
      } else {
        graphView.dm().remove(deleteElement);
      }
    }
  }
  _getOriginNodeData(el) {
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
  _saveGraphData(graphView, status) {
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
    this.$vue.saveCanvasData(saveObj, status);
  }
}

export default Toolbar;
