<template>
    <div class="serverClassPage">
        <div class="headerC">
            <div class="title">服务分类</div>
            <div class="btnC">
                <el-button @click="showTreeDialog(rootData, 'add')" type="primary">添加</el-button>
            </div>
        </div>
        <div class="contentC">
            <ul class="serverClassListC">
                <li v-for="(item,index) in serverClassList" :key="index">
                    <div class="infoC">
                        <div class="name">{{item.value_json}}</div>
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
        <treeDialog v-if="treeDialogFlag" :treeDialogInfo="treeDialogInfo" @closeTreeDialog="closeTreeDialog" @getBaseDataForType="getBaseDataForType"></treeDialog>
    </div>
</template>

<script>
  import treeDialog from './treeDialog';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'serviceType',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        serverClassList: [],
        rootData: null,
        treeDialogFlag: false,
        treeDialogInfo: {
          status: '', // add、edit
          form: null,
        }
      }
    },
    created() {
      this.getBaseDataForType();
    },
    methods: {
      getBaseDataForType() {
        let param = {
          config_type: 18
        };
        requestMethod.getBaseDataForType('get',param).then(res => {
          if (res.code === 200) {
            let originTree = this.convertToTreeData(res.data.items, null);
            this.serverClassList = originTree[0].children;
            this.rootData = {
              config_id: originTree[0].config_id,
              config_key: originTree[0].config_key,
              value_json: originTree[0].value_json
            }
          }
        });
      },
      handleMoreCommand(command) {
        switch (command.operation) {
          case 'edit':
            this.editCell(command.item);
            break;
          case 'delete':
            this.deletedCell(command.item);
            break;
          default:
            break;
        }
      },
      editCell(item) {
        this.showTreeDialog(item, 'edit');
      },
      deletedCell(data) {
        this.$confirm('确认删除服务分类？', '提示', {
          type: 'warning',
        }).then(_ => {
          if (data.config_key) {
            requestMethod.deleteBaseNode('delete', {
              config_type: 18,
              config_key: data.config_key
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '删除节点成功');
                this.getBaseDataForType()
              }else {
                this.$message.error(res.message);
              }
            });
          }
        }).catch(_ => {
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
      showTreeDialog(data, status) {
        switch (status) {
          case 'add':
            this.treeDialogInfo.status = 'add';
            this.treeDialogInfo.form = {
              config_type: 18,
              id: data.config_id,
              name: '',
              key: ''
            };
            break;
          case 'edit':
            this.treeDialogInfo.status = 'edit';
            this.treeDialogInfo.form = {
              config_type: 18,
              id: data.config_id,
              name: data.value_json,
              key: data.config_key
            };
            break;
          default:
            break;
        }
        this.treeDialogFlag = true;
      },
      closeTreeDialog() {
        this.treeDialogFlag = false;
      },
    },
    components: {
      treeDialog
    }
  };
</script>

<style lang="less" scoped>
    .serverClassPage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-style: normal;
                font-size: 16px;
                color: @g-font-color-c;
            }
            .btnC {
                margin-left: auto;
            }
        }
        .contentC {
            .serverClassListC {
                & > li {
                    display: flex;
                    align-items: center;
                    padding-left: 10px;
                    height: 50px;
                    background-color: #ffffff;
                    .infoC {
                        .name {
                            font-weight: 700;
                            font-size: 13px;
                            color: #000;
                        }
                    }
                    .more {
                        margin: 0 20px 0 auto;
                        .more_icon {
                            font-size: 20px;
                        }
                    }
                }
                & > li:nth-child(2n + 1) {
                    background-color: rgba(247, 248, 248, 1);
                }
            }
        }
    }
</style>

