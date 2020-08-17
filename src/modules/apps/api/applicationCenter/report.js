import httpData from '@/request/dataService/index.js'
// 应用系统 订单报告
export function getReport(type, params) {
    return httpData(type, `/v1/api/app/systems/report?app_id=${params.app_id}&ticket_id=${params.ticket_id}&step_type=3`, {
        queryParams:"",
    })
}

