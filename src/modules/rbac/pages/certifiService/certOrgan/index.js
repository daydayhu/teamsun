import template from './index.vue'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import addCertOrgan from "./components/addCertOrgan.vue"
import {getSession} from '@/commons/js/searchFresh.js'
import * as requestMethod from "@/modules/rbac/api/certifiService/organizationApi.js"
import authId from './utils/config.js'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
  ...template,

  data() {
    return {
      organDialogObj: {
        show: false
      },
      loading: true,
      searchNeedData: {data: []},
      sortData: [],
      authId
    }
  },
  created() {

  },
  beforeUpdate: function () {
    this.$nextTick(function () {
      // 获取所有子节点元素/ 处理图标对齐问题
      let isLeafElement = document.getElementsByClassName('ts-organization-level')
      let arr = Array.prototype.slice.call(isLeafElement)
      arr.forEach(item => {
        let level = item.getAttribute('level')
        const baseNum = 18
        item.style.cssText = `padding-left: ${(level - 1) * baseNum}px`
        item.parentNode.parentNode.firstElementChild.style.cssText = `position: relative; left: ${(level - 1) * baseNum}px!important`
      });
    })
  },
  updated() {
  },
  mounted() {

  },
  methods: {
    searchContdition() {
      this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    toSearch(val) {
      this.getDataList(getSession('searchFresh').keyword);
    },
    getDataList(data = getSession('searchFresh').keyword, pageNo = getSession('searchFresh').pageNo, pageSize = getSession('searchFresh').pageSize) {
      let para = {
        per_page: pageSize,
        current_page: pageNo,
        keyword: JSON.stringify(data)
      };
      this.loading = true
      requestMethod.certOrganApi('get', para).then(res => {
        if (res.code == 200) {
          this.$set(this, 'sortData', res.data.items)
        }else {
          this.$message.error('获取组织列表失败')
        }

        this.loading = false
      })
    },
    refreshNodeBy(id) {
      let node = this.$refs.asyncTree.getNode(id); // 通过节点id找到对应树节点对象
      node.loaded = false;
      node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
    },
    addCertOrganDialog(data) {
      let isTop = typeof data.is_top_root
      this.organDialogObj = {
        rowData: isTop == 'undefined' ? '' : {...data},
        name: isTop == 'undefined' ? '部门名称' : '组织名称',
        type: 'add',
        title: isTop == 'undefined' ? '新建部门' : '新建组织',
        show: true,
        is_top_root: isTop == 'undefined' ? 0 : 1,
        dep_parent_id: isTop == 'undefined' ? data.dep_id : 0,
      }
    },
    editCertOrganDialog(row) {
      let type = row.is_root
      this.organDialogObj = {
        rowData: {...row},
        title: type ? '编辑组织' : '编辑部门',
        name: type ? '组织名称' : '部门名称',
        show: true,
        type: 'edit',
        // 编辑时判断如果是组织则显示管理员，部门则不显示
        is_top_root: row.is_root == 0 ? 0 : 1,
        dep_parent_id: row.dep_id
      }
    },
    deleteCertOrgan(node, row) {
      this.$confirm(`确认删除${row.dep_name}吗?`, '提示', {
        type: 'warning'
      })
        .then(() => {
          const para = {dep_id: row.dep_id}
          requestMethod.certOrganApi('delete', para).then(res => {
            if (res.code == 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
            } else {
              this.$message.error(res.message);
            }
          })
        })
        .catch(() => {
        })
    },
    closeDialog() {
      this.organDialogObj.show = false
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      if (draggingNode.data.dep_id === dropNode.data.dep_id) return
      let para = {
        target_dep_id: dropNode.data.dep_id,
        source_dep_id: draggingNode.data.dep_id
      }
      requestMethod.certOrganApi('post', para, 'order').then(res => {
        if (res.code === 200) {
          this.$message({
            message: '移动成功',
            type: 'success'
          })
        } else {
          this.$message.error('移动失败');
        }
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      // 设置只允许同级拖拽
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false
      }
    },
    searchList(data) {
      // 列表查询
      this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
    },
    showCertOrganDetails(data) {
      let ts = JSON.stringify({
        dep_id: data.dep_id,
        is_root: data.is_root,
        org_id: data.root_id
      })
      this.$router.push({name: 'certOrganDetails', query: {ts}})
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
          this.editCertOrganDialog(command.row)
          break;
        case 'delete':
          this.deleteCertOrgan(command.node, command.row)
          break;
        default:
          break;
      }

    },
    nodeExpand() {
      this.$nextTick(function () {
        // 获取所有子节点元素/ 处理图标对齐问题
        let isLeafElement = document.getElementsByClassName('ts-organization-level')
        let arr = Array.prototype.slice.call(isLeafElement)
        arr.forEach(item => {
          let level = item.getAttribute('level')
          const baseNum = 18
          item.style.cssText = `padding-left: ${(level - 1) * baseNum}px`
          item.parentNode.parentNode.firstElementChild.style.cssText = `position: relative; left: ${(level - 1) * baseNum}px!important`
        });
      })
    }

  },
  components: {
    pageHeader,
    addCertOrgan,
    enumSearch
  },
}
