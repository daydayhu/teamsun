import httpData from '@/request/dataService/index.js'

// 获取金属裸机数量
export function getBaremetalCount(type) {
    return httpData(type, `/v1/api/app/graph/ironic_count`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取待处理项数量
export function getWaitHandleCount(type) {
    return httpData(type, `/v1/api/app/graph/wait_handle`, {
        queryParams: "",
        contentType:'application/json;charset=utf-8'
    })
}

//获取应用类型统计
export function getApplicationType(type) {
    return httpData(type, `/v1/api/app/graph/application_type`, {})
}

//获取订单统计
export function getTicket(type) {
    return httpData(type, `/v1/api/app/graph/ticket`, {})
}

//获取业务组应用类型统计
export function getBusGroup(type) {
    return httpData(type, `/v1/api/app/graph/bus_group`, {})
}

// 获取应用资源统计
export function getApplicationResources(type) {
    return httpData(type, `/v1/api/app/graph/application_resources`, {})
}

// 基础数据 根据类型获取对应数据信息-
export function getDataBase(type, params) {
    return httpData(type, `/v1/api/search_settings`, {
        queryParams: params,
        contentType: "application/json;charset=utf-8"
    });
}

// 概览虚机数量接口
export function getVmwareCount(type) {
  return httpData(type, `/v1/api/app/graph/vmware`, {
      queryParams: "",
      contentType: "application/json;charset=utf-8"
  });
}

