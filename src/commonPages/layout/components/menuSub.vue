<template>
    <div class="sub-menu">
        <div class="menu-left" :style="{opacity:arrowDir === 'left' ? 0 : 1}">
            <div class="menu-title">{{menuTitle}}</div>
            <div class="menu-body">
                <el-menu :default-active="activePath" @select="handleSelect">
                    <div v-for="(item1,index1) in menuList.children" :key="'index'+index1+Math.random()">
                        <el-menu-item :index="item1.menu_url" v-if="item1.menu_url">
                            <span slot="title">{{item1.menu_name}}</span>
                        </el-menu-item>
                        <el-submenu :index="item1.menu_name" v-else>
                            <template slot="title">{{item1.menu_name}}</template>
                            <el-menu-item
                                    :index="item2.menu_url"
                                    v-for="(item2,index2) in item1.children"
                                    :key="'index2'+index2"
                            >{{item2.menu_name}}
                            </el-menu-item>
                        </el-submenu>
                    </div>
                </el-menu>
            </div>
        </div>
        <div class="sub-arrow">
            <div :class="arrowDir === 'right' ? 'arrow-img-right' : 'arrow-img-left'" @click="subArrowHandler"></div>
        </div>
    </div>
</template>
<script>
  import {setSession} from '@/commons/js/searchFresh.js';
  import {getQueryVariable} from '@/utils/utils';
  import {mapState} from 'vuex';

  export default {
    props: {
      menuTitle: {
        type: String,
      },
      menuList: {
        type: Object,
      },
      defaultActive: {
        type: String,
      },
    },
    data() {
      return {
        arrowDir: 'right',
        activePath: '',
      };
    },
    methods: {
      getActivePath() {
        if (this.activePath !== this.$route.path) {
          this.activePath = this.$route.path;
        }
      },
      isShowChildrenMenu(item) {
        let flag = false;
        if (item.children && item.children.length) {
          flag = item.children.some(item => item.menu_type === 1);
        } else {
          flag = true;
        }
        return flag;
      },
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
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
        let currentMenu = this.getCurrentMenu(this.menuList.children, this.activePath);
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
      getCurrentMenu(menuList, url) {
        let menu;
        for (let item of menuList.values()) {
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
      subArrowHandler() {
        this.arrowDir = this.arrowDir === 'left' ? 'right' : 'left';
        this.$emit('arrow-sub', this.arrowDir);
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
    created() {
      this.getActivePath();
    },
    computed: {
      ...mapState('global', [
        'currentModule', 'modulesList', 'entryModule', 'routerMode',
      ]),
    },
  };
</script>
<style lang='less' scoped>
    .sub-menu {
        width: 208px;
        position: relative;
        height: 100%;
        margin-left: 0;
        transition: all 0.3s;
        background-color: #fff;
        .menu-left {
            float: left;
            width: 208px;
            box-sizing: border-box;
            .menu-title {
                margin: 0 16px;
                height: 47px;
                display: flex;
                align-items: center;
                border-bottom: 1px solid rgba(52, 69, 99, 0.08);
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(25, 34, 59, 1);
            }
            .menu-body {
                position: relative;
                ul.el-menu {
                    border-right: 0 !important;
                    li.el-menu-item {
                        display: flex;
                        align-items: center;
                        height: 40px;
                        line-height: 40px;
                        /*padding: 0 16px !important;*/
                        box-sizing: border-box;
                        color: rgba(25, 34, 59, 1);
                    }
                    li.el-menu-item.is-active {
                        background: rgba(48, 107, 255, 0.05);
                        color: #306BFF;
                    }
                    /deep/ .el-submenu {
                        .el-submenu__title {
                            height: 40px;
                            /*padding: 0 16px !important;*/
                            box-sizing: border-box;
                            display: flex;
                            align-items: center;
                        }
                    }
                    .el-menu-item.is-active {
                        background-color: #ecf5ff;
                    }

                }
            }
        }

        .sub-arrow {
            position: absolute;
            top: 0;
            right: 0;
            width: 1px;
            height: 100vh;

            .arrow-img-right {
                width: 16px;
                height: 39px;
                background: url("../../../commons/images/arrowRight@2x.png") no-repeat center center;
                background-size: contain;
                vertical-align: middle;
                position: absolute;
                top: 45%;
            }

            .arrow-img-left {
                width: 16px;
                height: 39px;
                background: url("../../../commons/images/arrowLeft@2x.png") no-repeat center center;
                background-size: contain;
                vertical-align: middle;
                position: absolute;
                top: 45%;
            }

            &:hover {
                cursor: pointer;
            }
        }
    }

    .sub-menu-margin {
        margin-left: -235px;
    }
</style>
