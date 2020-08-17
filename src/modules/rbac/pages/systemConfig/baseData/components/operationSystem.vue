<template>
    <div class="operationSystemPage">
        <div class="headerC">
            <div class="title">操作系统</div>
            <div class="btnC">
                <el-button @click="showOsDrawer(rootData, 'add')" type="primary">添加</el-button>
            </div>
        </div>
        <div class="contentC">
            <ul class="systemListC">
                <li v-for="(item,index) in systemList" :key="index">
                    <div class="iconC">
                        <img :src="item.image_url" alt="" v-if="item.image_url">
                        <svg-icon :icon-class='`base_${item.config_key}`' v-else></svg-icon>
                    </div>
                    <div class="infoC">
                        <div class="name">{{item.config_tag}}</div>
                        <div class="version">版本号：{{item.value_json}}</div>
                    </div>
                    <div class="more">
                        <el-dropdown
                                trigger="click"
                                placement="bottom-start"
                                @command="handleMoreCommand"
                        >
                            <el-button type="text" size="small"><svg-icon icon-class='more_icon' class="more_icon"></svg-icon></el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="{item:item, operation:'edit'}" :disabled="!$_hasAuth('bus_center_pro_component_edit') && false">编辑</el-dropdown-item>
                                <el-dropdown-item :command="{item:item, operation:'delete'}" :disabled="!$_hasAuth('bus_center_pro_component_delete') && false">删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </li>
            </ul>
        </div>
        <osDrawer v-if="osDrawerFlag" :drawerInfo="drawerInfo" @closeOsDrawer="closeOsDrawer" @getBaseDataForType="getBaseDataForType"></osDrawer>
    </div>
</template>

<script>
  import osDrawer from './osDrawer';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'operationSystem',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        systemList: [],
        natList: [],
        osDrawerFlag: false,
        rootData: null,
        drawerInfo: {
          status: 'add',
          osForm: null
        }
      }
    },
    created() {
      this.getBaseDataForType();
    },
    methods: {
      getBaseDataForType() {
        let param = {
          config_type: 1
        };
        requestMethod.getBaseDataForType('get',param).then(res => {
          if (res.code === 200) {
            let originTree = this.convertToTreeData(res.data.items, null);
            this.systemList = originTree[0].children.map(node => {
              let _node = JSON.parse(JSON.stringify(node));
              _node.value_json = _node.value_json.version.join('，');
              return _node
            });
            this.rootData = {
              id: originTree[0].config_id,
              key: originTree[0].config_key,
              name: originTree[0].value_json
            }
          }
        });
      },
      convertToTreeData(data, pid) {
        const result = []
        let temp = []
        for (let i = 0; i < data.length; i++) {
          if (data[i].parent_id === pid) {
            temp = this.convertToTreeData(data, data[i].config_id)
            if (temp.length > 0) {
              data[i].children = temp
            } else {
              data[i].children = []
            }
            result.push(data[i])
          }
        }
        return result
      },
      showOsDrawer(data, status) {
        switch (status) {
          case 'add':
            this.drawerInfo.status = 'add';
            this.drawerInfo.osForm = {
              config_type: 1,
              id: this.rootData.id,
            };
            break;
          case 'edit':
            this.drawerInfo.status = 'edit';
            this.drawerInfo.osForm = {
              id: data.config_id,
              config_type: 1,
              config_key: data.config_key,
              imageUrl: data.image_url,
              name: data.config_tag,
              osVersionList: data.value_json.split('，')
            };
            break;
          default:
            break;
        }
        this.osDrawerFlag = true;
      },
      closeOsDrawer() {
        this.osDrawerFlag = false;
      },
      handleMoreCommand(command) {
        switch (command.operation) {
          case 'edit':
            this.showOsDrawer(command.item, 'edit');
            break;
          case 'delete':
            this.deletedOs(command.item);
            break;
          default:
            break;
        }
      },
      deletedOs(data) {
        this.$confirm(`确认删除此操作系统？`, '提示', {
          type: 'warning',
        }).then(_ => {
          if (data.config_key) {
            requestMethod.deleteBaseNode('delete', {
              config_type: 1,
              config_key: data.config_key
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '删除操作系统成功');
                this.getBaseDataForType()
              }else {
                this.$message.error(res.message);
              }
            });
          }
        }).catch(_ => {
        });
      }
    },
    components: {
      osDrawer
    }
  };
</script>

<style lang="less" scoped>
    .operationSystemPage {
        padding: 0 30px;
        height: calc(100vh - 32px - 24px - 24px - 24px);
        overflow-x: hidden;
        overflow-y: auto;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-style: normal;
                font-size: 16px;
            }
            .btnC {
                margin-left: auto;
            }
        }
        .contentC {
            .systemListC {
                & > li {
                    height: 92px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #EBEEF5;
                    .iconC {
                        width: 46px;
                        height: 46px;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                        .svg-icon {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .infoC {
                        margin-left: 20px;
                        font-size: 14px;
                        .name {
                            font-weight: 600;
                        }
                        .version {
                            margin-top: 5px;
                            color: rgba(0, 0, 0, 0.45);
                        }
                    }
                    .more {
                        margin: 0 20px 0 auto;
                        .more_icon {
                            font-size: 20px;
                        }
                    }
                }
            }
        }
    }
</style>
