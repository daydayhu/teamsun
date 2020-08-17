import template from './index.vue'
//引入公共头部组件
import pageHeader
    from "@/components/pageHeader.vue"
//引入使用指引组件
import guide from "@/components/guide/guide.vue"
import guideItem
    from "@/components/guide/guide_item.vue"
import VeHistogram
    from 'v-charts/lib/histogram.common' // 柱状
import annular from "./components/annular";// 环形图
import pie from "./components/pie"
import columnar from "./components/columnar";
import * as requestMethod
    from "@/modules/apps/api/dashboard/dashboard";
import { getVmwareCount } from '../../../api/dashboard/dashboard'


export default {
    ...template,
    data() {
        return {
            show: false,
            guideVisible: false,
            IronicCount: {},
            vmwareCount: {
                memory: {},
                disk: {},
                suspended_vms: {},
                poweredOn_vms: {},
                poweredOff_vms: {}
            },
            waitHandleData: {},
            applicationTypeData:{
                chartData:{columns:['key', 'value'],rows:[]},
                legend:{
                    data:[
                        {
                            name:'业务应用系统',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/g_app_dashboard_yewu.png')}`
                        },
                        {
                            name:'资源服务类应用',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/g_app_dashboard_ziyuan_fuwu.png')}`
                        },
                        {
                            name:'平台类应用系统',
                            textStyle:{
                                fontSize:12,
                                fontWeight:'bolder',
                                color:'#cccccc'
                            },
                            icon:`image://${require('@/commons/images/g_app_dashboard_pingtai_leixing.png')}`
                        },

                    ]
                },
                color:["#7C67FE",  "#F4C427", "#26C7B7"],

            },
            ticketData:{
                chartData:{columns:['key', 'value'],rows:[],},
                legend:{
                    data: [
                        {
                            name: '需求收集',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_xuqiu_shouji.png')}`
                        },
                        {
                            name: '需求收集审批',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_xuqiu_shenpi.png')}`
                        },
                        {
                            name: '资源规划',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_ziyuan_guihua.png')}`
                        },
                        {
                            name: '资源规划审批',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_ziyuan_guihua_shenpi.png')}`
                        },
                        {
                            name: '资源部署',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_ziyuan_bushu.png')}`
                        },
                        {
                            name: '部署完成',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bolder',
                                color: '#cccccc'
                            },
                            icon: `image://${require('@/commons/images/g_app_dashboard_yiwancheng.png')}`
                        },

                    ]
                },
                color: ["#F4C427", "#306BFF", "#7C67FE", "#D0AA71", "#FF9060", "#26C7B7"],
            },


        }
    },
    components: {
        pageHeader,
        guide,
        guideItem,
        VeHistogram,
        annular,
        pie,
        columnar

    },
    mounted() {
        this.getIronicCount()
        this.getWaitHandleData()
        this.getApplicationTypeData();
        this.getTicketData();
        this.getVmwareCount()
    },
    methods: {
        //使用指引点击事件
        handleGuide() {
            this.guideVisible = !this.guideVisible
        },
        //跳转应用系统
        toSystem() {
            this.$router.push({
                path: './applicationSystem',
            })
        },
        //跳转服务
        toService() {
            this.$router.push({
                path: './serviceCatalog',
            })
        },
        //跳转订单
        toOrder() {
            this.$router.push({
                path: './myOrder',
            })
        },
        // 获取裸机数量
        async getIronicCount() {
            let res = await requestMethod.getBaremetalCount("get")
            if (res.code == 200) {
                this.IronicCount = res.data
            }
        },
        // 获取待处理项数据
        async getWaitHandleData() {
            let res = await requestMethod.getWaitHandleCount("get")
            if (res.code == 200) {
                this.waitHandleData = res.data
            }
        },
        //获取虚机数量
        async getVmwareCount() {
            let res = await requestMethod.getVmwareCount("get")
            if (res.code == 200) {
                this.vmwareCount = res.data.item
            }
        },
        /**
         *
         * 获取应用类型统计
         */
        async getApplicationTypeData() {
            const res = await requestMethod.getApplicationType('get');
            if (res.code === 200) {
                const rows = this.handlePieData(res.data.graph);
                this.applicationTypeData.chartData.rows = rows;
            }
        },


        /**
         *
         * 获取订单类型统计
         */
        async getTicketData() {
            const res = await requestMethod.getTicket('get');
            if (res.code === 200) {
                const rows = this.handlePieData(res.data.graph);
                this.ticketData.chartData.rows = rows
            }
        },
        handlePieData(graph){
            let arr = [];
            for(let key in graph){
                let value = {key:key, value:graph[key]};
                arr.push(value);
            }
            return arr;
        },
        toMytask() {
            window.location.href = "./apps.html#/applicationCenter/myTask"
        },
        toDeploytask() {
            window.location.href = "./apps.html#/applicationCenter/deploymentTask"
        },
        toMyApproval() {
            window.location.href = "./apps.html#/applicationCenter/myApproval"
        },
    },

}
