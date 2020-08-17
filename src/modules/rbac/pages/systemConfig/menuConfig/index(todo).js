import template from './index.vue'
import dialogView from './components/editDialog.vue'
import menuView from "./components/overView.vue"
import configItems from './config.js'
import initMenuData from '@/commons/js/menu/initMenu.js'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
    ...template,
    data() {
        return {
            dialogFormVisible: false,
            tableData: [],
            type: {}, //dialog 中的属性
            expandKeys: [],
            nodes: [],
            configItems: configItems,
            loading: true,
            menuTypeSet: {
              menu: 1, // 菜单
              json: 2, // JSON请求
              btn: 3, // 按钮
              business: 4, // 业务节点
              class: 5, // 服务分类
              service: 6 // 服务
            },
            menuArr:[]
        }
    },
    components: {
      pageHeader,
        dialogView,
        menuView

    },
    watch: {
        'tableData': {
            handler(newVal, oldVal) {
                this.getAllNodes(newVal)
            },
            deep: true
        }
    },
    methods: {
        expandChangeHandler(row, expanded) {
            if (expanded) {
                this.expandKeys.push(row.menu_id)
            } else {
                this.expandKeys.splice(this.expandKeys.indexOf(row.menu_id), 1)
            }
            // if (Object.keys(row).indexOf('isFold') != -1) {
            row.isFold = expanded
                //}
        },
        // 遍历树结构
        getAllNodes(treeData) {
            for (let i = 0; i < treeData.length; i++) {
                if (treeData.length == 1) {
                    treeData[i].isFirst = treeData[i].isLast = true
                } else {
                    if (i == 0) {
                        treeData[i].isFirst = !(treeData[i].isLast = false)
                    } else if (i == treeData.length - 1) {
                        treeData[i].isLast = !(treeData[i].isFirst = false)
                    } else {
                        treeData[i].isLast = treeData[i].isFirst = false
                    }
                }
                if (treeData[i].children.length > 0) {
                    this.getAllNodes(treeData[i].children)
                }
            }
        },
        //添加服务分类
        addServiceType() {
            this.dialogFormVisible = true
            this.type = Object.assign(this.type, {
                classific: '添加服务分类',
                content: '服务分类名称',
                isUrl: false,
                isModule: false,
                row: {}
            })
        },
        closeDialog(res, formData, type) {
            //根据res和type判断是否更新lists
            if (res) {
                if (type.classific == "添加服务分类") {
                    this.$api.menuApi.getMenu('post', {
                        parent_id: 0,
                        menu_name: formData.name,
                        menu_url: '',
                        auth_id: formData.key,
                        menu_type: 5
                    }).then((res) => {
                        if (res.status) {
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.tableData.push({
                                menu_name: formData.name,
                                menu_id: res.data.menu_id,
                                menu_type: 5,
                                auth_id: formData.key,
                                is_enable: true,
                                children: [],
                                isFold: false
                            })
                        } else {
                            this.$message({
                                message: res.message,
                                type: 'success'
                            });
                        }
                    })

                }

            }
            this.dialogFormVisible = false
        },
        editNodeItem(row) {
            this.dialogFormVisible = true
            let isUrl = false,
                isModule = false
            if (row.menu_type === this.menuTypeSet.menu || row.menu_type === this.menuTypeSet.service) {
              isUrl = true
              isModule = true
            }
            this.type = Object.assign(this.type, {
                classific: '编辑',
                content: this.configItems.nodesType[`${row.menu_type}`].text + '名称',
                isUrl: isUrl,
                isModule: isModule,
                row: row
            })
        },
        addNodeItem(row) {
            this.dialogFormVisible = true
            let addTitle,
                isUrl = false,
                isModule = false
            if (row.menu_type === this.menuTypeSet.class
                || row.menu_type === this.menuTypeSet.service
                || row.menu_type === this.menuTypeSet.menu) {
                isUrl = true
                isModule = true
            }
            // 降级处理
            switch (row.menu_type) {
                case this.menuTypeSet.class:
                    addTitle = '服务'
                    break
                case this.menuTypeSet.service:
                    addTitle = '菜单'
                    break
                case this.menuTypeSet.menu:
                    addTitle = row.menu_url ? '子级' : '菜单'
                    break
                case this.menuTypeSet.business:
                    addTitle = 'JSON请求'
                    break
            }
            this.type = Object.assign(this.type, {
                classific: '添加' + addTitle,
                content: addTitle + '名称',
                isUrl: isUrl,
                isModule: isModule,
                row: row
            })
        },
        removeNodeItem(row) {
            this.$confirm('此操作将删除该项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arr = [row.menu_id]
                if (row.children.length > 0) {
                    arr = this.getChildrenNodes(row.children, arr)
                }
                this.$api.menuApi.getMenu('delete', {
                    menu_ids: arr
                }).then((res) => {
                    if (res.status) {
                        this.getParentNodes(row.menu_id, this.tableData, 'delete')
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        getChildrenNodes(row, arr) {
            for (let i = 0; i < row.length; i++) {
                arr.push(row[i].menu_id)
                if (row[i].children.length > 0) {
                    this.getChildrenNodes(row[i].children, arr)
                }
            }

        },
        upNodeItem(row) {
            this.getParentNodes(row.menu_id, this.tableData, 'up');
        },
        getParentNodes(id, tree, str) {
            this._getParentNodes([], id, tree, str);
            return this.nodes;
        },
        _getParentNodes(his, targetId, tree, str) {
            let self = this
            tree.some((list, index) => {
                const children = list.children || [];
                if (list.menu_id === targetId) {
                    let tmp = null
                    switch (str) {
                        case 'up':
                            this.changeMenu(tree[index].menu_id, tree[index - 1].menu_id, list, index, 'up', tree)
                            return true
                        case 'down':
                            this.changeMenu(tree[index].menu_id, tree[index + 1].menu_id, list, index, 'down', tree)
                            return true
                        case 'settingTop':
                            this.$api.menuApi.settingMenu('post', {
                                menu_id: tree[index].menu_id,
                                up_down: 1
                            }).then((res) => {
                                if (res.status) {
                                    tmp = tree[index]
                                    tree.splice(index, 1)
                                    tree.unshift(tmp)
                                    this.$message({
                                        type: 'success',
                                        message: '置顶成功'
                                    })

                                } else {
                                    this.$message({
                                        type: 'success',
                                        message: '置顶成功'
                                    })
                                }
                            })

                            return true
                        case 'settingBottom':
                            this.$api.menuApi.settingMenu('post', {
                                menu_id: tree[index].menu_id,
                                up_down: 0
                            }).then((res) => {
                                if (res.status) {
                                    tmp = tree[index]
                                    tree.splice(index, 1)
                                    tree.push(tmp)
                                    this.$message({
                                        type: 'success',
                                        message: '置底成功'
                                    })

                                } else {
                                    this.$message({
                                        type: 'success',
                                        message: '置底失败'
                                    })

                                }
                            })

                            return true
                        case 'delete':
                            tree.splice(index, 1)
                    }
                    self.$refs.table.doLayout()
                    self.nodes = his;
                    return true;
                } else if (children.length > 0) {
                    const history = [...his];
                    history.push(list);
                    return this._getParentNodes(history, targetId, children, str);
                }
            });
        },
        /* lazy
        :load="load" */
        changeMenu(sourceId, targetId, list, index, str, tree) {
            let self = this
            this.$api.menuApi.changeMenu('post', {
                source_id: sourceId,
                target_id: targetId
            }).then((res) => {
                if (res.status) {
                    let tmp = null
                    switch (str) {
                        case 'up':
                            tmp = tree[index - 1]
                            self.$set(tree, index - 1, tree[index])
                            self.$set(tree, index, tmp)
                            return true
                        case 'down':
                            tmp = tree[index + 1]
                            self.$set(tree, index + 1, tree[index])
                            self.$set(tree, index, tmp)
                            return true
                        case 'settingTop':
                            tmp = tree[index]
                            tree.splice(index, 1)
                            tree.unshift(tmp)
                            return true
                        case 'settingBottom':
                            tmp = tree[index]
                            tree.splice(index, 1)
                            tree.push(tmp)
                            return true
                    }
                }
            })
        },
        downNodeItem(row) {
            this.getParentNodes(row.menu_id, this.tableData, 'down');
        },
        topSetting(row) {
            this.getParentNodes(row.menu_id, this.tableData, 'settingTop');
        },
        bottomSetting(row) {
            this.getParentNodes(row.menu_id, this.tableData, 'settingBottom');
        },
        switchChangeHandler(row) {
            this.nodes = []
            let paramNodes = [row.menu_id]
            if (row.is_enable) {
                this.getParentNodes(row.menu_id, this.tableData, '');
                if (this.nodes.length > 0) {
                    for (let i = 0; i < this.nodes.length; i++) {
                        this.nodes[i].is_enable = true
                        paramNodes.push(this.nodes[i].menu_id)
                    }
                }
            }
            if (row.children.length > 0) {
                let arr = []
                this.changeNodesCheck(row.children, row.is_enable, arr)
                paramNodes.push(...arr)
            }
            this.$api.menuApi.switchMenu("put", {
                menu_ids: paramNodes,
                on_off: row.is_enable
            }).then((res) => {
                this.$message({
                    type: res.status ? 'success' : 'error',
                    message: res.message
                })
            })
        },
        //子级启用
        changeNodesCheck(data, check, arr) {
            for (let i = 0; i < data.length; i++) {
                data[i].is_enable = check
                arr.push(data[i].menu_id)
                if (data[i].children.length > 0) {
                    this.changeNodesCheck(data[i].children, check, arr)
                }
            }
        },
        traverseTree(treeData) {
            if (treeData.length > 0) {
                for (let i = 0; i < treeData.length; i++) {
                    this.$set(treeData[i], 'isFold', false)
                    if (treeData[i].children.length > 0) {
                        this.traverseTree(treeData[i].children);
                    }
                }
            }
        },
        getInitMenu() {
            this.$api.menuApi.getMenu('get', {}).then((res) => {
                if (res.status) {
                    if (!res.data.menus.length) {
                        this.$api.menuApi.postMenu('post', {
                            init_data: initMenuData
                        }).then((res) => {
                            if (res.status) {
                                this.getInitMenu()
                            }
                        })
                    } else {
                        //this.tableData = res.data.menus
                        this.traverseTree(res.data.menus);
                        this.spread(res.data.menus);
                        console.log(this.menuArr,999)
                        for(var i =0;i<res.data.menus.length;i++){
                            res.data.menus[i].children=[];
                            res.data.menus[i].hasChildren=true;
                            this.tableData.push(res.data.menus[i])
                        }
                        this.loading = false
                    }
                } else {
                    this.$message({
                        message: res.message,
                        type: "error"
                    });
                }
            })
        },
        spread(menus) {
            for (var i=0; i < menus.length; i++ ) {
                let menu = menus[i]
                if (menu.children) {
                    this.spread(menu.children)
                    delete menu.children
                    menu.hasChildren=true
                }
                this.menuArr.push(menu)
            }
        },
        getRights() {
            let keys = Object.keys(this.configItems.authId)
            for (let i = 0; i < keys.length; i++) {
                let item = this.configItems.authId[keys[i]]
                let result = this.$_hasAuth(item.id)
                this.$set(item, 'isUse', result)
            }
        },
        load(tree, treeNode, resolve) {
            console.log(tree, treeNode, resolve)
            setTimeout(() => {
              /* resolve([
                {
                  id: 31,
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }, {
                  id: 32,
                  date: '2016-05-01',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1519 弄'
                }
              ]) */
            }, 1000)
        }
    },
    updated() {
        this.getRights()
    },
    created() {
        this.getInitMenu()
    }
}
