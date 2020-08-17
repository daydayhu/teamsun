<template>
  <div class="collapse-menu" :style="{width: menuLabel === '服务列表' ? '928px' : ''}">

    <div class="menu-left">
      <ul>
        <li @mouseenter.self="menuMouseOverHandler(menuData,menuIndex)"
            v-for="(menuData,menuIndex) in menuList"
            @click="menuClick(menuData,menuIndex)"
            :key="'menuIndex'+menuIndex"
        >
          <span class="itemInfo" v-if="menuData.menu_name === '服务列表'">
             <svg-icon icon-class='service_menu'></svg-icon>
             <span class="name">{{menuData.menu_name}}</span>
          </span>

          <span v-if="menuData.menu_name === '服务列表'"
                :class="{'arrow-right': menuLabel === '服务列表'}"
                class="icon-left el-icon-arrow-down el-icon--right"
          ></span>
        </li>
      </ul>
    </div>


    <!--边框-->
    <div class="cm-center"  v-if="menuLabel === '服务列表'"></div>
    <!-- <transition name="menu-view" > -->
    <div class="menu-right"  ref="menuRight" @mouseleave="handleMaskLeave()" v-if="menuLabel === '服务列表'">
      <div class="cm-search">
        <!-- <el-input
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
          v-model="input2"
          @change="search"
        ></el-input> -->
      </div>
      <div class="cm-menu">
        <span>
          <svg-icon icon-class="time" class="setting-icon"></svg-icon>
          <b>最近访问的服务:</b>
        </span>
        <div class="menu-title">
          <div v-for="(menuData,menuIndex) in requestMenu"
               :key="'menuIndex'+menuIndex"
               @click="goRequestMenu(menuData)">
            {{menuData.menu_name}}
          </div>
        </div>
        <div class="service-list">
          <div class="service-choice">
            <div class="service-title">
              <svg-icon icon-class="setting" class="setting-icon"></svg-icon>
              <b>服务列表展示:</b>
            </div>
            <!--<el-row>-->
            <!--<el-col :span="8">-->
            <!--<el-radio v-model="radio" label="2" border>服务分类 + 服务</el-radio>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
            <!--<el-radio v-model="radio" label="3" border>服务 + 一级菜单</el-radio>-->
            <!--</el-col>-->
            <!--<el-col :span="8">-->
            <!--<el-radio v-model="radio" label="1" border>服务分类 + 服务 + 一级菜单</el-radio>-->
            <!--</el-col>-->
            <!--</el-row>-->
          </div>
          <div class="service-show">
            <el-row>
              <div :style="{clear:serviceIndex % 3 === 0 ? 'left':'right', width:'33%', float:'left'}"
                   v-for="(serviceData,serviceIndex) in serviceListData"
                   :key="'serviceIndex'+serviceIndex">
                <div class="serverTypeName">
                  <div @mouseenter="iconMouseEnter(serviceData)"
                       @mouseleave="iconMouseLeave(serviceData)">
                    <h4 :style="{color: serviceData.isActive ? '#F25113' : ''}">{{serviceData.menu_name}}</h4>
                  </div>
                </div>
                <div class="item serverItem"
                     @click.stop="itemClickHandler(item,index)"
                     v-for="(item,index) in serviceData.children"
                     :key="'index'+index"
                     @mouseenter="iconMouseEnter(item)"
                     @mouseleave="iconMouseLeave(item)">
                  <div class="serverItemName">
                    <span class="item-menu" :style="{color: item.isActive ? '#F25113' : ''}">{{item.menu_name}}</span>
                  </div>
                  <!--<div class="serverItemChildrenC" v-if="item.children && item.children.length > 0">-->
                    <!--<div class="item-node "-->
                         <!--v-for="(node,nodeIndex) in item.children"-->
                         <!--:key="'nodeIndex'+nodeIndex"-->
                         <!--:style="{color: node.isActive ? '#F25113' : ''}"-->
                         <!--@click.stop="itemClickHandler(node)"-->
                    <!--&gt;{{node.menu_name}}</div>-->
                  <!--</div>-->
                </div>
              </div>
            </el-row>
          </div>
        </div>
      </div>

    </div>
    <!-- </transition> -->
    <!-- <div class="mask" v-if="menuLabel === '服务列表'" @click="maskClick()"></div> -->

  </div>
</template>
<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      menuList: { // 子菜单列表 目前只有服务列表需展示
        type: Array
      },
      serviceList: { // 服务列表 子菜单=>menuList
        type: Array
      },
      requestMenu: { // 最近访问记录
        type: Array
      }
    },
    computed: {
      ...mapState('global', [
        'currentModule','modulesList','entryModule','routerMode'
      ]),
      serviceListData() {
        switch (this.radio) {
          case "3":
            return this.filterData(this.serviceList);
          default:
            return this.serviceList;
        }
      }
    },
    data() {
      return {
        isCollapse: false,
        input2: "",
        menuLabel: "",
        iconChange: null,
        value: "",
        radio: "1",
        //遮罩层
        //maskVisible:false,
      };
    },
    methods: {
      maskClick(){
        this.menuLabel=""

      },
      filterData(data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          arr.push(...data[i].children);
        }
        return arr;
      },
      search() {
        let data = JSON.parse(JSON.stringify(this.$parent.testMenuData));
        let arr = [];
        if (this.input2.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].menu_name.indexOf(this.input2) !== -1) {
              arr.push(data[i].menu_id);
            }
          }
        }
        this.$emit("search-item", arr);
      },
      menuMouseOverHandler(data, index) {
        this.menuLabel = data.menu_name;
        this.$nextTick(e=>{
          console.log("menuRight",this.$refs.menuRight)
          let menuRight=this.$refs.menuRight
        })
      },
      handleMaskEnter(){

      },
      handleMaskLeave(){
       this.menuLabel =""

      },
      menuClick(data, index) {
        if (data.menu_name !== "服务列表") {
          this.$emit("sub-title", data);
        }
      },
      itemClickHandler(item) {
        if (item.menu_type == 5) { // 服务分类
          return false;
        }
        if (item.menu_type === 6) { // 服务
          return false
          if (item.user_menu_type != 2) {
            //收藏服务
            this.$api.menuApi
            .collectUserMenu("post", {
              menu_id: item.menu_id,
              menu_type: 2,
              menu_alias: item.user_menu_alias
            })
            .then(res => {
              if (res.status) {
                item.usermenu_id = res.data.usermenu_id;
                item.user_menu_type = 2;
                this.$message({
                  message: "服务收藏成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            this.$api.menuApi
            .confirmUserMenu("delete", {
              user_menus: [
                {
                  usermenu_id: item.usermenu_id
                }
              ]
            })
            .then(res => {
              if (res.status) {
                item.user_menu_type = 3;
                this.$message({
                  message: "服务取消收藏成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          }
          return false;
        }

        let nodes = [];
        function getParentNodes(id, tree) {
          _getParentNodes([], id, tree);
          return nodes;
        }
        function _getParentNodes(his, targetId, tree) {
          tree.some(list => {
            const children = list.children || [];
            if (list.menu_id === targetId) {
              nodes = his;
              return true;
            } else if (children.length > 0) {
              const history = [...his];
              history.push(list);
              return _getParentNodes(history, targetId, children);
            }
          });
        }
        getParentNodes(item.menu_id, this.serviceList);

        // this.$emit("sub-title", nodes[1]);
        this.$emit("sub-title", nodes[0]);
        this.toNextPage(item)
      },
      iconMouseEnter(item) {
        this.iconChange = item.menu_id
      },
      iconMouseLeave(item) {
        this.iconChange = null;
      },
      goRequestMenu(data) {

        this.goRequestPath(data, this.serviceList);
      },
      goRequestPath(data, treeData) {
        for (let i = 0; i < treeData.length; i++) {
          if (data.menu_id === treeData[i].menu_id) {
            this.$emit("sub-title", treeData[i]);
            this.$router.push({ path: data.menu_url });
          } else {
            if ((treeData[i].children)&&(treeData[i].children.length > 0)) {
              this.goRequestPath(data, treeData[i].children);
            }
          }
        }
      },
      toNextPage(toNode) {
        let toModule = toNode ? toNode.menu_tag : null;
        console.log('toModule',toModule);
        if (toModule && this.modulesList.indexOf(toModule) !== -1) {
          let menu_url;
          if (toNode.menu_url) {
            menu_url = toNode.menu_url
          }else {
            if (toNode.children && toNode.children.length) {
              menu_url = toNode.children.filter(item => item.menu_type === 1)[0].menu_url || ''
            }else {
              menu_url = ''
            }
          }
          if (toModule !== this.currentModule) {
            switch (process.env.ROUTER_MODE) {
              case 'hash':
                if (process.env.ENV_TYPE === 'merge') {
                  if (toModule === this.entryModule) {
                    window.location.href = `./#${menu_url}?menu_id=${toNode.menu_id}`;
                  }else {
                    window.location.href = `./${toModule}.html#${menu_url}?menu_id=${toNode.menu_id}`;
                  }
                }else {
                  window.location.href = `../${toModule}/#${menu_url}?menu_id=${toNode.menu_id}`
                }
                break;
              case 'history':
                if (process.env.ENV_TYPE === 'merge') {
                  if (toModule === this.entryModule) {
                    window.location.href = `${window.location.origin}${menu_url}?menu_id=${toNode.menu_id}`;
                  }else {
                    window.location.href = `${window.location.origin}/${toModule}${menu_url}?menu_id=${toNode.menu_id}`
                  }
                }else {
                  // TODO: 待
                  if (toModule === this.entryModule) {
                    window.location.href = `${window.location.origin}${menu_url}?menu_id=${toNode.menu_id}`;
                  }else {
                    window.location.href = `${window.location.origin}/${toModule}${menu_url}?menu_id=${toNode.menu_id}`
                  }
                }
                break;
              default: break;
            }
          }else {
            this.$router.push({
              path: menu_url,
              query: {
                menu_id: toNode.menu_id
              }
            });
          }
        }else {
          // TODO: 不存在所属模块，将不能正常跳转
          this.$message({
            message: "未找到所属模块, 无法跳转",
            type: "error"
          });
          return false
        }
      }
    }
  };
</script>
<style lang="less" scoped>
.menu-view-enter-active{
  transition: opacity .3s ;
}
.menu-view-enter{
     opacity: 0;
}
.menu-view-leave-active{
 transition: opacity .3s ;
}
.menu-view-leave-to{
    opacity: 0;
}
.mask{
  position: fixed;
  bottom: 0px;
  left: 927px;
  right: 0px;
  top: 0px;
  background-color: #000;
  opacity: 0.5;
  z-index: -1;

}
  .collapse-menu {
    width: 100%;
    @flex();
    font-size: 14px;
    font-family: @g-font-family-r;
    overflow: hidden;
    .menu-left {
      width: 213px;
      height: 100vh;
      ul {
        padding: 0 8px;
        li {
          height: 40px; // 无高度 将只能展示服务列表
          transition: all 0.8s;
          display: flex;
          align-items: center;
          color: rgba(25,34,59,1);
          span {
            transition: all 0.3s;
            transform: rotate(0deg);
          }
          .itemInfo {
            .svg-icon {
              margin-left: 9px;
              width: 14px;
              height: 14px;
            }
            .name {
              margin-left: 18px;
            }
          }
          .arrow-right {
            transform: rotate(-90deg);
          }
          .icon-left {
            margin-left: auto;
            margin-right: 6px;
            line-height: 3;
          }
          &:hover {
            cursor: pointer;
            color: #20a0ff;
          }
        }
        li:first-child {
          height: 47px;
          border-bottom: 1px solid rgba(52,69,99,0.08);
        }
      }
    }
    .cm-center {
      width: 1px;
      height: 100vh;
      background-color: rgba(52,69,99,0.08);
      float: left;
      margin-left:1px;
    }
    .menu-right {
      width: 714px;
      height: 100vh;
      font-size: 14px;
      position: relative;
      padding: 0 40px;
      overflow-y: auto;
      .cm-search {
        margin: 15px 0 10px;
        width: 610px;
      }
      .cm-menu {
        .setting-icon {
          font-size: 16px;
          margin-right: 3px;
          color: #5f6368;
        }
        .menu-title {
          margin: 15px 0;
          //padding-left: 22px;
          & > div {
            display: inline-block;
            width: 33%;
            margin-bottom: 12px;
            &:hover {
              cursor: pointer;
              color: #20a0ff;
            }
          }
        }
        .service-list {
          .service-choice {
            margin: 27px 0px 0px 0;
            .service-title {
              height: 30px;
            }
            span {
              display: inline-block;
              margin-right: 5px;
            }
          }
          .service-show {
            margin-bottom:100px;
           // padding-left:22px;
            h4 {
              margin: 20px 0 15px;
              display: inline-block;
            }
            .collect-icon {
              font-size: 16px;
              color: #f59a23;
              margin-left: 20px;
            }
            .item {
              min-height: 25px;
              .collect-icon {
                font-size: 16px;
                color: #f59a23;
                margin-left: 20px;
              }
              .item-menu {
                display: inline-block;
                &:hover {
                  cursor: pointer;
                  color: #20a0ff;
                }
              }
              .item-node {
                padding-top: 10px;
                margin-left: 10px;
                &:hover {
                  cursor: pointer;
                  color: #20a0ff;
                }
                &:nth-last-child(1) {
                  padding-bottom: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
