import template from './index.vue';
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
import * as requestMethod from "@/modules/apps/api/serviceCatalog/serviceCatalogList";
import enumSearch from '@/components/searchCom/enumSearch.vue';
import {getSession} from '@/commons/js/searchFresh.js';
export default {
    ...template,
    data() {
        return {
            bus_group_id:9,
            serviceOptions:[],
            serviceList:[],
            originalServiceList:[],
            appsOptions:[],
            service_type:'all',
            app_id:'',
            keywords:'',
            serviceListLoading:false,
            serviceOptionsLoading:false,
            dialogTableVisible:false,
            isAdd:true,
            defaultIconUrl: require('@/commons/images/catalog.svg'),
        };

    },
    computed: {},
    components: {
        pageHeader,
        enumSearch
    },
    async mounted() {
        // this.getId();
        this.$nextTick(()=>{
            this.getServiceOptions();
            // this.appsSystemsList();
            // this.getSelectedServicesList();
        })

    },
    methods: {
        searchContdition(){
            this.getSelectedServicesList()
        },
        toSearch() {
            this.getSelectedServicesList();
        },
        //蓝图定义--创建订单
        addOrder() {
        this.$router.push({
            path: '/applicationCenter/applicationSystem/addOrder/addOrderFirst',
            query: {
                operation: 'add',
                ticket_type:2,//1:快速申请，2:蓝图定义
                from:"service"
            }
        })
        },

        // 快速申请-创建订单
        applyTo(item) {
            const {pro_service_type,pro_service_id,ticket_flow_id} = item;
            let bus_ids = '';
            let len = item.bus_id_list.length;
            item.bus_id_list.forEach((item,index)=>{
                if(index !== len-1){
                    bus_ids += item+','
                }else{
                    bus_ids += item
                }

            })
            this.$router.push({
              //  path: '/applicationCenter/serviceCatalog/applyService/applyServicePrev',
                path: '/applicationCenter/applicationSystem/addOrder/addOrderFirst',
                query: {
                    //pro_service_type,
                    service_id:pro_service_id,
                   // app_id:this.app_id,
                   // ticket_flow_id,
                    operation: 'add',
                    ticket_type:1,//1:快速申请，2:蓝图定义
                    service_name:item.alias_name,
                    bus_ids:bus_ids,
                    from:"service"
                },
            })
        },
        /**
         * 服务列表
         */
        async getServiceOptions() {
            this.serviceOptionsLoading = true;
            const res = await requestMethod.getServicePath('get', {config_type: 12});
            if (res.code === 200) {
                const data = this.filterOptions(res.data.items);
                this.serviceOptions = [{
                    config_id: 0,
                    config_key:'all',
                    config_type: {
                        type: 0,
                        value: '全部'
                    },
                    children: data
                }];
            } else {
                this.$message.error(res.message || '获取服务目录失败');
            }

            this.serviceOptionsLoading = false;
        },

        /**
         * 头部的应用系统
         */
        async appsSystemsList(){
            const res = await requestMethod.appsSystems('get');
            if(res.code === 200){
                this.appsOptions = res.data.items;
                this.setAppValue(res.data.items);
            }else{
                this.$message.error(res.message || '获取应用系统失败');
            }

        },

        async getSelectedServicesList(data, pageNo, pageSize) {
          this.serviceListLoading = true;
            let param = {
                per_page: pageSize || getSession('searchFresh').pageSize,
                current_page: pageNo || getSession('searchFresh').pageNo,
                keyword: data ? JSON.stringify(data) : JSON.stringify(getSession('searchFresh').keyword),
            };
          const res = await requestMethod.getChooseServices('get',{service_type:this.service_type,param});
          if(res.code === 200){
            this.serviceList = res.data.items;
            this.originalServiceList = res.data.items;
          }else{
            this.$message.error(res.message || '获取信息失败');
          }
          this.serviceListLoading = false;
        },
        setAppValue(data){
            if(data.length > 0) this.app_id = data[0].app_id;
        },

        handleSearch(){
            if(this.keywords == ""){
                this.serviceList = this.originalServiceList;
                return;
            }
            const filterData = this.serviceList.filter(item => ((item.alias_name.indexOf(this.keywords) > -1)));
            if (filterData) {
                this.serviceList = filterData;
            }

        },
        async clearInput(){
            this.keywords = '';
            await this.getSelectedServicesList();
        },

        getBusGroupId(val){
           if(this.appsOptions.length > 0){
               return this.appsOptions.find(item=>item.app_id === val);
           }
        },
        handleSelectNode(data) {
            this.serviceListLoading = true;
            this.service_type = data.config_key;
            this.getSelectedServicesList();
        },

        filterOptions(arr) {
            return arr.filter(item => item.parent_id !== null);
        },
        getId() {
            const {bus_group_id} = this.$route.query;
            this.bus_group_id = bus_group_id ? bus_group_id : 0;
        },
        check() {
            this.dialogTableVisible = !this.dialogTableVisible
        }
    },
};
