import httpData from '@/request/dataService/index.js'
//添加4A表单
export function addFourA(params) {
    return httpData('post', '/v1/api/app/service4a/service4a_ticket', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//编辑4A表单
export function editBackup(id,params) {
    return httpData('put', `/v1/api/app/service4a/service4a_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//删除4A表单
export function deleteFourA(id) {
    return httpData('delete', `/v1/api/app/service4a/service4a_tickets?api_auth_id=${id}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//获取4A表单列表
export function requireFourAList(params) {
    return httpData('get', `/v1/api/app/service4a/service4a_ticket`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//获取主机下拉列表
export function requireHostList(params) {
    return httpData('get', `/v1/api/app/vmwares/get_ticket_log_vm_name`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
