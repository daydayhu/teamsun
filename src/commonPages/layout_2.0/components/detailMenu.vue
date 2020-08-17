<template>
    <div class="detailMenuLayer g_menu" @click.stop>
        <div class="line g_menu_line"></div>
        <div class="header-c">
            <button class="close" @click="close"><img src="@/commons/images/menu_close2_icon@2x.png" alt=""></button>
        </div>
        <div class="request-c">
            <div class="title">最近访问的服务</div>
            <ul class="request-list">
                <li v-for="(service, serviceIndex) in requestList" :key="serviceIndex">
                    <div class="icon"><img :src="getIconUrl(service.menu_class)" alt=""></div>
                    <div class="name g_menu_font_hover" @click="toRequestPage(service)">{{service.menu_name}}</div>
                </li>
            </ul>
        </div>
        <div class="line-h"></div>
        <div class="service-c">
            <div class="title">服务列表</div>
            <div class="service-list-c">
                <div class="column col-1">
                    <ul class="service-list">
                        <li v-for="(service, serviceIndex) in serviceColumnOne" :key="serviceIndex">
                            <div class="service-info">
                                <div class="icon"><img :src="getIconUrl(service.menu_class)" alt=""></div>
                                <div class="name">{{service.menu_name}}</div>
                            </div>
                            <ul class="service-menu-list">
                                <li v-for="(item, index) in service.children" :key="index">
                                    <div class="name g_menu_font_hover" @click.stop="itemClickHandler(item,index)">{{item.menu_name}}</div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="column col-2">
                    <ul class="service-list">
                        <li v-for="(service, serviceIndex) in serviceColumnTwo" :key="serviceIndex">
                            <div class="service-info">
                                <div class="icon"><img :src="getIconUrl(service.menu_class)" alt=""></div>
                                <div class="name">{{service.menu_name}}</div>
                            </div>
                            <ul class="service-menu-list">
                                <li v-for="(item, index) in service.children" :key="index">
                                    <div class="name g_menu_font_hover" @click.stop="itemClickHandler(item,index)">{{item.menu_name}}</div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="column col-3">
                    <ul class="service-list">
                        <li v-for="(service, serviceIndex) in serviceColumnThree" :key="serviceIndex">
                            <div class="service-info">
                                <div class="icon"><img :src="getIconUrl(service.menu_class)" alt=""></div>
                                <div class="name">{{service.menu_name}}</div>
                            </div>
                            <ul class="service-menu-list">
                                <li v-for="(item, index) in service.children" :key="index">
                                    <div class="name g_menu_font_hover" @click.stop="itemClickHandler(item,index)">{{item.menu_name}}</div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  const MenuClassMapName = {
    system_service: '系统配置',
    bus_service: '运营中心',
    ip_service:  'IP管理',
    app_service: '应用中心',
    ops_service: '执行管理',
    vmware_service: 'VMware',
    openstack_service: 'OpenStack'
  };
  export default {
    name: 'detailMenu',
    props: {
      menuList: { // 子菜单列表 目前只有服务列表需展示
        type: Array
      },
      serviceList: { // 服务列表 子菜单=>menuList
        type: Array
      },
      requestList: { // 最近访问记录
        type: Array
      }
    },
    computed: {
      ...mapState('global', [
        'currentModule','modulesList','entryModule','routerMode'
      ])
    },
    data() {
      return {
        serviceColumnOne: [],
        serviceColumnTwo: [],
        serviceColumnThree: []
      }
    },
    methods: {
      getServiceColumnData() {
        if (this.serviceList && this.serviceList.length) {
          this.serviceList.forEach((service,index) => {
            if (index % 3 === 0) {
              this.serviceColumnOne.push(service)
            }else if ((index - 1) % 3 === 0) {
              this.serviceColumnTwo.push(service)
            }else if ((index - 2) % 3 === 0) {
              this.serviceColumnThree.push(service)
            }
          })
        }
        console.log('serviceColumnOne',this.serviceColumnOne);
        console.log('serviceColumnTwo',this.serviceColumnTwo);
        console.log('serviceColumnThree',this.serviceColumnThree);
      },
      getIconUrl(name) {
        if (MenuClassMapName[name]) {
          return require(`@/commons/images/${name}_icon@2x.png`)
        }
      },
      itemClickHandler(item) {
        if (item.menu_type === 5 || item.menu_type === 6) { // 服务分类
          return false;
        }
        this.toNextPage(item)
      },
      toRequestPage(service) {
        let node = this.getRequestNode(service, this.serviceList);
        this.toNextPage(node);
      },
      getRequestNode(data, treeData) {
        let node;
        for (let i = 0; i < treeData.length; i++) {
          if (data.menu_id === treeData[i].menu_id) {
            node = treeData[i].children[0];
          } else {
            if ((treeData[i].children) && (treeData[i].children.length > 0)) {
              this.getRequestNode(data, treeData[i].children);
            }
          }
        }
        return node
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
      },
      close() {
        this.$emit('closeDetailMenu')
      }
    },
    created() {
      this.getServiceColumnData();
    }
  };
</script>

<style lang="less" scoped>
    .detailMenuLayer {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1998;
        width: 808px;
        height: 100%;
        padding: 24px 0 24px 112px;
        box-sizing: border-box;
        border-radius: 20px;
        overflow-y: auto;
        overflow-x: hidden;
        .line {
            position: absolute;
            top: 0;
            left: 0;
            margin-left: 64px;
            width: 1px;
            height: 100%;
        }
        .header-c {
            @flex();
            justify-content: center;
            padding-left: 32px;
            height: 28px;
            .close {
                margin: 0 49px 0 auto;
                outline: 0;
                background-color: inherit;
                border: 0;
                & > img {
                    width: 13px;
                    height: 13px;
                    cursor: pointer;
                }
            }
        }
        .request-c {
            margin-top: 16px;
            .title {
                padding-left: 32px;
                font-size: 14px;
                font-weight: 500;
                font-family: @g-font-family-m;
            }
            .request-list {
                @flex();
                flex-wrap: wrap;
                & > li {
                    @flex();
                    margin-top: 16px;
                    width: 224px;
                    height: 24px;
                    font-size: 12px;
                    .icon {
                        width: 24px;
                        height: 24px;
                        border-radius: 5px;
                        background-color: cornsilk;
                        & > img {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .name {
                        margin-left: 8px;
                        cursor: pointer;
                    }
                }
            }
        }
        .line-h {
            margin: 16px 80px 16px 0;
            height: 0;
            border-bottom: 1px dashed #fff;
        }
        .service-c {
            max-height: 720px;
            .title {
                padding-left: 32px;
                font-size: 14px;
                font-weight: 500;
                font-family: @g-font-family-m;
            }
            .service-list-c {
                display: flex;
                margin-top: 18px;
                .column {
                    width: 224px;
                    .service-list {
                        display: flex;
                        flex-direction: column;
                        & > li {
                            margin-bottom: 24px;
                            width: 224px;
                            font-size: 14px;
                            .service-info {
                                @flex();
                                height: 24px;
                                .icon {
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 5px;
                                    background-color: cornsilk;
                                    overflow: hidden;
                                    & > img {
                                        width: 100%;
                                        height: 100%;
                                    }
                                }
                                .name {
                                    margin-left: 8px;
                                    font-weight: 500;
                                }
                            }
                            .service-menu-list {
                                padding-left: 32px;
                                & > li {
                                    @flex();
                                    margin-top: 12px;
                                    .name {
                                        font-size: 12px;
                                        cursor: pointer;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
