import template from './index.vue'
import enumSearch
    from "@/components/searchCom/enumSearch.vue"
import Pagination from "@/components/pagination";
import * as requestMethods
    from "@/modules/rbac/api/tagManagement/tagManagement.js"
import {getSession} from '@/commons/js/searchFresh.js'
import {tableHeader} from "./utils/utils";
import addTag from "./components/addTag.vue"
//引入公共头部组件
import pageHeader
    from "@/components/pageHeader.vue"

export default {
    ...template,
    data() {
        return {
            tableList: [],
            searchNeedData: {data: []},
            loading: true,
            tableHeader: tableHeader,
            pagination: {
                current_page: 1, // 当前位于哪页
                per_page: 10, //每页显示多少条
                total_count: 0,
                total_page: 1
            },
            password: '2',
            tagObj: {
                show: false
            },
            multipleSelection: ''
        }
    },
    mounted() {

    },
    methods: {
        searchContdition() {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        toSearch(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        getDataListEdit() {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        getDataListAdd() {
            this.getDataList([], 1, getSession('searchFresh').pageSize)
        },
        addTag() {
            this.tagObj = {
                show: true,
                type: 'add',
                title: '创建标签'
            }
        },
        editTag(data) {
            this.tagObj = {
                show: true,
                type: 'edit',
                title: '编辑标签',
                tag_id: data.tag_id,
                value_id: data.value.value_id,
                tag_type: data.tag_type.key,
            }
        },
        async deleteTag(data) {

            // this.$confirm(`确认删除该标签吗?`, '提示', {
            //   type: 'warning'
            // }).then(() => {
            //   let para = {
            //     tag_list: [
            //       {
            //         tag_id: data.tag_id,
            //         value_id: data.value.value_id
            //       }
            //     ]
            //   }
            //   requestMethods.deleteTag('delete', para).then(res => {
            //       if (res.code == 200) {
            //         this.$message({
            //           message: '删除成功',
            //           type: 'success'
            //         })
            //         this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
            //       } else {
            //         this.$message.error(res.message || '标签删除失败');
            //       }
            //     })
            //   })
            //   .catch(() => {
            //
            //   })
            const {
                tag_id,
                tag_key,
                tag_type,
                value
            } = data;
              let para = {
                tag_list: [
                  {
                    tag_id,
                    value_id: value.value_id
                  }
                ]
              }
            if (value.counts > 0 && tag_type.key === 3) {
                const title = tag === `您确定要删除标签"${tag_key}:${value.tag_value}"吗？`;
                const messageParam = {
                    title,
                    type: 'warning'
                };
                const confirmResult = await this.handleMessage(messageParam);
                if (confirmResult !== 'confirm') {
                    return;
                }
            }

            this.deleteTagRequest(para);

        },

        async deleteTagRequest(para) {
            const res = await requestMethods.deleteTag('delete', para);
            if (res.code == 200) {
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
            } else {
                this.$message.error(res.message || '标签删除失败');
            }
        },

        async handleMessage(messageParam) {
            const {
                title,
                type
            } = messageParam;
            const confirmResult = await this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type
            }).catch(err => err);

            return confirmResult;
        },
        deleteMutTag(data) {
            console.log(this.multipleSelection)
            if (this.multipleSelection.length > 0) {
                this.$confirm(`确认删除选中的${this.multipleSelection.length}条标签吗?`, '提示', {
                    type: 'warning'
                }).then(() => {
                    let selectedData = this.multipleSelection.map(item => {
                        let obj = {
                            tag_id: item.tag_id,
                            value_id: item.value.value_id
                        }
                        return obj
                    })
                    let para = {
                        tag_list: selectedData
                    }
                    requestMethods.deleteTag('delete', para).then(res => {
                        if (res.code == 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            })
                            this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
                        } else {
                            this.$message.error(res.message || '标签删除失败');
                        }
                    })
                })
                    .catch(() => {

                    })
            } else {
                this.$message.warning('请选择要删除的标签')
            }


        },
        // 标签列表
        getDataList(data, pageNo, pageSize) {
            // let para = {
            //     per_page: pageSize,
            //     current_page: pageNo,
            //     keyword: JSON.stringify(data)
            // };

            let para = {
                per_page: pageSize || getSession('searchFresh').pageSize,
                current_page: pageNo || getSession('searchFresh').pageNo,
                keyword: data ? JSON.stringify(data) : JSON.stringify(getSession('searchFresh').keyword),
            };
            this.loading = true
            requestMethods.getTagList('get', para).then(res => {
                if (res.code == 200) {
                    this.tableList = res.data.items
                    this.pagination = res.data.pagination_data
                } else {
                    this.$message.error(res.message || '列表获取失败')
                }
                this.loading = false
            })
        },
        publishFn(data) {
            // 考虑换成另一种提示方式
            this.$confirm('确认发布该作业吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let job_id = data.job_id
                    jobRequest.jobPublish('put', job_id).then(res => {
                        if (res.code == 200) {
                            this.$message.success('作业发布成功')
                            this.getDataList()
                        } else {
                            this.$message.error('作业发布失败，请重试')
                        }
                    })
                })
                .catch(() => {
                })
        },
        // 下架
        offShelfFn(data) {
            // 考虑换成另一种提示方式
            this.$confirm('确认下架该作业吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let job_id = data.job_id
                    jobRequest.jobUnPublish('put', job_id).then(res => {
                        if (res.code == 200) {
                            this.$message.success('作业下架成功')
                            this.getDataList()
                        } else {
                            this.$message.error('作业下架失败，请重试')
                        }
                    })
                })
                .catch(() => {
                })
        },
        // 删除数据
        deleteJob(row) {
            this.$confirm('确认删除该作业吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let job_id = row.job_id
                    jobRequest.deleteJobData('delete', job_id).then(res => {
                        if (res.code == 200) {
                            this.$message.success('作业删除成功')
                            this.getDataListEdit()
                        } else {
                            this.$message.error('作业删除失败，请重试')
                        }
                    })
                })
                .catch(() => {
                })
        },
        closeDialog() {
            this.tagObj.show = false;
        },
        // 上下分页
        handleCurrentChange(val) {
            this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
        },
        // 每页显示多少条
        handleSizeChange(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
        },
        toJobDetails(data) {
            this.$router.push({
                name: 'jobDetails',
                query: {job_id: data.job_id}
            })
        },
        beforeHandleCommand(row, command) {
            return {
                'row': row,
                'command': command
            }
        },
        handleCommand(command) {
            switch (command.command) {
                case 'edit':
                    this.$router.push({
                        name: 'addJobBase',
                        query: {
                            type: 'edit',
                            job_id: command.row.job_id
                        }
                    })
                    break;
                case 'delete':
                    this.deleteJob(command.row)
                    break;
                default:
                    break;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        isDisabled(row, index) {
            // 目前只有引用次数作为判断条件
            if (row.value.counts > 0) {
                return false
            } else {
                return true
            }
        }
    },
    components: {
        pageHeader,
        Pagination,
        enumSearch,
        addTag
    },
}
