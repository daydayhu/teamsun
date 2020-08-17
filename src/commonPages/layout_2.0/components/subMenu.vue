<template>
    <div class="sub-menu g_menu_border g_menu">
        <div class="menu-head">
            <img :src="getIconUrl(currentService.menu_class)" alt="">
            <span class="title">{{currentService.menu_name}}</span>
        </div>
        <div class="menu-body">
            <el-menu :default-active="activePath" @select="handleSelect">
                <div v-for="(menu,index) in currentService.children" :key="index">
                    <el-menu-item :index="menu.menu_url" v-if="menu.menu_url">
                        <div class="name">{{menu.menu_name}}</div>
                        <div class="active-icon"></div>
                    </el-menu-item>
                    <el-submenu :index="menu.menu_name" v-else>
                        <template slot="title">{{menu.menu_name}}</template>
                        <el-menu-item
                                v-for="(subMenu,sub_index) in menu.children"
                                :index="subMenu.menu_url"
                                :key="sub_index">
                            <div class="name">{{subMenu.menu_name}}</div>
                            <div class="active-icon"></div>
                        </el-menu-item>
                    </el-submenu>
                </div>
            </el-menu>
        </div>
    </div>
</template>

<script>
  import {setSession} from '@/commons/js/searchFresh.js';
  import {mapState} from 'vuex';
  const MenuClassMapName = {
    system_service: '系统配置',
    bus_service: '运营中心',
    ip_service:  'IP管理',
    app_service: '应用中心',
    ops_service: '执行管理',
    vmware_service: 'VMware',
    openstack_service: 'OpenStack',
    myInfo_service: '我的信息'
  };
  export default {
    name: 'subMenu',
    props: {
      currentService: {
        type: Object,
      },
      currentIndexMenu: {
        type: Object,
      }
    },
    computed: {
      ...mapState('global', [
        'currentModule', 'modulesList', 'entryModule', 'routerMode',
      ]),
    },
    data() {
      return {
        activePath: '',
      };
    },
    created() {
      this.getActivePath();
    },
    methods: {
      getActivePath() {
        if (this.currentIndexMenu && this.currentIndexMenu.menu_url) {
          if (this.activePath !== this.currentIndexMenu.menu_url) {
            this.activePath = this.currentIndexMenu.menu_url;
            this.arrowDir = 'right';
          }
        }else {
          if (this.$route.query.menu_id) {
            if (this.activePath !== this.$route.path) {
              this.activePath = this.$route.path;
              this.arrowDir = 'right';
            }
          }
        }
        // if (this.$route.query.menu_id) {
        //   if (this.activePath !== this.$route.path) {
        //     this.activePath = this.$route.path;
        //     this.arrowDir = 'right';
        //   }
        // }else {
        //   let local_current_menu = JSON.parse(sessionStorage.getItem('CURRENT_MENU'));
        //   if (local_current_menu && this.activePath !== local_current_menu.url) {
        //     this.activePath = local_current_menu.url;
        //     this.arrowDir = 'right';
        //   }
        // }
      },
      getIconUrl(name) {
        if (MenuClassMapName[name]) {
          return require(`@/commons/images/${name}_icon@2x.png`)
        }
      },
      handleSelect(key, keyPath) {
        var obj = {
          pageNo: 1,
          pageSize: 10,
          keyword: {},
          searchInput: [],
        };
        setSession('searchFresh', obj);
        this.activePath = key;
        let currentMenu = this.getCurrentMenu(this.currentService.children, this.activePath);
        // TODO: 考虑同模块/不同模块
        this.toNextPage(currentMenu);
      },
      toNextPage(toNode) {
        let toModule = toNode ? toNode.menu_tag : null;
        console.log('toModule', toModule);
        if (toModule && this.modulesList.indexOf(toModule) !== -1) {
          let menu_url;
          if (toNode.menu_url) {
            menu_url = toNode.menu_url;
          } else {
            if (toNode.children && toNode.children.length) {
              menu_url = toNode.children.filter(item => item.menu_type === 1)[0].menu_url || '';
            } else {
              menu_url = '';
            }
          }
          if (toModule !== this.currentModule) {
            switch (process.env.ROUTER_MODE) {
              case 'hash':
                if (process.env.ENV_TYPE === 'merge') {
                  if (toModule === this.entryModule) {
                    window.location.href = `./#${menu_url}?menu_id=${toNode.menu_id}`;
                  } else {
                    window.location.href = `./${toModule}.html#${menu_url}?menu_id=${toNode.menu_id}`;
                  }
                } else {
                  window.location.href = `../${toModule}/#${menu_url}?menu_id=${toNode.menu_id}`;
                }
                break;
              case 'history':
                if (process.env.ENV_TYPE === 'merge') {
                  if (toModule === this.entryModule) {
                    window.location.href = `${window.location.origin}${menu_url}?menu_id=${toNode.menu_id}`;
                  } else {
                    window.location.href = `${window.location.origin}/${toModule}${menu_url}?menu_id=${toNode.menu_id}`;
                  }
                } else {
                  // TODO: 待
                  if (toModule === this.entryModule) {
                    window.location.href = `${window.location.origin}${menu_url}?menu_id=${toNode.menu_id}`;
                  } else {
                    window.location.href = `${window.location.origin}/${toModule}${menu_url}?menu_id=${toNode.menu_id}`;
                  }
                }
                break;
              default:
                break;
            }
          } else {
            this.$router.push({
              path: menu_url,
              query: {
                menu_id: toNode.menu_id,
              },
            });
          }
        } else {
          // TODO: 不存在所属模块，将不能正常跳转
          this.$message({
            message: '未找到所属模块, 无法跳转',
            type: 'error',
          });
          return false;
        }
      },
      getCurrentMenu(currentService, url) {
        let menu;
        for (let item of currentService.values()) {
          if (menu) {
            break;
          }
          if (item.menu_url === url) {
            menu = item;
            break;
          } else if (item.children) {
            menu = this.getCurrentMenu(item.children, url);
          }
        }
        return menu;
      },
    },
    watch: {
      $route: {
        handler: function (val, oldVal) {
          this.getActivePath();
        },
        deep: true,
      },
    },
  };
</script>

<style lang="less" scoped>
    .sub-menu {
        width: 176px;
        height: 100%;
        border-left: 1px solid;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        &::-webkit-scrollbar {
            display: none
        }
        .menu-head {
            display: flex;
            height: 72px;
            padding: 30px 0 0 16px;
            & > img {
                width: 20px;
                height: 20px;
            }
            .title {
                margin-left: 8px;
                font-size: 16px;
                font-weight: 500;
                font-family: @g-font-family-m;
            }
        }
        .menu-body {
            width: 100%;
            /deep/.el-menu {
                padding-left: 28px;
                border: 0;
                background: rgba(51, 42, 124, 1) !important;
                .el-submenu {
                    .el-submenu__title {
                        color: #fff;
                    }
                    .el-menu--inline {
                        padding-left: 15px;
                    }
                }
                .el-menu-item {
                    position: relative;
                    color: #fff;
                    transition: border-color .1s,background-color .1s,color .1s;
                    height: 40px;
                    min-width: 0;
                    .name {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        @flex();
                        padding-left: 20px;
                        z-index: 99;
                    }
                    .active-icon {
                        display: none;
                        position: absolute;
                        top: -40px;
                        right: -1px;
                        width: 145px;
                        height: 120px;
                        background: url("../../../commons/images/menu_active_icon@2x.png") no-repeat center center;
                        background-size: cover;
                        z-index: 98;
                        pointer-events: none;
                    }
                }
                .el-menu-item:focus,
                .el-menu-item:hover {
                    outline: 0;
                    background-color: inherit;
                    font-weight: bold;
                }
                .el-menu-item.is-active {
                    background-color: inherit;
                    color: #332a7c;
                    font-weight: bold;
                }
                .el-menu-item.is-active > .active-icon  {
                    display: block;
                }
                .el-submenu__title:hover {
                    background-color: rgba(51, 42, 124, 1);
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                }
                .el-submenu__title i {
                    color: #fff;
                }
            }
        }
    }
</style>
