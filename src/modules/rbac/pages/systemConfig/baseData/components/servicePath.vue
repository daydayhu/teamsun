<template>
    <div class="serverPathPage">
        <div class="headerC">
            <div class="title">服务路径</div>
            <div class="btnC">
                <el-button @click="showTreeDialog(rootData, 'add')" type="primary">添加</el-button>
            </div>
        </div>
        <div class="contentC">
            <el-tree
                    :data="networkNodeTree"
                    ref="tree"
                    node-key="id">
                <div class="treeNode" slot-scope="{ node, data }">
                    <div class="label">{{ data.name }}</div>
                    <div class="btnC">
                        <el-button
                                type="text"
                                @click.stop="showTreeDialog(data, 'edit')">
                            <svg-icon icon-class="edit" class="operat-icon"></svg-icon>
                        </el-button>
                        <el-button
                                type="text"
                                @click.stop="showTreeDialog(data, 'add')" v-if="false">
                            <svg-icon icon-class="add" class="operat-icon"></svg-icon>
                        </el-button>
                        <el-button
                                type="text"
                                @click.stop="removeNode(data)">
                            <svg-icon icon-class="reduce" class="operat-reduce-icon"></svg-icon>
                        </el-button>
                    </div>
                </div>
            </el-tree>
        </div>
        <treeDialog v-if="treeDialogFlag" :treeDialogInfo="treeDialogInfo" @closeTreeDialog="closeTreeDialog" @getBaseDataForType="getBaseDataForType"></treeDialog>
    </div>
</template>

<script>
  import treeDialog from './treeDialog';
  import * as requestMethod from '@/modules/rbac/api/systemConfig/baseData.js';
  export default {
    name: 'serverPath',
    props: {
      paneData: {
        type: Array,
        deep: true
      },
    },
    data() {
      return {
        treeDialogFlag: false,
        rootData: null,
        networkNodeTree: [],
        treeDialogInfo: {
          status: '', // add、edit
          form: null,
        }
      }
    },
    created() {
      this.getBaseDataForType()
    },
    methods: {
      getBaseDataForType() {
        let param = {
          config_type: 12
        }
        requestMethod.getBaseDataForType('get',param).then(res => {
          if (res.code === 200) {
            let originTree = this.convertToTreeData(res.data.items, null)
            this.networkNodeTree = this.filterData(originTree[0].children)
            this.rootData = {
              id: originTree[0].config_id,
              key: originTree[0].config_key,
              name: originTree[0].value_json
            }
          }
        });
      },
      filterData(data) {
        let dataList = [];
        const generateList = (obj, node) => {
          const info = {id:obj['config_id'], name:obj['value_json'], key:obj['config_key']};
          if (obj['children'] && obj['children'].length) {
            info.children = []
            obj['children'].forEach(item => generateList(item, info))
          }
          if (typeof node === 'undefined') {
            dataList.push(info)
          } else {
            node['children'].push(info)
          }
        }
        data.forEach(item => generateList(item));
        return dataList
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
              config_type: 12,
              id: data.id,
              name: '',
              key: ''
            };
            break;
          case 'edit':
            this.treeDialogInfo.status = 'edit';
            this.treeDialogInfo.form = {
              config_type: 12,
              id: data.id,
              name: data.name,
              key: data.key
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
      removeNode(data) {
        console.log('data',data)
        this.$confirm('确认删除节点？','提示', {
          type: 'warning'
        })
        .then(_ => {
          if (data.id) {
            requestMethod.deleteBaseNode('delete', {
               config_type: 12,
               config_key: data.key
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message || '删除节点成功');
                this.getBaseDataForType()
              }else {
                this.$message.error(res.message);
              }
            });
          }
        })
        .catch(_ => {});
      },
    },
    components: {
      treeDialog
    }
  };
</script>

<style lang="less" scoped>
    .serverPathPage {
        padding: 0 30px;
        .headerC {
            height: 50px;
            display: flex;
            align-items: center;
            .title {
                font-weight: 600;
                font-style: normal;
                font-size: 16px;
                color: #000000;
            }
            .btnC {
                margin-left: auto;
            }
        }
        .contentC {
            .el-tree {
                /deep/ .el-tree-node__content {
                    height: 40px;
                    .treeNode {
                        display: flex;
                        align-items: center;
                        .btnC {
                            display: flex;
                            align-items: center;
                            margin-left: 25px;
                            & > button {
                                font-size: 16px;
                                margin-right: 10px;
                                /*.operat-reduce-icon {*/
                                /*width: 1.2em;*/
                                /*height: 1.2em;*/
                                /*}*/
                            }
                        }
                    }
                }
            }
        }
    }
</style>
