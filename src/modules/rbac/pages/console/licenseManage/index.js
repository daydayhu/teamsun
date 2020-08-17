import template from './index.vue';
import updateLicense from './components/updateLicense'
import * as requestMethod from "@/modules/rbac/api/console/license"
//引入公共头部组件
import pageHeader from "@/components/pageHeader.vue"

export default {
    ...template,
    name:'licenseManage',
    data() {
        return {
            drawer:false,
            type: "",
            produce_time: "",
            expire_time: "",
            auth_num: {},
        };
    },
    components: {
        pageHeader,
        updateLicense
    },
    methods:{
        // 更新许可证
        updateLicense() {
            this.drawer = true
        },
        // 关闭抽屉
        closeDrawer(status) {
            this.drawer = status
        },
        // 获取许可证数据
        async getLicenseData() {
            let res = await requestMethod.getLicenseInfo("get")
            if( res.code === 200 ) {
                this.type = res.data.type_name
                this.produce_time = res.data.produce_time
                this.expire_time = res.data.expire_time
                this.auth_num = res.data.auth_num
            }
        }
    },
    mounted() {
        this.getLicenseData()
    }
};
