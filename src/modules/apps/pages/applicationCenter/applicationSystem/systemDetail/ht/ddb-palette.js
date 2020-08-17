import "@/commons/js/HT/ht-palette.js"; // 组件面板js文件

class Palette {
  constructor(vue) {
    this.$palette = new ht.widget.Palette();
    this.$vue = vue;
  }
  init() {
    this.paletteList = this.$vue.paletteList;
    this.$dm = this.$palette.dm();
    this._setDefaultStyle();
    this._addGroups();
  }
  _setDefaultStyle() {
    let palette = this.$palette;
    palette.setItemImageWidth(50); // 设置按钮元素宽度
    palette.setItemImageHeight(50); // 设置按钮元素高度
    palette.setItemMargin(32); // 设置元素之间间距
    palette.setItemImagePadding(4); // 设置按钮元素图片与边框的距离
  }
  _addGroups() {
    for (let groupData of Object.values(this.paletteList)) {
      let group = this._createGroup(groupData);
      groupData.items.forEach(item => {
        this._createNode(item, group);
      });
    }
  }
  _createGroup(data) {
    let group = new ht.Group();
    group.setName(data.name);
    group.setExpanded(true);
    this.$dm.add(group);
    return group;
  }
  _createNode(item, parent) {
    let node = new ht.Node();
    node.setName(item.pro_service_name);
    node.setAttrObject({
      name: item.pro_service_name,
      elementType: "node",
      service_id: item.pro_service_id,
      proType: item.pro_type,
      image: item.service_img_url
    });
    node.setSize(10, 10);
    node.s("draggable", true);
    node.setParent(parent);
    this.$dm.add(node);
    this._registerNodeIcon(node);
    return node;
  }

  _registerNodeIcon(node) {
    if (node && node.a("image")) {
      ht.Default.setImage(`${node.a("name")}-${node.a("id")}`, node.a("image"));
    }
  }
}

export default Palette;
