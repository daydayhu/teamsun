<template>
  <div class="addOrderSecond">
    <div class="content">
      <div class="left-c">
        <ul class="service-list">
          <li v-for="(group, g_key) in paletteList" :key="g_key">
            <div class="group-head">
              <div class="title">{{ group.name }}</div>
            </div>
            <ul class="group-list">
              <li v-for="(node, n_index) in group.items" :key="n_index" draggable="true" @dragstart="elementDragStart($event, node, g_key)">
                <div class="icon-c">
                  <img :src="node.image ? node.image : defaultIconUrl" alt="" />
                </div>
                <div class="name">{{ node.name }}</div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="right-c">
        <div class="canvas-c" ref="canvas-c">
          <div class="component-view" ref="component-view"></div>
        </div>
      </div>
    </div>
    <setNode v-if="dialogFormVisible" :edit-data="editData" :dialog-form-visible="dialogFormVisible" @editNode="setName" @close-dialog="closeDialog('dialogFormVisible')"></setNode>
    <setImage v-if="isUpload" :edit-data="editData" :dialog-form-visible="isUpload" @setImage="setImage" @close-dialog="closeDialog('isUpload')"></setImage>
  </div>
</template>

<script>
//引入画布代码
import '@/commons/js/HT/ht-common.js';
import GraphView from '../ht/ddb-graphView';
import Toolbar from '../ht/ddb-toolbar';
import '../ht/ddb-config';
import setNode from './setNode.vue'
import setImage from './setImage.vue'
import * as requestMethod from '@/modules/apps/api/applicationCenter/applicationSystem.js';

export default {
  data() {
    return {
      can_modify: true,
      // 画布相关属性
      editData: {},
      isUpload: false,
      paletteList: null,
      canvas: {
        palette: null,
        graphView: null,
        toolbar: null,
      },
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
    this.getPaletteList();
    this.layoutCanvas();
    this.startCanvas();
    this.getCanvasData();
    this.setClick();
  },
  components: {
    setImage,
    setNode
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
      // 2.创建视图
      // 2.1 创建顶部视图
      let topMainView = new ht.widget.SplitView(this.canvas.toolbar.$toolbar, this.canvas.graphView.$graphView, 'v', 40);
      let topSpaceView = '';
      let topView = new ht.widget.SplitView(topMainView, topSpaceView, 'h', -20);
      // // 2.2 创建底部视图
      // let bottomView = this.$refs['component-view'];
      // // 2.3 创建主视图
      // let mainView = new ht.widget.SplitView(topView, bottomView, 'v', -1);
      // 2.4 配置视图样式
      topMainView.setDividerBackground('#E7EDF3');
      topMainView.setDragOpacity('1');
      //topMainView.setDraggable(false);
      topMainView.getView().style.backgroundColor = '#fff';
      topView.setDividerBackground('#E7EDF3');
      topView.setDragOpacity('1');
      topView.getView().className = 'canvas-view';
      // mainView.setDividerBackground('#E7EDF3');
      // mainView.setDragOpacity('1');
      // mainView.getView().className = 'canvas-view';
      // 3 注入容器
      containerDom.appendChild(topView.getView());
      // 4 布局变化事件监听
      topView.addViewListener(function (e) {
        if (e.kind === 'layout') {
          let splitP = mainView.getPosition();
          console.log('splitP', splitP);
        }
      });
      // this.ticketFrameworkViewRightClickMenu(topView, this.$palette.getDataModel());
    },
    setClick() {
      let graphView = this.canvas.graphView.$graphView;
      graphView.addInteractorListener(e => {
        if (e.kind === 'onUp') {
          console.log('在图元处放开');
        }
        else if (e.kind === 'onEndDrag') {
          console.log('图元结束拖拽');
        }
        else if (e.kind === 'doubleClickData') {
          console.log(e.data + '被双击');
          if (e.data._attrObject.comType == "upload_img") {
            this.isUpload = true;
            this.editData = e.data;
            console.log(e.data);
          } else {
            this.dialogFormVisible = true;
            this.editData = e.data
          }
        }
      });
    },
    closeDialog(tag) { this[tag] = false },
    // 启动画布
    startCanvas() {
      for (let component of Object.values(this.canvas)) { component.init(); }
    },
    setName(val) {
      let graphView = this.canvas.graphView.$graphView;
      //处理名字站位
      let chineseReg = /[\u4e00-\u9fa5]/;//中文正则
      let zfLength = 0;
      let setNodeName = "";
      let nodeName = val._name.replace(/\s*/g, '');
      if (val._styleMap['label.position'] == "14" || val._styleMap['label.position'] == "20") {
        for (var i = 0; i < nodeName.length; i++) {
          setNodeName += nodeName[i] + "\n";
        }
      } else {
        for (var i = 0; i < nodeName.length; i++) {
          if (chineseReg.test(nodeName[i])) {//中文正则
            zfLength += 2;
          } else {//非中文
            zfLength += 1;
          }
          setNodeName += nodeName[i];
          if (zfLength % 16 == 0) {
            setNodeName += "\n";
          }
        }
        // graphView.dm().getDataById(val._id).s("label.offset.x", val._styleMap['label.offset.x'] - setNodeName.length);
      }
      graphView.dm().getDataById(val._id).s("label", setNodeName);
      graphView.dm().getDataById(val._id).s("label.position", val._styleMap['label.position']);
      graphView.dm().getDataById(val._id).setStyle("shape.background", val._styleMap['shape.background']);
      graphView.dm().getDataById(val._id).setStyle("shape.border.color", val._styleMap['shape.border.color']);
      graphView.dm().getDataById(val._id).setStyle('shape', val._styleMap.shape);
      if (val.borderType == 'line') {//实线
        graphView.dm().getDataById(val._id).setStyle("shape.border.width", 2);
        graphView.dm().getDataById(val._id).setStyle("shape.border.color", val._styleMap['shape.border.color']);
      }
      else if (val.borderType == 'dash') {//虚线
        graphView.dm().getDataById(val._id).s({
          "shape.dash": true,
          "shape.dash.pattern": [5, 5],
          "shape.dash.offset": 0,
          "shape.dash.color": val._styleMap['shape.border.color'],
          "shape.dash.width": 2
        });
      }
      this.dialogFormVisible = false;
    },
    setImage(val) {
      let graphView = this.canvas.graphView.$graphView;
      graphView.dm().getDataById(val.id).s("label", val._name);
      if (val.data) {
        graphView.dm().getDataById(val.id).setImage(val.data.file_info[0].download_url);
      }
      graphView.dm().getDataById(val.id).setStyle('image.stretch', 'uniform');
      // graphView.dm().getDataById(val.id).a("uploadFileName", filename);
      //graphView.dm().getDataById(val.id).a("uploadFile", val.data.file_info[0].download_url);
      graphView.dm().getDataById(val.id).setName(val._name);
      this.isUpload = false;
    },
    // 删除图元从画布
    deleteNodeFromCanvas(deleteList, elementStatus) {
      console.log(3333);
      let hint;
      if (elementStatus.isAll) {
        hint = '确认清除画布数据?'
      } else {
        hint = elementStatus.isGroup ? '确认删除组？' : elementStatus.isMain ? '确认删除主图元，删除主图元将删除整个组！' : '确认删除图元？';
      }
      return this.$confirm(hint, '提示', {
        type: 'warning',
      })
    },
    // 获取面板数据
    getPaletteList() {
      this.paletteList = {
        operation: {
          name: '资源类型',
          items: [
            {
              id: '01',
              name: '上传图片',
              image: require('@/commons/images/upload_img.png'),
              draggable: true,
              comType: 'upload_img',
              proType: 2,
            },
            {
              id: '02',
              name: '图层',
              image: require('@/commons/images/img_node.png'),
              comType: 'layer',
              draggable: true,
              proType: 2,
            },
          ],
        }
      };
      //this.registerNodeIcon();
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
        //app_id: 10,
        app_id: this.$route.query.app_id
      };
      requestMethod.getAppsArch('get', param).then(res => {
        if (res.code === 200) {
          this.can_modify = res.data.can_modify;
          let canvas_json = res.data.canvas_text;
          if (canvas_json) {
            this.canvas.graphView.deserialize(canvas_json);
          }
        }
      });
    },
    //右键菜单
    ticketFrameworkViewRightClickMenu(gv, dm) {
      var menuJson = [
        {
          label: "复制",
          action: function (item, event) {
            var data = gv.dm().sm().ld();
            var tag_id = Date.parse(new Date());//时间戳
            var dashOrSolidLine = data.getStyle("shape.dash");//虚线 实线
            var newNode = new ht.Node();
            var newNodeName = "新图层";
            var newNodeSetName = "";
            newNode.setTag(tag_id);//设置id
            newNode.a("comType", "layer");//设置属性
            newNode.setSize(data.getSize());//设置宽度和高度
            newNode.setPosition({ x: data.getPosition().x + 50, y: data.getPosition().y + 50 });//设置位置
            newNode.setStyle('shape', data.getStyle("shape"));//设置形状
            newNode.setStyle("shape.background", data.getStyle("shape.background"));//设置背景颜色
            if (dashOrSolidLine) {//虚线  
              newNode.s({
                "shape.dash": true,
                "shape.dash.pattern": [5, 5],
                "shape.dash.offset": 0,
                "shape.dash.color": data.getStyle("shape.dash.color"),
                "shape.dash.width": 1,
                "shape.border.color": data.getStyle("shape.border.color")
              });
            } else {//实线
              newNode.setStyle("shape.border.color", data.getStyle("shape.border.color"));//设置边框颜色
              newNode.setStyle("shape.border.width", data.getStyle("shape.border.width"));//设置边框宽度
            }
            if (data.getStyle("label.position") == "14" || data.getStyle("label.position") == "20") {
              for (var i = 0; i < newNodeName.length; i++) {
                newNodeSetName += newNodeName[i] + "\n";
              }
            } else {
              newNodeSetName = newNodeName;
            }
            newNode.setName(newNodeSetName);//设置名称
            newNode.s("label.position", data.getStyle("label.position"));//设置字体位置
            dm.add(newNode);
          }
        }
        , {
          label: "图层",
          action: function (item) {
            // console.log(item.label);
          },
          items: [{
            label: "图层上移",
            action: function (item, e) {
              var data = gv.dm().sm().ld();
              dm.sendToTop(data);//将data在拓扑上置顶
            }
          }, {
            label: "图层下移",
            action: function (item) {
              var data = gv.dm().sm().ld();
              dm.sendToBottom(data);//将data在拓扑上置底
            }
          }]
        },
        {
          label: "删除图层",
          action: function (item) {
            item.code = 'Delete';
            g2d1.handleDelete(item);
          }
        },
      ];
      var view1 = gv.getView();
      var contextmenu = new ht.widget.ContextMenu();
      contextmenu.setWidth(100);
      contextmenu.setHeight(60);
      //重写beforeShow，动态设置菜单项
      contextmenu.beforeShow = function (e) {//beforeShow 菜单显示之前被调用，可以重写此方法实现动态菜单功能
        var data = g2d1.getDataAt(e);
        if (data != undefined) {
          this.setItems(menuJson);
        } else {
          this.setItems(null); //参数为null不会阻止浏览器默认的右键菜单，如果要阻止，可将参数设为空数组：[]
        }
      };
      contextmenu.addTo(view1);
    },
    // 保存画布
    saveCanvasData(canvas_json, operate) {
      let param = {
        //app_id: 10,
        app_id: this.$route.query.app_id,
        canvas_text: canvas_json
        //app_id: this.$route.query.app_id
      };
      requestMethod.getAppsArch('put', param).then(res => {
        if (res.code === 200) {
          let msg = ''
          switch (operate) {
            case 'del':
              msg = "删除成功"
              break;
            case 'clear':
              msg = "清空成功"
              break;
            default:
              msg = "保存成功"
          }
          this.$message({
            type: "success",
            message: msg
          });
        } else {
          this.$message(res.data.message)
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
                overflow: hidden;
                :hover {
                  border-color: #ccc;
                }
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
