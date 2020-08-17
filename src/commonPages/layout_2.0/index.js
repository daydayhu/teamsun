import template from './index.vue';
import './index.less';
import user from '@/commons/images/user.png';
import menus from '@/commons/js/menu/index.js';
import {
  testMenu,
  pushMenu,
  pushMenu1,
  pushMenu2,
  pushMenu3,
  pushMenu4,
  pushMenu5,
} from '@/commons/js/menu/testMenu.js';
import axios from 'axios';
import {getQueryVariable} from '@/utils/utils';
import * as messageRequest from '@/modules/apps/api/applicationCenter/myMessage';
import websocket from './utils/websocket';
import ThemeChange from '../../components/themeChange/index';
import DetailMenu from './components/detailMenu';
import msgNotify from "../../components/messageNotify/messageNotify.vue"
import SubMenu from './components/subMenu';
import {mapState} from 'vuex';
import Bus from '@/commons/js/bus'

export default {
  ...template,
  mixins: [websocket],
  data() {
    return {
      serviceList: [],
      userName: '',
      getMenuData: [],
      beforeUnloadTime: '',
      gapTime: '',
      requestMenu: [],
      ssh_url: null,
      source_type: null,
      messageNums: 0,
      messageDrawer: false,
      delayAnimation: null,
      // 新增
      currentService: {},
      subMenuFlag: false,
      detailMenuFlag: false,
      subMenuList: [],
      userMenuData: null,
      currentIndexMenu: null,
      currentActiveBtn: '',
      menuBtnSet: {
        detailMenu: 1,
        console: 2,
        search: 3,
        message: 4,
        user: 5,
        subMenu: 6
      },
      ws_path: '',
      userVisibleFlag: false
    };
  },
  components: {
    ThemeChange,
    DetailMenu,
    SubMenu,
    msgNotify
  },
  computed: {
    ...mapState('global', [
      'currentModule', 'modulesList', 'entryModule', 'routerMode',
    ]),
    dashboardMenu() {
      return this.menuData.slice(0, 1)[0];
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.showSubMenu();
      },
      deep: true,
    },
    serviceList: {
      handler(val, oldVal) {
        console.log('serviceList', val);
        this.showSubMenu();
      },
      deep: true,
    },
  },
  methods: {
    // 获取初始化菜单数据
    getInitMenu() {
      // if (sessionStorage.getItem('userMenuData') && sessionStorage.getItem('requestMenu')) {
      //   this.userMenuData = JSON.parse(sessionStorage.getItem('userMenuData'));
      //   this.requestMenu = JSON.parse(sessionStorage.getItem('requestMenu'));
      //   this.getMenuData = this.convertToTreeData(JSON.parse(JSON.stringify(this.userMenuData)), null);
      //   let data = this.filterData(JSON.parse(JSON.stringify(this.getMenuData)));
      //   this.subMenuList = this.getSubMenuList(data);
      //   this.serviceList = this.getServicesList(data);
      // }

      this.$api.menuApi.getUserMenu('get', {}).then(res => {
        if (res.status) {
          this.userMenuData = res.data.user_menus;
          this.requestMenu = res.data.recently_visited_menus;
          this.getMenuData = this.convertToTreeData(JSON.parse(JSON.stringify(this.userMenuData)), null);
          let data = this.filterData(JSON.parse(JSON.stringify(this.getMenuData)));
          this.subMenuList = this.getSubMenuList(data);
          this.serviceList = this.getServicesList(data);
          // sessionStorage.setItem('userMenuData',JSON.stringify(res.data.user_menus));
          // sessionStorage.setItem('requestMenu',JSON.stringify(res.data.recently_visited_menus));
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          });
        }
      });

    },

    // 获取子菜单数据
    getSubMenuList(data) {
      let arr = [];
      data.forEach((val, index) => {
        if (val.hasOwnProperty('children') && val.children.length > 0) {
          arr.push(...val.children);
        }
      });
      return arr;
    },

    // 获取服务列表数据(全部服务菜单)
    getServicesList(data) {
      let serviceList = data
      if (serviceList && serviceList.length) {
        serviceList.forEach(service => {
          if (service.children && service.children.length) {
            service.children.sort(function(a, b) {
              return a['asc_order'] - b['asc_order']
            });
            service.children.forEach(item => {
              if (item.children && item.children.length) {
                item.children.sort(function(a, b) {
                  return a['asc_order'] - b['asc_order']
                });
              }
            })
          }
        });
      }
      serviceList.sort(function(a, b) {
        return a['asc_order'] - b['asc_order']
      });
      return serviceList
    },

    // 展示子菜单
    showSubMenu() {
      let nodes = [];
      this.currentIndexMenu = this.getCurrentIndexMenu();
      if (this.currentIndexMenu && this.currentIndexMenu.menu_id) {
        let menu_id = this.currentIndexMenu.menu_id;
        getParentNodes(Number(menu_id), this.serviceList);
        this.resetMenuStatus(nodes[0]);
      }else {
        let menu_id = this.$route.query.menu_id;
        if (menu_id == 5101 || menu_id == 5102) {
          if (this.source_type != 0) {
            pushMenu5.children.pop();
          }
          this.resetMenuStatus(pushMenu5);
        }else {
          this.resetMenuStatus();
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

    // 获取当前索引菜单
    getCurrentIndexMenu() {
      let currentIndexMenu;
      let currentMenuParentsSet = [];
      let currentMenu = this.userMenuData.find(item => item.menu_tag === this.currentModule && item.menu_url === this.$route.path && item.menu_type === 1);
      if (currentMenu) {
        getMenuParents(currentMenu,this.userMenuData);
        currentIndexMenu = currentMenuParentsSet.find(menu => menu.menu_url) || currentMenu;
      }
      function getMenuParents(menu, menuList) {
        if (menu && menu.parent_id) {
          let parentMenu = menuList.find(item => item.menu_id === menu.parent_id);
          if (parentMenu && parentMenu.menu_type !== 6) {
            currentMenuParentsSet.unshift(parentMenu);
            getMenuParents(parentMenu, menuList)
          }
        }
      }
      console.log('currentMenu',currentMenu);
      console.log('currentMenuParentsSet',currentMenuParentsSet);
      return currentIndexMenu;
    },

    // 重置菜单状态
    resetMenuStatus(data) {
      if (data) {
        this.currentService = Object.assign({}, this.currentService, data);
        this.subMenuFlag = true;
        this.detailMenuFlag = false;
      }else {
        this.currentService = null;
        this.subMenuFlag = false;
        this.detailMenuFlag = false;
      }
      console.log('this.currentService', this.currentService);
    },

    // 过滤菜单
    filterData(data) {
      let newData = data || [];
      newData.forEach(
        x => x.children && (x.children = this.filterData(x.children)),
      );
      return newData;
    },

    // 树结构转换
    convertToTreeData(data, pid) {
      return data.filter(cur => {
        let children = data.filter(item => item.parent_id === cur.menu_id);
        if (children.length > 0) {
          cur.children = children;
        }
        return cur.menu_type === 6;
      });
    },

    // 开关详情菜单
    toggleDetailMenu(btn) {
      this.detailMenuFlag = !this.detailMenuFlag;
      // this.setActiveBtn(btn);
    },

    // 展示详情菜单
    showDetailMenu() {
      if (!this.detailMenuFlag) {
        this.detailMenuFlag = true;
      }
    },

    // 关闭详情菜单
    closeDetailMenu() {
      if (this.detailMenuFlag) {
        this.detailMenuFlag = false;
      }
    },

    // 开关消息
    toggleMessage(btn) {
      // TODO: 待扩展
      // ...
      this.setActiveBtn(btn)
    },

    // 开关消息用户信息
    toggleUserInfo(btn) {
      this.setActiveBtn(btn)
    },

    // 开关子菜单
    toggleSubMenu(btn) {
      this.subMenuFlag = !this.subMenuFlag;
      // this.setActiveBtn(btn);
    },

    // set active button
    setActiveBtn(btn) {
      // TODO: 暂时不用
      // if (this.currentActiveBtn !== btn) {
      //   this.currentActiveBtn = btn
      // }
    },

    // 跳转首页
    toDashboard() {
      this.subMenuFlag = false;
      this.$router.push({path: '/dashboard'});
    },

    // 退出登录
    logout(res) {
      //发请求
      this.$api.loginApi.signout({}).then(res => {
        if (res.status || !res.is_login) {
          this.$router.push({
            name: 'login',
          });
          localStorage.clear();
          sessionStorage.clear();
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          });
        }
      });
    },

    // 点击控制台
    clickConsole() {
      window.open(
        this.ssh_url,
        'Derek',
        'height=880,width=1040,status=no,toolbar=no,menubar=no,location=no',
      );
    },

    // 跳转基本信息
    baseInfo() {
      this.userVisibleFlag = false;
      window.location.href = './#/certifiservice/myInfo/baseInfo?menu_id=5101';
    },

    // 跳转修改密码
    modifyPass() {
      this.userVisibleFlag = false;
      window.location.href = './#/certifiservice/myInfo/modifyPass?menu_id=5102';
    },
    // 接收websocket消息
    getMessage: function (msg) {
      let news = JSON.parse(msg.data);
      if (news.msg_type === 'heartbeat') {
        return;
      } else {
        let msgArr = news.data.message_info.split(")")
        const h = this.$createElement;
        this.$notify({
          // title: news.data.title,
          duration: 2000,
          message: h('div',
              [
                  h('p',{
                    style:"word-break: break-all;"
                  },msgArr[0]+")"),
                  h('p',{
                    style:"word-break: break-all;"
                  },msgArr[1].trim()),
                  h('p',{
                    style:"margin-top:8px"
                  },news.data.time)
              ]
          )
      });
        this.getMessageNums();
        this.getShowMessage();
      }
    },
    //获取消息数量
    getMessageNums() {
      messageRequest.getMessageNum('get').then(res => {
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
      this.delayAnimation = setTimeout(function () {
        that.messageDrawer = false;
      }, 300);
    },
    // beforeunloadHandler() {
    //   this.beforeUnloadTime = new Date().getTime();
    // },
    // unloadHandler(e) {
    //   this.gapTime = new Date().getTime() - this.beforeUnloadTime;
    //   if (this.gapTime <= 5) {
    //     cookie.delete('accessToken');
    //   }
    // },
    // 搜索暂弃
    searchItem(arr) {
      this.userMenuData.forEach((val, index) => {
        this.$set(val, 'isActive', false);
        if (arr.length > 0) {
          arr.forEach((value, key) => {
            if (val.menu_id == value) {
              this.$set(val, 'isActive', true);
            }
          });
        }
      });
      this.getMenuData = this.convertToTreeData(
        JSON.parse(JSON.stringify(this.userMenuData)),
        null,
      );
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
  },
  mounted() {
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
  destroyed() {},
  created() {
    this.userName = localStorage.getItem('loginName');
    this.source_type = localStorage.getItem('source_type');
    this.getInitMenu();
    // this.getShowMessage();
    this.getMessageNums();
    this.monitorMsg()
  },
};
