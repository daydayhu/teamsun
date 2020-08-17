import template from './index.vue';
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"
import * as requestMethod from "@/modules/apps/api/applicationCenter/templateManagement";
import {
    getSession
} from '@/commons/js/searchFresh.js';
import enumSearch
    from '@/components/searchCom/enumSearch.vue';
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
            defaultIconUrl: require('@/commons/images/template-default.png'),
            productStatusInfo: {
                0: {
                    url: require('@/commons/images/service_status_unpublish@2x.png'),
                    text: '未发布'  // 草稿
                },
                1: {
                    url: require('@/commons/images/service_status_published@2x.png'),
                    text: '已发布'
                },
                2: {
                    url: require('@/commons/images/service_status_falling@2x.png'),
                    text: '已下架'
                },
                3: {
                    url: require('@/commons/images/service_status_falling@2x.png'),
                    text: '已过期'
                }
            }
        };

    },
    computed: {
    },
    components: {
        pageHeader,
        enumSearch
    },
    async mounted() {
        // this.getId();
        // this.$nextTick(()=>{
        //     this.getTemplatesList();
        // })

    },
    methods: {
        searchContdition(){
            this.getTemplatesList()
        },
        toSearch() {
            this.getTemplatesList();
        },
        async getTemplatesList(data, pageNo, pageSize) {
            let param = {
                per_page: pageSize || getSession('searchFresh').pageSize,
                current_page: pageNo || getSession('searchFresh').pageNo,
                keyword: data ? JSON.stringify(data) : JSON.stringify(getSession('searchFresh').keyword),
            };
            this.serviceListLoading = true;
            const res = await requestMethod.getTemplates('get',param);
            if(res.code === 200){
                this.serviceList = res.data.items;
            }else{
                this.$message.error(res.message || '获取信息失败');
            }
            this.serviceListLoading = false;
        },
        setAppValue(data){
            if(data.length > 0) this.app_id = data[0].app_id;
        },

        async handleExport(item){
            const {template_id} = item;
            const response = await requestMethod.templateExport('getBlob', {template_id});
            if(response.status == 200){
                const url = window.URL.createObjectURL(new Blob([JSON.stringify(response)]));
                const downloadLink = document.createElement("a");
                downloadLink.href = url;
                // 前提是服务端要在header设置Access-Control-Expose-Headers: Content-Disposition
                // 前端才能正常获取到Content-Disposition内容
                const disposition = response.headers['content-disposition'];
                let fileName = disposition.substring(disposition.indexOf('filename=') + 9, disposition.length);
                // iso8859-1的字符转换成中文
                fileName = decodeURI(escape(fileName));
                // 去掉双引号
                fileName = fileName.replace(/\"/g, "");
                downloadLink.download =  item.template_name + '.json';
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }else{
                this.$message.error('下载失败');
            }
        },

        async handleDownload(item){
            const {template_id} = item;
            const response = await requestMethod.templateOff('put', {template_id});
            if(response.code == 200){
                this.getTemplatesList();
                this.$message.success(response.message || '下架成功')
            }else{
                this.$message.error(response.message || '下架失败');
            }
        },

        async handlePublic(item){
            const {template_id} = item;
            const response = await requestMethod.templateOn('put', {template_id});
            if(response.code == 200){
                this.getTemplatesList();
                this.$message.success(response.message || '发布成功')
            }else{
                this.$message.error(response.message || '发布失败');
            }
        }

    },
};
