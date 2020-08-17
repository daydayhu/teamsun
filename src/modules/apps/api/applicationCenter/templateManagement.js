import httpData from '@/request/dataService/index.js'
// 获取模版列表
export function getTemplates(type, params) {
    return httpData(type, `/v1/api/app/templates`, {
        queryParams: params,
    })
}

// 模版导出
export function templateExport(type, params) {
    return httpData(type, `/v1/api/app/templates/${params.template_id}/export`, {
    })
}

// 模版下架
export function templateOff(type, params) {
    return httpData(type, `/v1/api/app/templates/${params.template_id}/off`, {
    })
}

export function templateOn(type, params) {
    return httpData(type, `/v1/api/app/templates/${params.template_id}/on`, {
    })
}
