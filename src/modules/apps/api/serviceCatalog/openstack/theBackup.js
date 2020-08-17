import httpData from '@/request/dataService/index.js'
//添加备份表单
export function addBackup(params) {
    return httpData('post', '/v1/api/app/forms/backup', {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//编辑备份表单
export function editBackup(id,params) {
    return httpData('put', `/v1/api/app/forms/backup/${id}`, {
        queryParams: params,
        contentType:'application/json;charset=utf-8'
    })
}
//删除备份表单
export function deleteBackup(id) {
    return httpData('delete', `/v1/api/app/forms/backup/${id}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//获取备份表单列表
export function requireBackupList(params) {
    return httpData('get', `/v1/api/app/forms/backup?canvas_uuid=${params.canvas_uuid}`, {
        contentType:'application/json;charset=utf-8'
    })
}
//获取主机列表
export function requireHostList(appId,ticketId) {
    return httpData('get', `/v1/api/app/computes?app_id=${appId}&ticket_id=${ticketId}`, {
        contentType:'application/json;charset=utf-8'
    })
}