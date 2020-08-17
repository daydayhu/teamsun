import template from "./index.vue";
import "./index.less";
import user from "@/commons/images/user.png";
import menus from "@/commons/js/menu/index.js";
import {
  testMenu,
  pushMenu,
  pushMenu1,
  pushMenu2,
  pushMenu3,
  pushMenu4,
  pushMenu5
} from "@/commons/js/menu/testMenu.js";
import collapseMenu from "./components/collapseMenu.vue";
import menuSub from "./components/menuSub.vue";
import cookie from "vue-cookie";
import axios from "axios";
import { getQueryVariable } from "@/utils/utils";
import * as messageRequest from '@/modules/apps/api/applicationCenter/myMessage'
import websocket from './utils/websocket'
import Bus from '@/commons/js/bus'


export default {
  ...template,
  mixins:[websocket],
  data() {
    return {
      squareUrl: user,
      search: "",
      collapseMenuShow: false,
      numIndex: null,
      menuTitle: null,
      hideSub: false,
      itemMenu: {},
      searchShow: false,
      serviceList: [],
      userName: "",
      getMenuData: [],
      beforeUnloadTime: "",
      gapTime: "",
      testMenuData: testMenu,
      requestMenu: [],
      isShow: false,
      active: false,
      ssh_url: null,
      tag: null, // 我的信息菜单标示
      source_type: null,
      messageNums: 0,
      messageDrawer: false,
      delayAnimation: null,
      messageList: []
    };
  },

  components: {
    collapseMenu,
    menuSub
  },
  computed: {
    menuData() {
      let data = this.filterData(JSON.parse(JSON.stringify(this.getMenuData)));
      return menus.concat(data);
    },
    subMenu() {
      // TODO: 临时注入vCenter数据 服务分类为根节点 mock数据后期如果后端加上了，就重新去掉
      // this.menuData.forEach(item => {
      //   if (item.menu_name === "云纳管") {
      //     item.children.push(pushMenu1);
      //   } else if (item.menu_name === "云运维") {
      //     item.children.push(pushMenu2);
      //   }
      // });

      let menu = this.menuData.slice(1, this.menuData.length);

      // 服务列表
      this.serviceList = this.menuData.slice(2, this.menuData.length);
      console.log('this.menuData',this.menuData);
      console.log('this.serviceList==',this.serviceList);
      // asc_order 排序
      if (this.serviceList && this.serviceList.length) {
        this.serviceList.forEach(service => {
          if (service.children && service.children.length) {
            service.children.sort(function(a, b) {
              return a['asc_order'] - b['asc_order']
            });
          }
        });
      }
      // TODO: 接口变更 临时改变方式
      // this.serviceList = this.serviceList.concat();

      let arr = [];
      menu.forEach((val, index) => {
        if (index === 0) {
          arr.push(val);
        } else {
          if (val.hasOwnProperty("children") && val.children.length > 0) {
            arr.push(...val.children);
          }
        }
      });
      return arr;
    },
    dashboardMenu() {
      return this.menuData.slice(0, 1)[0];
    },
    subClass() {
      if (!this.isShow) {
        return "menu-sub-ops";
      } else {
        return this.hideSub ? "menu-sub-right" : "menu-sub-left";
      }
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        this.showSubMenu();
      },
      deep: true
    },
    serviceList: {
      handler(val, oldVal) {
        this.showSubMenu();
      },
      deep: true
    }
  },
  methods: {
    filterData(data) {
      let newData = data || [];
      newData.forEach(
        x => x.children && (x.children = this.filterData(x.children))
      );
      return newData;
    },
    goDashboard() {
      this.menuTitle = null;
      this.isShow = false;
      this.$router.push({ path: "/dashboard" });
    },
    clickConsole() {
      window.open(
        this.ssh_url,
        "Derek",
        "height=880,width=1040,status=no,toolbar=no,menubar=no,location=no"
      );
    },
    searchHandler() {
      this.searchShow = !this.searchShow;
    },
    menuMouseOverHandler() {
      this.collapseMenuShow = true;
    },
    mouseLeaveHandler() {
      this.collapseMenuShow = false;
    },
    showSubMenu() {
      let nodes = [];
      if (this.$route.query.menu_id) {
        let menu_id = Number(this.$route.query.menu_id);
        getParentNodes(menu_id, this.serviceList);
        if (
          this.$route.query.menu_id == 5101 ||
          this.$route.query.menu_id == 5102
        ) {
          if (this.source_type != 0) {
            pushMenu5.children.pop();
          }
          this.getSubTitle(pushMenu5);
        } else {
          this.getSubTitle(nodes[0]);
        }
      }

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
    },
    getSubTitle(data) {
      if (!data) {
        return false;
      }
      this.isShow = true;
      this.hideSub = false;
      this.menuTitle = data.menu_name;
      this.collapseMenuShow = false;
      this.itemMenu = Object.assign({}, this.itemMenu, data);
      this.$nextTick(() => {
        this.$refs.menuSub.arrowDir = "right";
      });
    },
    getArrowSub(res) {
      if (res === "right") {
        this.hideSub = false;
      } else {
        this.hideSub = true;
      }
    },
    getInitMenu() {
      this.$api.menuApi.getUserMenu("get", {}).then(res => {
        if (res.status) {
          this.testMenuData = res.data.user_menus;
          this.requestMenu = res.data.recently_visited_menus;
          this.getMenuData = this.convertToTreeData(
            JSON.parse(JSON.stringify(this.testMenuData)),
            null
          );
          console.log('this.getMenuData',this.getMenuData);
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    logout(res) {
      //发请求   请缓存
      this.$api.loginApi.signout({}).then(res => {
        if (res.status) {
          this.$router.push({
            name: "login"
          });
          localStorage.clear();
          sessionStorage.clear();
          // localStorage.removeItem("loginName");
          // cookie.delete('accessToken');
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    baseInfo() {
      window.location.href = "./#/certifiservice/myInfo/baseInfo?menu_id=5101";
    },
    modifyPass() {
      window.location.href =
        "./#/certifiservice/myInfo/modifyPass?menu_id=5102";
    },
    // convertToTreeData(data, pid) {
    //     const result = []
    //     let temp = []
    //     for (let i = 0; i < data.length; i++) {
    //         if (data[i].parent_id === pid) {
    //             temp = this.convertToTreeData(data, data[i].menu_id)
    //             if (temp.length > 0) {
    //                 data[i].children = temp
    //             } else {
    //                 data[i].children = []
    //             }
    //             result.push(data[i])
    //         }
    //     }
    //     return result
    // },
    convertToTreeData(data, pid) {
      return data.filter(cur => {
        let children = data.filter(item => item.parent_id === cur.menu_id);
        if (children.length > 0) {
          cur.children = children;
        }
        return cur.menu_type === 6;
      });
    },

    searchItem(arr) {
      this.testMenuData.forEach((val, index) => {
        this.$set(val, "isActive", false);
        if (arr.length > 0) {
          arr.forEach((value, key) => {
            if (val.menu_id == value) {
              this.$set(val, "isActive", true);
            }
          });
        }
      });
      this.getMenuData = this.convertToTreeData(
        JSON.parse(JSON.stringify(this.testMenuData)),
        null
      );
    },
    //接收websocket消息
    getMessage: function (msg) {
        let news = JSON.parse(msg.data)
        if(news.msg_type === "heartbeat") {
            return
        } else {
            const h = this.$createElement;
            this.$notify({
                // title: news.data.title,
                duration: 2000,
                message: h('div',
                    [
                        h('p',news.data.message_info),
                        h('p',news.data.time)
                    ]
                )
            });
            this.getMessageNums()
            this.getShowMessage()
        }
    },
    //获取消息数量
    getMessageNums() {
      messageRequest.getMessageNum("get").then(res => {
        if (res.code === 200) {
          this.messageNums = res.data.count;
        }
      });
    },
    //监控消息数量传递
    monitorMsg() {
      Bus.$on("getMsgNum",(num)=>{
        this.messageNums = Number(num)
      })
    },
    //获取消息数量展示列
    getShowMessage() {
      messageRequest.getShowMessage("get").then(res => {
        if (res.code === 200) {
          this.messageList = res.data;
        }
      });
    },
    //查看更多
    checkMore() {
        window.location.href = `./apps.html#/applicationCenter/myNews?menu_id=4106`;
    },
    hoverIcon() {
      clearTimeout(this.delayAnimation);
      this.messageDrawer = true;
    },
    blurIcon() {
      let that = this;
      this.delayAnimation = setTimeout(function() {
        that.messageDrawer = false;
      }, 300);
    }
    // beforeunloadHandler() {
    //   this.beforeUnloadTime = new Date().getTime();
    // },
    // unloadHandler(e) {
    //   this.gapTime = new Date().getTime() - this.beforeUnloadTime;
    //   if (this.gapTime <= 5) {
    //     cookie.delete('accessToken');
    //   }
    // },
  },
  mounted() {
    // window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
    // window.addEventListener('unload', e => this.unloadHandler(e));
    axios
      .get("./static/project.config.json")
      .then(res => {
          if(typeof res.data === "object") {
              this.ssh_url = res.data.SSH_URL;
              this.ws_path = res.data.WS_IP
              this.init()
          } else {
              let data = JSON.parse(res.data)
              this.ssh_url = data.SSH_URL;
              this.ws_path = res.data.WS_IP
              this.init()
          }
      })
      .catch(err => {
        console.log("get baseConfig error..." + error);
      });
  },
  destroyed() {
    // window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
    // window.removeEventListener('unload', e => this.unloadHandler(e));
  },
  created() {
    this.userName = localStorage.getItem("loginName");
    this.source_type = localStorage.getItem("source_type");
    this.getInitMenu();
    this.getShowMessage();
    this.getMessageNums();
    this.monitorMsg()
  }
};
