import template from './index.vue';
import Pagination from "@/components/pagination";
import {cloudData,userTableData} from './utils/utils';
import authId from './utils/config'
import {
    mapState
} from 'vuex'
import registerForm from './components/registerForm'
import enumSearch from "@/components/searchCom/enumSearch.vue"
import * as requestMethod from "@/modules/rbac/api/certifiService/ldapRegist";
import list from "./components/list"
import {getSession} from '@/commons/js/searchFresh.js';
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
export default {
    ...template,
    components: {
      pageHeader,
        Pagination,
        registerForm,
        enumSearch,
        list
    },
    data() {
        return {
            authId,
            isWarmPrompt: true,
            drawer: false,
            tableHeader: cloudData.tableHeader,
            tableData: [],
            userDrawer:false,
            userTableData: {
                ...userTableData,
                defaultCheckedData: []
            },
            checkBoxInfo:[],
            pagination: {
                current_page: 1, // 当前位于哪页
                per_page: 10, //每页显示多少条
                total_count: 0,
                total_page: 1
            },
            loading: false,
            userLoading:false,
            getRowKeys(row) {
                return row.ldap_id;
            },
            isShow: false,
            dialogFormVisible: false,
            editPwdData: {},
            ldap_id: 0,
            importLdapId:0,
            keywords:''
        }
    },
    computed: {
        ...mapState('global', [
            'auth'
        ]),

    },
    async mounted() {
        await this.getLdapList();
    },
    methods: {
        //搜索框按条件搜索事件
        // searchContdition(){
        //     this.getLdapList()
        // },

        add() {
            this.isShow = true;
            this.ldap_id = 0;
        },
        handleCommand(data) {
            const {row, command} = data;
            if (command === 'edit') {
                this.ldap_id = row.ldap_id;
                this.isShow = true;
            } else if (command === 'del') {
                this.deleteCloud(row);
            }
        },

        toggleRow(row, expanded) {
            this.$refs.refTable.toggleRowExpansion(row, expanded)
        },
        getCloudIdIndex(cloud_id) {
            return this.tableData.findIndex(item => item.cloud_id === cloud_id);
        },
        async deleteCloud(row) {
            const {ldap_id} = row;
            const messageParam = {title:'确定删除？',type:'success'};
            const confirmResult = await this.handleMessage(messageParam);
            if(confirmResult !== 'confirm'){
                return false;
            }
            const res = await requestMethod.deleteLdap('delete',{ldap_ids:[ldap_id]});
            if(res.code === 200){
                this.$message.success(res.message || '删除成功');
                this.getLdapList({
                    per_page: this.pagination.per_page,
                    current_page:this.pagination.current_page
                });
            }else{
                this.$message.error(res.message || '删除失败');
            }
        },

        async handleMessage(messageParam){
            const {title, type} = messageParam;
            const confirmResult = await this.$confirm(title,'提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type
            }).catch(err=>err);

            return confirmResult;
        },

        beforeHandleCommand(row, command) {
            return {
                'row': row,
                'command': command
            }
        },
        async clearInput(){
            let arr = this.checkBoxInfo.slice(0);
            this.keywords = '';
            this.userTableData.defaultCheckedData = arr;
            this.$refs['listTable'].getTableRow();
            await this.userImport({ldap_id:this.importLdapId});

        },
        closeDialog(tag,flag) {
            this[tag] = flag;
        },
        async userImport(row){
            const {ldap_id} = row;
            this.importLdapId = ldap_id;
            this.closeDialog('userDrawer',true)
            this.userLoading = true;
            try {
                let result = await Promise.all([this.getLdapUsersList(ldap_id)]);
                this.userTableData.tableData = result[0];
                this.userLoading = false;
            } catch (err) {}

        },
        async getLdapUsersList(ldap_id){
            const res = await requestMethod.getLdapUsersList('get',{ldap_id});
            if(res.code === 200){
                return res.data.items;
            }
        },
        async getCmpUserData(ldap_id){
            const cmpUserData = await requestMethod.getCmpUsers('get',{ldap_id});
            if(cmpUserData.code === 200){
                return cmpUserData.data.items;
            }
        },
        setUserDrawer(flag){
            this.userDrawer = flag;
        },
        async getLdapList(param = {}) {
            this.loading = true;
            const res = await requestMethod.getLdapsList('get', param);
            if (res.code === 200) {
                this.tableData = res.data.items;
                this.pagination = res.data.pagination_data;
            }
            this.loading = false;

        },
        handleTableData(data) {
            data.map(item => {
                item.percentage = 0;
                item.sync_pre_log_index = 0;
                item.syncEachList = [];
            });
            return data;
        },
        handleCurrentChange(current_page) {
            this.getLdapList({
                per_page: this.pagination.per_page,
                current_page
            });
        },

        handleSizeChange(pre_page) {
            this.getLdapList({
                per_page: pre_page,
                current_page: this.pagination.current_page
            });
        },
        setCheckBoxInfo(data) {
            const { tableData, defaultCheckedData } = this.userTableData;
            let arr = [];
            if (defaultCheckedData.length) {
                arr = defaultCheckedData.filter(item => !tableData.some(state => state['user_name'] === item['user_name']))
            }
            this.checkBoxInfo = [...arr, ...data];

        },
        handleSearch(){
            let arr = this.checkBoxInfo.slice(0);
            const filterData = this.userTableData.tableData.filter(item => ((item.user_name.indexOf(this.keywords) > -1)));
            if (filterData) {
                this.userTableData.tableData = filterData;
                this.userTableData.defaultCheckedData = arr;
                this.$refs['listTable'].getTableRow();
            }

        },
        async handelOk(){
           const res = await requestMethod.reportUsers('post',{ldap_id:this.importLdapId,ldap_user:this.checkBoxInfo});
           if(res.code === 200){
               this.$message.success(res.message || '保存成功');
               this.closeDialog('userDrawer', false)
           }else{
               this.$message.error(res.message || '保存失败');
           }
        },
    }

}
