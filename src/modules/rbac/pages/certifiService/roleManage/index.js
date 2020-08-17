import template from './index.vue';
import * as requestMethod from "@/modules/rbac/api/certifiService/roleManageApi";
import Pagination from "@/components/pagination";
import enumSearch from "@/components/searchCom/enumSearch.vue"
import { getSession } from '@/commons/js/searchFresh.js'
import addRole from "./components/addRole";
import customList from '../components/customList.vue';
import { roleTable } from './utils/utils';
import authId from './utils/config'
import { mapState } from 'vuex'
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
    ...template,
    components: {
      pageHeader,
        Pagination,
        customList,
        enumSearch
    },
    data() {
        return {
            authId,
            isWarmPrompt: true,
            drawer: false,
            checkboxListOptions: [
                { label: '角色名称' }
            ],
            tableHeader: roleTable.tableHeader,
            filterTableHeader: roleTable.tableHeader,
            pagination: {
                current_page: 1, // 当前位于哪页
                per_page: 10, //每页显示多少条
                total_count: 0,
                total_page: 1
            },
            tableData: [],
            radio: 'user',
            keywords: '',
            checkList: [],
            active: 0,
            customListVisible: false,
            loading: false
        }
    },
    computed: {
        ...mapState('global', [
            'auth'
        ]),
        tableHeaderList() {
            if (this.filterTableHeader.length > 0) {
                return this.filterTableHeader;
            } else {
                return this.tableHeader;
            }
        }
    },
    mounted() {
        // 分页 和 搜索组件
        //this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
    },
    methods: {
        searchContdition(){
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        toSearch(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        getDataList(data, pageNo, pageSize) {
            let para = {
                per_page: pageSize,
                current_page: pageNo,
                keyword: JSON.stringify(data)
            };
            this.loading = true
            requestMethod.roleList('get', para).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data.items;
                    this.pagination = res.data.pagination_data;
                }
                this.loading = false;
            })
        },

        handleSearch() {
            const keyword = JSON.stringify({ role_name: this.keywords });
            this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
        },
        // 删除数据
        async handleClickDelete(index, data) {
            const { role_id } = data;
            const res = await requestMethod.isBind('get', {role_id});
            if(res.code === 200){
                const title = res.data.is_bind ? '有关联的授权对象' : '';
                this.$confirm(`${title}确认删除该角色吗?`, '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.loading = true
                        requestMethod.deleteRole('delete', { role_id }).then(res => {
                            if (res.code === 200) {
                                this.loading = false
                                this.$message.success(res.message);
                                this.getDataList(getSession('searchFresh').keyword, 1, getSession('searchFresh').pageSize)
                            }
                        })
                    })
                    .catch(() => {})
            }

        },
        handleCurrentChange(val) {
            this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
        },
        handleSizeChange(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
        },
        clickWarmPrompt: function() {
            this.isWarmPrompt = false;
        },
        handleClose: function(done) {
            done();
        },
        clickRoleName: function(data) {
          console.log(data)
            const { role_id } = data;
            this.$router.push({ name: 'roleDetails', query: { role_id } })
        },
        closeDialog(res, obj) {
            this.drawer = false;
        },
        addRole() {
            this.$router.push({ name: 'addRole',params:{bj:'add'}})
        },
        handleClickEdit(index, data) {
            const { role_id } = data;
            this.$router.push({ name: 'addRole', query: { role_id } ,params:{bj:'edit'}})
        },
        closeCustomListDialog: function(val) {
            if (val.length) {
                const newTableHeader = [];
                val.forEach(item => {
                    const data = this.tableHeader.find(val => val.label == item);
                    newTableHeader.push(data);
                });
                this.filterTableHeader = newTableHeader;
            }
            this.customListVisible = false;
        },
        customListBtn: function() {
            this.customListVisible = true
        },

    }

}
