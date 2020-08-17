import template from './index.vue'
import pageHeader from "@/components/pageHeader.vue"
import enumSearch from "@/components/searchCom/enumSearch.vue"
import Pagination from "@/components/pagination"
import approvalDialog from "../applicationSystem/addOrder/addOrderFirst/components/approval.vue"
import approvalHistory from "./approvalDetail/approvalHistory"
import * as requestMethods from "@/modules/apps/api/applicationCenter/myApproval.js"
import checkReport from "../components/checkReport/checkReport.vue"
// 空页面
import EmptyInTable from "@/components/emptyLayout/emptyInTable";
// import * as driverRequest from "@/modules/ops/api/deliveryOperation/driverManagement"
import {
    getSession
} from '@/commons/js/searchFresh.js'

export default {
    ...template,
    data() {
        return {
            searchNeedData: {
                data: []
            },
            dialogTableVisible:false,
            instance_id:null,
            ticket_id:null,
            approvalLoading: false,
            approvalList: [],
            approvalStatusList: [],
            pagination: {
                current_page: 1, // 当前位于哪页
                per_page: 10, //每页显示多少条
                total_count: 0,
                total_page: 1
            },
            defaultSearch:{
                isInput: true,
                isSave: true,
                isShuxing: false,
                isShuxingzhi: true,
                shuxing: "状态",
                shuxingzhi: "待审批",
                valueType: 1
            },
            defaultConfig: {
                exportDrawer: false,
                exportDrawerIframe: false,
                ticket_id:null,
                app_id:null,
            }
        }
    },
    methods: {
        toSearch(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        searchContdition() {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, getSession('searchFresh').pageSize)
        },
        //跳转到详情
        goDetail(row) {
            this.$router.push({
                path: "/applicationCenter/myApproval/approvalDetail",
                query:{
                    instance_id: row.instance_id,
                    from:'myApproval',
                    instance_user_id:row.instance_user_id
                }
            });
        },
        //获取审批列表
        getDataList(data, pageNo, pageSize) {
            let para = {
                per_page: pageSize,
                current_page: pageNo,
                keyword: JSON.stringify(data)
            };
            requestMethods.getMyApprovalList('get', para).then(res => {
                this.approvalList = res.data.items
                this.pagination = res.data.pagination_data
                this.approvalLoading = false
            })
        },
        //审批按钮事件
        onVerify(row) {
            this.dialogTableVisible = true
            this.ticket_id = row.ticket_id
            this.instance_id = row.instance_id
        },
        //跳转到报告页面
        checkReport(row) {
          window.open(`/apps.html#/report?ticket_id=${row.ticket_id}&app_id=${row.app_id}&ticket_name=${row.ticket_name}`)
          // this.defaultConfig.ticket_id = row.ticket_id
          // this.defaultConfig.app_id = row.app_id
          // this.defaultConfig.exportDrawer = true
          // let that  = this
          // setTimeout(() => {
          //     that.defaultConfig.exportDrawerIframe = true
          // }, 260);
        },
        //关闭导出报告抽屉
        handleClose() {
            this.defaultConfig.exportDrawer = false
            this.defaultConfig.exportDrawerIframe = false
        },
        // 上下分页
        handleCurrentChange(val) {
            this.getDataList(getSession('searchFresh').keyword, val, getSession('searchFresh').pageSize)
        },
        // 每页显示多少条
        handleSizeChange(val) {
            this.getDataList(getSession('searchFresh').keyword, getSession('searchFresh').pageNo, val)
        },
        approveCancel(){
            this.dialogTableVisible = false
        },
    },
    components: {
        pageHeader,
        Pagination,
        enumSearch,
        approvalDialog,
        approvalHistory,
        EmptyInTable,
        checkReport
    }
}
